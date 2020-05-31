<template>
  <div>
    <Navigation v-bind:form="user.user"></Navigation>
    <h1 class="text-center pt-5">Artists</h1>
    <div class= "pt-4">
      <b-table :items="items" :fields="fields" striped responsive="sm"
      head-variant="light" class="text-center">
        <template v-slot:cell(actions)="row">
          <b-button size="sm" @click="infoAlbums(row.item.artist_name, $event.target)"
          class="mr-5">
            Info Albums
          </b-button>
          <b-button size="sm" @click="infoSongs(row.item.artist_name, $event.target)"
          class="mr-1">
            Info Songs
          </b-button>
        </template>
      </b-table>
      <!-- Info modal -->
      <b-modal :id="albumModal.id" :title="albumModal.title" ok-only @hide="resetAlbumModal">
        <b-table :items="albumModal.content" :fields="albumModal.fields"></b-table>
      </b-modal>
      <b-modal :id="songModal.id" :title="songModal.title" ok-only @hide="resetSongModal">
        <b-table :items="songModal.content" :fields="songModal.fields"></b-table>
      </b-modal>
    </div>
  </div>
</template>
<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const ARTIST_URL = 'http://localhost:5000/api/v1/artists';
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
      { key: 'artist_name', label: 'NAME' },
      { key: 'artist_surname', label: 'SURNAME' },
      { key: 'actions', label: 'Details' },
    ],
    albumModal: {
      id: 'album-modal',
      title: '',
      content: [],
      fields: [
        { key: 'album_id', label: 'ID' },
        { key: 'title', label: 'TITLE' },
        { key: 'genre', label: 'GENRE' },
        { key: 'number_of_likes', label: 'LIKES' },
      ],
    },
    songModal: {
      id: 'song-modal',
      title: '',
      content: [],
      fields: [
        { key: 'song_id', label: 'ID' },
        { key: 'title', label: 'TITLE' },
        { key: 'album_id', label: 'ALBUM' },
        { key: 'number_of_likes', label: 'LIKES' },
      ],
    },
  }),
  mounted() {
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
    fetch(ARTIST_URL, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${localStorage.token}`,
      },
    }).then((res) => res.json())
      .then((result) => {
        // console.log(result);
        this.items = result.result;
      });
  },
  methods: {
    infoAlbums(artistName, button) {
      this.albumModal.title = artistName.toUpperCase();
      this.getAlbumOfArtist(artistName);
      this.$root.$emit('bv::show::modal', this.albumModal.id, button);
    },
    resetAlbumModal() {
      this.albumModal.title = '';
      this.albumModal.content = '';
    },
    infoSongs(artistName, button) {
      this.songModal.title = artistName.toUpperCase();
      this.getSongsOfArtist(artistName);
      this.$root.$emit('bv::show::modal', this.songModal.id, button);
    },
    resetSongModal() {
      this.songModal.title = '';
      this.songModal.content = '';
    },
    getAlbumOfArtist(artistName) {
      fetch(`${ALBUM_URL}/${artistName}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          this.albumModal.content = result.result;
        });
    },
    getSongsOfArtist(artistName) {
      fetch(`${SONG_URL}/${artistName}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          this.songModal.content = result.result;
        });
    },
  },
};
</script>

<style>

</style>
