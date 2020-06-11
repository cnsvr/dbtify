<template>
  <div>
    <Navigation form="login" user=""></Navigation>
    <div class="container text-center pt-5">
      <div class="jumbotron">
        <h1 class="display-3">Welcome the DBtify</h1>
        <p class="lead">This is a simple database project,but I am sure that you love it.</p>
        <hr class="my-4">
        <p>It uses MySQL database server and serves many functionalities to you.</p>
        <p class="lead">
          <router-link class="btn btn-success btn-lg mr-5"
          :to="{ name: 'artistSignup' }"
          role="button">Sign up as Artist</router-link>
          <router-link class="btn btn-success btn-lg"
            :to="{ name: 'listenerSignup' }"
            role="button">Sign up as Listener</router-link>
        </p>
      </div>
    </div>
  </div>
</template>
<script>
import Navigation from './Navigation.vue';


export default {
  name: 'Home',
  components: {
    Navigation,
  },
};
</script>
