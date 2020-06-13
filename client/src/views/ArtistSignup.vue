<template>
  <div>
    <Navigation form="login" user=""></Navigation>
    <div class="container pt-5">
      <h1 class="text-center">Sign Up</h1>
      <div v-if="errorMessage" class="alert alert-danger" role="alert">
        {{ errorMessage }}
      </div>
      <form @submit.prevent="signup()">
        <div class="form-group">
          <label for="name">Name</label>
          <input
          v-model="user.name"
          type="text"
          class="form-control"
          id="name"
          aria-describedby="nameHelp"
          placeholder="Enter a name" required>
          <small id="nameHelp"
          class="form-text text-muted">Name must be unique.</small>
        </div>
        <div class="form-group">
          <label for="surname">Surname</label>
          <input
          v-model="user.surname"
          type="text"
          class="form-control"
          id="surname" aria-describedby="nameHelp"
          placeholder="Enter a surname" required>
          <small id="surnameHelp"
          class="form-text text-muted">Surname must ne unique.</small>
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

const SIGN_UP_URL = 'http://localhost:5000/auth/artist/signup';

const artistSchema = Joi.object().keys({
  name: Joi.string().regex(/(^[a-zA-Z.]+$)/).min(2).max(255)
    .required(),
  surname: Joi.string().regex(/(^[a-zA-Z.]+$)/).min(2).max(255)
    .required(),
  password: Joi.string().trim().min(8).required(),
  confirmPassword: Joi.string().trim().min(8).required(),
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
          name: this.user.name,
          surname: this.user.surname,
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
          this.$router.push('/artistDashboard');
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
      const result = Joi.validate(this.user, artistSchema);
      if (result.error === null) {
        return true;
      }
      if (result.error.message.includes('name')) {
        this.errorMessage = 'Username is invalid';
      } else if (result.error.message.includes('surname')) {
        this.errorMessage = 'Email is invalid';
      } else {
        console.log(result.error.message);
        this.errorMessage = 'Password is invalid';
      }
      return false;
    },
  },
};
</script>

<style>

</style>
