import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '../views/Home.vue';
import ListenerSignup from '../views/ListenerSignup.vue';
import ArtistSignup from '../views/ArtistSignup.vue';
import LoginListener from '../views/LoginListener.vue';
import LoginArtist from '../views/LoginArtist.vue';
import ArtistDashboard from '../views/ArtistDashboard.vue';
import Dashboard from '../views/Dashboard.vue';
import Artists from '../views/Artists.vue';
import Albums from '../views/Albums.vue';
import Songs from '../views/Songs.vue';

Vue.use(VueRouter);

function loggedInRedirectDashboard(to, from, next) {
  if (localStorage.token) {
    next('/dashboard');
  } else {
    next();
  }
}

function loggedInRedirectArtistDashboard(to, from, next) {
  if (localStorage.token) {
    next('/artistDashboard');
  } else {
    next();
  }
}

function isLoggedIn(to, from, next) {
  if (localStorage.token) {
    next();
  } else {
    next('/loginListener');
  }
}

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/artistSignup',
    name: 'artistSignup',
    component: ArtistSignup,
    beforeEnter: loggedInRedirectArtistDashboard,
  },
  {
    path: '/loginArtist',
    name: 'loginArtist',
    component: LoginArtist,
    beforeEnter: loggedInRedirectArtistDashboard,
  },
  {
    path: '/listenerSignup',
    name: 'listenerSignup',
    component: ListenerSignup,
    beforeEnter: loggedInRedirectDashboard,
  },
  {
    path: '/loginListener',
    name: 'loginListener',
    component: LoginListener,
    beforeEnter: loggedInRedirectDashboard,
  },
  {
    path: '/artistDashboard',
    name: 'artistDashboard',
    component: ArtistDashboard,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: Dashboard,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/artists',
    name: 'Artists',
    component: Artists,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/albums',
    name: 'Albums',
    component: Albums,
    beforeEnter: isLoggedIn,
  },
  {
    path: '/songs',
    name: 'Songs',
    component: Songs,
    beforeEnter: isLoggedIn,
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

export default router;
