<template>
  <div>
    <Navigation v-bind:form="user.user" v-bind:user="user"></Navigation>
    <h1 class="text-center py-2">Artist Dashboard</h1>
    <div class="mx-5">
      <div>
        <div v-if="errorMessage" ref="message" class="alert alert-danger" role="alert">
          {{ errorMessage }}
        </div>
        <b-button @click="showForm = !showForm" block variant="primary">Toggle Album Form</b-button>
        <form v-if="showForm" @submit.prevent="addAlbum()" class="py-3">
          <div class="form-group">
            <label for="album_id">Album ID</label>
            <input
            v-model="form.album_id"
            type="text"
            class="form-control"
            id="album_id"
            aria-describedby="albumidHelp"
            placeholder="Enter your album ID" required>
            <small id="albumidHelp"
            class="form-text text-muted">You must enter unique album ID.</small>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="album_title">Album Title</label>
              <input
              v-model="form.album_title"
              type="text"
              class="form-control"
              id="album_title" aria-describedby="albumTitleHelp"
              placeholder="Enter title of your album" required>
            </div>
            <div class="form-group col-md-6">
              <label for="album_genre">Album Genre</label>
              <input
              v-model="form.album_genre"
              type="text"
              class="form-control"
              id="album_genre" aria-describedby="albumGenreHelp"
              placeholder="Enter genre of your album" required>
            </div>
          </div>
          <div class="form-row">
            <div class="form-group col-md-6">
              <label for="song">Song ID</label>
              <input
              v-model="form.song_id"
              type="text" class="form-control" id="song_id"
              aria-describedby="songIdHelp"
              placeholder="Enter your song ID" required>
              <small id="songIdHelp"
              class="form-text text-muted">You must enter unique song ID</small>
            </div>
            <div class="form-group col-md-6">
              <label for="song_title">Song Title</label>
              <input
              v-model="form.song_title"
              type="text" class="form-control" id="song_title"
              aria-describedby="songTitleHelp"
              placeholder="Enter title of your song" required>
            </div>
          </div>
          <button type="submit" class="btn btn-primary">Add Album</button>
        </form>
      </div>
    </div>
    <div class= "mx-5 pt-4">
      <b-table :items="items" :fields="fields" striped responsive="sm"
      head-variant="light" class="text-center">
        <template v-slot:cell(details)="row">
          <b-button size="sm" v-on:click="row.toggleDetails" @click="getSong(row.item.album_id)"
            class="mr-2">
              {{ row.detailsShowing ? 'Hide' : 'Show'}} Songs
            </b-button>
        </template>
        <template v-slot:row-details>
          <div class="pt-2">
            <b-table :items="songItems" :fields="songFields" striped responsive="sm"
              head-variant="dark" class="text-center">
              <template v-slot:cell(song_actions)>
                <b-button size="sm" @click="infoAlbums(row.item.artist_name, $event.target)"
                  class="mr-2">
                  Edit Song
                </b-button>
                <b-button size="sm" @click="infoAlbums(row.item.artist_name, $event.target)"
                  class="mr-2">
                  Delete Song
                </b-button>
              </template>
            </b-table>
          </div>
        </template>
        <template v-slot:cell(album_actions)="row">
          <b-button size="sm" @click="editAlbumForm = !editAlbumForm"
          class="mr-2">
            Edit Album {{editAlbumForm}}
          </b-button>
          <b-button size="sm" @click="deleteAlbum(row.item.album_id)"
          class="mr-2">
            Delete Album
          </b-button>
        </template>
        <template v-slot:item.album_actions>
          <div v-if="editAlbumForm">
            <b-form @submit.prevent="editAlbum()" class="py-3">
              <div class="form-group">
                <label for="album_id">Album ID</label>
                <input
                v-model="form.album_id"
                type="text"
                class="form-control"
                id="album_id"
                aria-describedby="albumidHelp"
                placeholder="Enter your album ID" required>
                <small id="albumidHelp"
                class="form-text text-muted">You must enter unique album ID.</small>
              </div>
              <div class="form-row">
                <div class="form-group col-md-6">
                  <label for="album_title">Album Title</label>
                  <input
                  v-model="form.album_title"
                  type="text"
                  class="form-control"
                  id="album_title" aria-describedby="albumTitleHelp"
                  placeholder="Enter title of your album" required>
                </div>
                <div class="form-group col-md-6">
                  <label for="album_genre">Album Genre</label>
                  <input
                  v-model="form.album_genre"
                  type="text"
                  class="form-control"
                  id="album_genre" aria-describedby="albumGenreHelp"
                  placeholder="Enter genre of your album" required>
                </div>
              </div>
              <button type="submit" class="btn btn-primary">Edit Album</button>
            </b-form>
          </div>
        </template>
      </b-table>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const ALBUM_URL = 'http://localhost:5000/api/v1/albums';
