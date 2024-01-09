<template>
  <div class="app">
    <div class="background"></div>
    <div class="content">
      <title>Импульс</title>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>

export default {
  components: {
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
    /* background-attachment: fixed; */
    filter: blur(4px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100dvw;
    height: 100dvh;
    background-color: #96BAFF;
    z-index: -1;
  }
/* 
  .app {
    background-color: #96BAFF;
    height: 120%;
  } */
</style>