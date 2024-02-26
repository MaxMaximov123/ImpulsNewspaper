<template>
    <q-img
        v-for="image in images.slice(0, images.length - 1)"
        style="margin-bottom: 18px;"
        class="rounded-borders"
        :src=image
    >
      <template v-slot:loading>
        <q-spinner-bars
          color="cyan"
          size="xl"
          />
      </template>
    </q-img>
    <q-img
        class="rounded-borders"
        :src="images[images.length - 1]"
    />
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    props: {
        images: Array,
    },
    data() {
      return {
        slide: ref(1),
        fullscreen: ref(false)
      }
    },
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