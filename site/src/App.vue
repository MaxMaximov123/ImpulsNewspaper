<template>
  <v-app class="app">
    <div v-if="this.user">
      <Header :user="userData" :filters="filters" :loadingUpdate="false"></Header>
    </div>
    <div class="content blured" id="content" v-if="this.user">
      <router-view></router-view>
    </div>
    <!-- <MenuBar></MenuBar> -->
    <!-- <v-layout> -->
      <!-- <v-footer></v-footer> -->
  <!-- </v-layout> -->
  </v-app>
  
  
</template>
<script>

import MenuBar from '@/components/MenuBar.vue';
import VueCookies from 'vue-cookies';
import { postRequest, apiHost } from '@/services/postRequest';
import Header from '@/components/Header.vue';
import { render } from 'vue';

export default {
  components: {
    MenuBar,
    Header
  },
  methods: {
  },

  async mounted() {
  },

  methods: {
    async render() {
      this.filters.context = this.$route.query?.context || "";
      this.userData = (
        await postRequest(
          `${apiHost}api/user`, { token: VueCookies.get('token') }
        )
      ).data;

      this.$storage.user = this.user = this.userData ? {...this.userData, authorized: true } : { authorized: false };
    }
  },

  watch: {
      $route(to, from) {
        this.render();
      }
    },

  data(){
    return {
      userData: {},
      user: this.$storage.user,
      filters: {
        context: '',
      }
    };
  },
}
</script>

<style>

  #app .v-application {
    background-color: transparent;
  }
  .content {
    position: relative;
    z-index: 1;
  }

  body {
    background-color: #557bc6;
    /* height: 120%; */
  }
</style>