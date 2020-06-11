<template>
<div>
    <Navigation v-bind:form="user.user" v-bind:user="user"></Navigation>
    <h1 class="text-center pt-5">Albums</h1>
    <div class="pt-4">
      <b-table striped hover :items="items" :fields="fields" head-variant="light"
      class="text-center">
        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click="infoSongs(row.item.title, row.item.album_id, $event.target)">
            Info Songs
          </b-button>
        </template>
        <template v-slot:cell(likeIt)="row">
          <b-button size="sm" @click="likeAlbum(row.item.album_id)">
            LIKE ❤️
          </b-button>
        </template>
      </b-table>
      <!-- Info modal -->
      <b-modal :id="songModal.id" :title="songModal.title" ok-only @hide="resetSongModal">
        <b-table :items="songModal.content" :fields="songModal.fields"
        class="text-center"></b-table>
      </b-modal>
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
    user: null,
    items: [],
    fields: [
      { key: 'album_id', label: 'ID' },
      { key: 'title', label: 'TITLE' },
      { key: 'genre', label: 'GENRE' },
      { key: 'artist_name', label: 'PRODUCER' },
      { key: 'number_of_likes', label: 'LIKES' },
      { key: 'actions', label: 'Details' },
      { key: 'likeIt', label: '' },
    ],
    songModal: {
      id: 'song-modal',
      title: '',
      content: [],
      fields: [
        { key: 'song_id', label: 'ID' },
        { key: 'title', label: 'TITLE' },
        { key: 'album_id', label: 'ALBUM ID' },
        { key: 'number_of_likes', label: 'LIKES' },
      ],
    },
  }),
  mounted() {
    this.getUser();
    this.getAlbumData();
  },
  methods: {
    infoSongs(albumTitle, albumId, button) {
      this.songModal.title = `ALBUM TITLE : ${albumTitle.toUpperCase()}`;
      this.getSongsOfAlbums(albumId);
      this.$root.$emit('bv::show::modal', this.songModal.id, button);
    },
    resetSongModal() {
      this.songModal.title = '';
      this.songModal.content = '';
    },
    getSongsOfAlbums(albumId) {
      fetch(`${SONG_URL}/${albumId}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          console.log(result);
          this.songModal.content = result.result;
        });
    },
    likeAlbum(albumId) {
      fetch(`${ALBUM_URL}/${albumId}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then(() => {
        this.getAlbumData();
      });
    },
    getUser() {
      fetch(API_URL, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          if (result.user) {
            this.user = result.user;
          }
        });
    },
    getAlbumData() {
      fetch(ALBUM_URL, {
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
  },
};
</script>

<style>

</style>
