<template>
  <div>
    <Navigation form="login" user=""></Navigation>
    <div class="container pt-5">
      <h1 class="text-center">Sign Up</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="signup">
        <div class="form-group">
          <label for="username">Username</label>
          <input
          v-model="user.username"
          type="text"
          class="form-control"
          id="username"
          aria-describedby="usernameHelp"
          placeholder="Enter a username" required>
          <small id="usernameHelp"
          class="form-text text-muted">Username must be unique.</small>
        </div>
        <div class="form-group">
          <label for="email">Email address</label>
          <input
          v-model="user.email"
          type="email"
          class="form-control"
          id="email" aria-describedby="emailHelp"
          placeholder="Enter a email address" required>
          <small id="emailHelp"
          class="form-text text-muted">Email must ne unique.</small>
        </div>
        <div class="form-row">
          <div class="form-group col-md-6">
            <label for="password">Password</label>
            <input
            v-model="user.password"
            type="password" class="form-control" id="password"
            aria-describedby="passwordHelp" required>
            <small id="passwordHelp"
            class="form-text text-muted">Password must be 8 or more characters long.</small>
          </div>
          <div class="form-group col-md-6">
            <label for="confirmPassword">Confirm Password</label>
            <input
            v-model="user.confirmPassword"
            type="password" class="form-control" id="confirmPassword"
            aria-describedby="confirmPasswordHelp" required>
            <small id="confirmPasswordHelp"
            class="form-text text-muted">Please confirm your password.</small>
          </div>
        </div>
        <button type="submit" class="btn btn-primary">Sign Up</button>
      </form>
    </div>
  </div>
</template>

<script>
import Joi from 'joi';
import Navigation from './Navigation.vue';

const SIGN_UP_URL = 'http://localhost:5000/auth/listener/signup';

const listenerSchema = Joi.object().keys({
  username: Joi.string().regex(/(^[a-zA-Z0-9_]+$)/).min(2).max(255)
    .required(),
  email: Joi.string().regex(/(^\S+@\S+$)/).required(),
  password: Joi.string().trim().min(8).required(),
  confirmPassword: Joi.string().trim().min(8).required(),
});


export default {
  name: 'listenerSignup',
  components: {
    Navigation,
  },
  data: () => ({
    errorMessage: '',
    user: {
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  }),
  watch: {
    user: {
      handler() {
        this.errorMessage = '';
      },
      deep: true,
    },
  },
  methods: {
    signup() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          username: this.user.username,
          email: this.user.email,
          password: this.user.password,
        };
        fetch(SIGN_UP_URL, {
          method: 'POST',
          body: JSON.stringify(body),
          headers: {
            'content-type': 'application/json',
          },
        }).then((response) => {
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
          // this.errorMessage = 'That username or email is available!!';
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      if (this.user.password !== this.user.confirmPassword) {
        this.errorMessage = 'Passwords must match. 🙈';
        return false;
      }
      // Joi ????
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
