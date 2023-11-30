<template>
    <q-img
        v-for="image in images"
        class="rounded-borders large-image"
        :src=image
        alt="Large Image"
    />
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    props: {
        images: Array,
    },
    setup () {
      return {
        slide: ref(1),
        fullscreen: ref(false)
      }
    }
  }
  </script>


<style>

/* .gallery {
    width: 50%;
    margin-left: auto;
    margin-right: auto;
}

@media (max-width: 700px) {
    .gallery {
        width: 100%;
    }
} */
</style>