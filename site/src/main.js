import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'


const vuetify = createVuetify({
  components,
  directives,
})


import { Quasar } from 'quasar'

import '@quasar/extras/roboto-font-latin-ext/roboto-font-latin-ext.css'
import '@quasar/extras/material-icons/material-icons.css'
import 'quasar/src/css/index.sass'
import 'vue-fullpage.js/dist/style.css'
import VueFullPage from 'vue-fullpage.js'
import vueAwesomeSidebar from 'vue-awesome-sidebar'
import 'vue-awesome-sidebar/dist/vue-awesome-sidebar.css'

const app = createApp(App);

import vue3GoogleLogin from 'vue3-google-login';
app.use(vue3GoogleLogin, {
  clientId: '1051307181457-kng50lf3a7182s62eh986ht7di9p79qe.apps.googleusercontent.com'
})

app.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

app.use(VueFullPage);
app.use(vueAwesomeSidebar);

app.use(router)
.use(vuetify)
.mount('#app')