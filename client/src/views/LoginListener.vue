<template>
  <div>
    <Navigation form="signup"></Navigation>
    <div class="container pt-5">
      <h1 class="text-center">Login</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="login()">
        <div class="form-group">
          <label for="username">Username</label>
          <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp" required>
          <small id="usernameHelp"
          class="form-text text-muted">Please enter your username.</small>
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
          v-model="user.email"
          type="email"
          class="form-control"
          id="email" aria-describedby="emailHelp" required>
          <small id="emailHelp"
          class="form-text text-muted">Please enter your email address</small>
        </div>
        <div class="form-group">
          <label for="password">Password</label>
          <input
          v-model="user.password"
          type="password" class="form-control" id="password"
          aria-describedby="passwordHelp" required>
          <small id="passwordHelp"
          class="form-text text-muted">Please enter your password.</small>
        </div>
        <button type="submit" class="btn btn-primary">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import Joi from 'joi';
import Navigation from './Navigation.vue';

const LOGIN_URL = 'http://localhost:5000/auth/listener/login';

const listenerSchema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(255)
    .required(),
  email: Joi.string().regex(/(^\S+@\S+$)/).required(),
  password: Joi.string().trim().min(8).required(),
});

export default {
  components: {
    Navigation,
  },
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      email: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password,
        };
        fetch(LOGIN_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
          console.log(response);
          if (response.ok) {
            return response.json();
          }
          return response.json().then((error) => {
            throw new Error(error.message);
          });
        }).then((result) => {
          localStorage.token = result.token;
          this.$router.push('/dashboard');
        }).catch((error) => {
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, listenerSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('username')) {
        this.errorMessage = 'Username is invalid';
      } else if (result.error.message.includes('email')) {
        this.errorMessage = 'Email is invalid';
      } else {
        this.errorMessage = 'Password is invalid';
      }
      return false;
    },
  },
};
</script>

<style>

</style>
