<template>
<div>
    <Navigation v-bind:form="user.user"></Navigation>
    <h1 class="text-center pt-5">Albums</h1>
    <div class="pt-4">
      <b-table striped hover :items="items" :fields="fields" head-variant="light"
      class="text-center"></b-table>
    </div>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';
const ALBUM_URL = 'http://localhost:5000/api/v1/albums';


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
          console.log(result.user);
          this.user = result.user;
        }
      });
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
};
</script>

<style>

</style>
