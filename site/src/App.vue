<template>
  <v-app class="app">
    <div class="background"></div>
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

export default {
  components: {
    MenuBar
  },

  methods: {
  },

  mounted() {
  },

  data(){
    return {
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