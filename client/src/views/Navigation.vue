<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
      <router-link v-if="user.role==='listener'"
        class="navbar-brand" :to="{ name:'dashboard'}">DBtify</router-link>
      <router-link v-else-if="user.role==='artist'"
        class="navbar-brand" :to="{ name:'artistDashboard'}">DBtify</router-link>
      <router-link v-else class="navbar-brand"
        :to="{ name:'Home'}">DBtify</router-link>
      <button class="navbar-toggler"
        type="button" data-toggle="collapse"
        data-target="#navbarColor01"
        aria-controls="navbarColor01"
        aria-expanded="false"
        aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarColor01">
        <ul class="navbar-nav mr-auto">
          <li class="nav-item">
            <router-link v-if="user.role === 'listener'"
              class="nav-link" :to="{ name:'dashboard'}">Dashboard</router-link>
            <router-link v-if="user.role === 'artist'"
              class="nav-link" :to="{ name:'artistDashboard'}">Dashboard</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="user.role === 'listener'"
              class="nav-link" :to="{ name:'Artists'}">Artists</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="user.role === 'listener'"
              class="nav-link" :to="{ name:'Albums'}">Albums</router-link>
          </li>
          <li class="nav-item">
            <router-link v-if="user.role === 'listener'"
              class="nav-link" :to="{ name:'Songs'}">Songs</router-link>
          </li>
        </ul>
        <form v-if="form=='login'" class="form-inline my-2 my-lg-0">
          <router-link class="btn btn-secondary btn-lg my-2 my-sm-0 mr-3"
            :to="{ name: 'loginArtist' }"
            role="button">Login as Artist</router-link>
          <router-link class="btn btn-secondary btn-lg my-2 my-sm-0"
            :to="{ name: 'loginListener'}"
            role="button">Login as Listener</router-link>
        </form>
        <form v-if="form=='signup'" class="form-inline my-2 my-lg-0">
          <router-link class="btn btn-secondary btn-lg my-2 my-sm-0 mr-3"
            :to="{ name: 'artistSignup' }"
            role="button">Sign up as Artist</router-link>
          <router-link class="btn btn-secondary btn-lg my-2 my-sm-0"
            :to="{ name: 'listenerSignup'}"
            role="button">Sign up as Listener</router-link>
        </form>
        <form v-if="form!='signup' && form!='login'" class="form-inline my-2 my-lg-0">
          <h3 class="pr-3">{{form}}</h3>
          <button @click="logout()" class="btn btn-secondary btn-lg my-2 my-sm-0">Logout</button>
        </form>
      </div>
    </nav>
</template>

<script>
export default {
  name: 'navbar',
  props: ['form', 'user'],
  mounted() {
  },
  methods: {
    logout() {
      localStorage.removeItem('token');
      this.form = 'login';
      this.$router.push('/');
    },
  },
};
</script>
