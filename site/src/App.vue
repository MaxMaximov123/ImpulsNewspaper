<template>
  <div class="app">
    <div class="background"></div>
    <div class="content">
      <title>Импульс</title>
      <Header></Header>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Header from '@/components/Header.vue';

export default {
  components: {
    Header,
  },

  data(){
    return {
    };
  },
}
</script>

<style>
  .content {
    position: relative;
    z-index: 1;
  }
  .background {
    /* background-image: url('/images/background1.jpg'); */
    /* background-size: cover; */
    /* background-attachment: fixed;
    filter: blur(4px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%; */
    background-color: aqua;
    z-index: -1;
  }

  .app {
    background-color: #96BAFF;
  }
</style>