const SONG_URL = 'http://localhost:5000/api/v1/songs';

export default {
  components: {
    Navigation,
  },
  data: () => ({
    errorMessage: '',
    user: {
      user: '',
      role: '',
    },
    items: [],
    fields: [
      { key: 'album_id', label: 'ID' },
      { key: 'title', label: 'TITLE' },
      { key: 'genre', label: 'GENRE' },
      { key: 'number_of_likes', label: 'LIKES' },
      { key: 'details', label: 'Details' },
      { key: 'album_actions', label: 'Actions' },
    ],
    songItems: [],
    songFields: [
      { key: 'song_id', label: 'ID' },
      { key: 'title', label: 'TITLE' },
      { key: 'number_of_likes', label: 'LIKES' },
      { key: 'song_actions', label: 'Details' },
    ],
    form: {
      album_id: '',
      album_title: '',
      album_genre: '',
      song_id: '',
      song_title: '',
    },
    showForm: false,
    editAlbumForm: false,
  }),
  mounted() {
    fetch(API_URL, {
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => res.json())
      .then((result) => {
        if (result.user) {
          // console.log(result.user);
          this.user = result.user;
          console.log(this.user);
          this.getAlbums();
        }
      });
  },
  methods: {
    getAlbums() {
      // console.log(this.user);
      fetch(`${ALBUM_URL}/${this.user.user}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result);
          this.items = result.result;
        // console.log(this.items);
        });
    },
    addAlbum() {
      console.log(this.form);
      const albumBody = {
        album_id: this.form.album_id,
        genre: this.form.album_genre,
        title: this.form.album_title,
      };
      fetch(`${ALBUM_URL}/${this.user.user}`, {
        method: 'POST',
        body: JSON.stringify(albumBody),
        headers: {
          'content-type': 'application/json',
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          if (result.message) {
            // this.errorMessage = 'You have to enter unique album ID';
            this.errorMessage = result.message;
            // console.log(result.message);
            setTimeout(() => {
              this.errorMessage = '';
            }, 2000);
          } else {
            this.getAlbums();
          }
        }).then(() => {
          const songBody = {
            song_id: this.form.song_id,
            title: this.form.song_title,
          };
          fetch(`${SONG_URL}/${this.user.user}/${this.form.album_id}`, {
            method: 'POST',
            body: JSON.stringify(songBody),
            headers: {
              'content-type': 'application/json',
              authorization: `Bearer ${localStorage.token}`,
            },
          }).then((res) => res.json())
            .then((result) => {
              if (result.message) {
                // this.errorMessage = 'You have to enter unique album ID';
                this.errorMessage = result.message;
                // console.log(result.message);
                setTimeout(() => {
                  this.errorMessage = '';
                }, 2000);
                // delete album maybe ?
              } else {
                this.form = {
                  album_id: '',
                  album_title: '',
                  album_genre: '',
                  song_id: '',
                  song_title: '',
                };
                this.showForm = false;
              }
            });
        });
    },
    deleteAlbum(albumId) {
      fetch(`${ALBUM_URL}/${this.user.user}/${albumId}`, {
        method: 'DELETE',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          if (result.message) {
          // this.errorMessage = 'You have to enter unique album ID';
            this.errorMessage = result.message;
            // console.log(result.message);
            setTimeout(() => {
              this.errorMessage = '';
            }, 2000);
          } else {
            this.errorMessage = `Album ${albumId} is deleted. 😬`;
            // console.log(result.message);
            setTimeout(() => {
              this.errorMessage = '';
            }, 2000);
            this.getAlbums();
          }
        });
    },
    getSong(albumId) {
      fetch(`${SONG_URL}/${albumId}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          // console.log(result.result);
          this.songItems = result.result;
          // console.log(this.songItems);
        });
    },
  },

};
</script>

<style>

</style>
