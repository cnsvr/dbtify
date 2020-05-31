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
          <label for="name">Name</label>
          <input
          v-model="user.name"
          type="text"
          class="form-control"
          id="name"
          aria-describedby="nameHelp" required>
          <small id="nameHelp"
          class="form-text text-muted">Please enter your name.</small>
        </div>
        <div class="form-group">
          <label for="surname">Surname</label>
          <input
          v-model="user.surname"
          type="text"
          class="form-control"
          id="surname" aria-describedby="surnameHelp" required>
          <small id="surnameHelp"
          class="form-text text-muted">Please enter your surname</small>
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

const LOGIN_URL = 'http://localhost:5000/auth/artist/login';


const artistSchema = Joi.object().keys({
  name: Joi.string().regex(/(^[a-zA-Z]+$)/).min(2).max(255)
    .required(),
  surname: Joi.string().regex(/(^[a-zA-Z]+$)/).min(2).max(255)
    .required(),
  password: Joi.string().trim().min(8).required(),
});

export default {
  components: {
    Navigation,
  },
  data: () => ({
    errorMessage: '',
    user: {
      name: '',
      surname: '',
      password: '',
    },
  }),
  methods: {
    login() {
      this.errorMessage = '';
      if (this.validUser()) {
        const body = {
          name: this.user.name,
          surname: this.user.surname,
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
          this.$router.push('/artistDashboard');
        }).catch((error) => {
          this.errorMessage = error.message;
        });
      }
    },
    validUser() {
      const result = Joi.validate(this.user, artistSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('name')) {
        this.errorMessage = 'Username is invalid';
      } else if (result.error.message.includes('surname')) {
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
