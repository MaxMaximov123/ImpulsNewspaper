<template>
  <div class="app">
    <div class="background"></div>
    <div class="content">
      <title>Импульс</title>
      <Headers></Headers>
      <router-view></router-view>
    </div>
  </div>
</template>
<script>
import Headers from '@/components/Headers.vue';

export default {
  components: {
    Headers,
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
    background-image: url('/images/background1.jpg');
    background-size: cover;
    background-attachment: fixed;
    filter: blur(4px);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }
</style>