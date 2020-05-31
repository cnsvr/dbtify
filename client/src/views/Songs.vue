<template>
  <div>
    <Navigation v-bind:form="user.user"></Navigation>
    <h1 class="text-center pt-5">Songs</h1>
    <div class="pt-4">
      <b-table striped hover :items="items" :fields="fields" head-variant="light"
      class="text-center"></b-table>
    </div>
  </div>
</template>
<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const SONG_URL = 'http://localhost:5000/api/v1/songs';


export default {
  components: {
    Navigation,
  },
  data: () => ({
    user: null,
    items: [],
    fields: [
      { key: 'song_id', label: 'ID' },
      { key: 'title', label: 'TITLE' },
      { key: 'album_id', label: 'ALBUM' },
      { key: 'artist_name', label: 'PRODUCER' },
      { key: 'number_of_likes', label: 'LIKES' },
    ],
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
};
</script>

<style>

</style>
