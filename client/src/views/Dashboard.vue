<template>
  <div>
    <Navigation v-bind:form="user.user"></Navigation>
    <h1 class="text-center pt-5">Dashboard</h1>
    <h1 v-if="user" class="pl-3">Hello, there 👋</h1>
  </div>
</template>

<script>
import Navigation from './Navigation.vue';

const API_URL = 'http://localhost:5000/';


export default {
  components: {
    Navigation,
  },
  data: () => ({
    user: null,
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
  },
};
</script>

<style>

</style>
