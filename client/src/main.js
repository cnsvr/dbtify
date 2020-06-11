import Vue from 'vue';
import Vuetify from 'vuetify';
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import App from './App.vue';
import router from './router';
import '@mdi/font/css/materialdesignicons.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootswatch/dist/darkly/bootstrap.css';
import 'vuetify/dist/vuetify.min.css';


Vue.config.productionTip = false;
const opts = {
  theme: {
    dark: true,
  },
};

// Install BootstrapVue
Vue.use(BootstrapVue);
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin);

Vue.use(Vuetify);

new Vue({
  vuetify: new Vuetify(opts),
  router,
  render: (h) => h(App),
}).$mount('#app');
