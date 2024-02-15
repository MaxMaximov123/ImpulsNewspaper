<template>
  <v-app class="app">
    <div class="background"></div>
    <Header :user="userData" :filters="filters" :loadingUpdate="false"></Header>
    <div class="content blured" id="content">
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
      this.userData = (
        await postRequest(
          `${apiHost}api/user`, { token: VueCookies.get('token') }
        )
      ).data;

      this.$storage.user = this.userData ? {...this.userData, authorized: true } : { authorized: false };
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
  /* .content.blured {
    filter: blur(10px);
  } */
  .background {
    /* background-image: url('/images/background1.jpg'); */
    /* background-size: cover; */
    /* background-attachment: fixed; */
    /* filter: blur(4px); */

    /* position: fixed;
    top: 0;
    left: 0;
    width: 100lvw;
    height: 100lvh; */
    background-color: #96BAFF;
    z-index: -1;
  }

  body {
    background-color: #96BAFF;
    /* height: 120%; */
  }
</style>