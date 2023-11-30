import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

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

const myApp = createApp(App)

myApp.use(Quasar, {
  plugins: {}, // import Quasar plugins and add here
});

myApp.use(VueFullPage);

myApp.use(router)
.use(vuetify)
.mount('#app')