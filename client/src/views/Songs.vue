<template>
  <div>
    <Navigation v-bind:form="user.user" v-bind:user="user"></Navigation>
    <h1 class="text-center pt-5">Songs</h1>
    <div class="pt-4">
      <b-table striped hover :items="items" :fields="fields" head-variant="light"
        class="text-center">
        <template v-slot:cell(likeIt)="row">
          <b-button v-if="!isLikedIt(row.item.song_id)"
            size="sm" @click="likeSong(row.item.song_id)">
            LIKE ❤️
          </b-button>
          <b-button v-if="isLikedIt(row.item.song_id)"
            size="sm" @click="disLikeSong(row.item.song_id)" >
            DISLIKE 🖤
          </b-button>
        </template>
      </b-table>
    </div>
  </div>
</template>
<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const SONG_URL = 'http://localhost:5000/api/v1/songs';
const LIKED_SONG_URL = 'http://localhost:5000/api/v1/liked_songs';


export default {
  components: {
    Navigation,
  },
  data: () => ({
    likedSong: [],
    user: null,
    items: [],
    fields: [
      { key: 'song_id', label: 'ID' },
      { key: 'title', label: 'TITLE' },
      { key: 'album_id', label: 'ALBUM' },
      { key: 'artist_name', label: 'PRODUCER' },
      { key: 'number_of_likes', label: 'LIKES' },
      { key: 'likeIt', label: '' },
    ],
  }),
  mounted() {
    this.getUser();
    this.getSongData();
    // console.log(this.likedSong);
  },
  methods: {
    getUser() {
      fetch(API_URL, {
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          if (result.user) {
            this.user = result.user;
            this.getLikedSongData(this.user.user);
          }
        });
    },
    getSongData() {
      fetch(SONG_URL, {
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
    getLikedSongData(username) {
      fetch(`${LIKED_SONG_URL}/${username}`, {
        method: 'GET',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
        // console.log(result);
          const likedSongOfUser = result.result;
          // console.log(likedSongOfUser);
          for (let i = 0; i < likedSongOfUser.length; i++) {
            const element = likedSongOfUser[i].song_id;
            this.likedSong.push(element);
          }
        });
      // console.log(this.items);
    },
    likeSong(songId) {
      fetch(`${SONG_URL}/${songId}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          if (result.message) {
            // do sth
          } else {
            this.likedSong.push(songId);
            this.getSongData();
          }
        });
    },
    disLikeSong(songId) {
      fetch(`${SONG_URL}/dislike/${songId}`, {
        method: 'PATCH',
        headers: {
          authorization: `Bearer ${localStorage.token}`,
        },
      }).then((res) => res.json())
        .then((result) => {
          console.log(result);
          if (result.message) {
            // do
          } else {
            const filteredSong = this.likedSong.filter((item) => item !== songId);
            this.likedSong = filteredSong;
            this.getSongData();
          }
        });
    },
    isLikedIt(songId) {
      if (this.likedSong.includes(songId)) {
        return true;
      } else {
        return false;
      }
    },
  },
};
</script>

<style>

</style>
