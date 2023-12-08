<template>
  <div class="q-pa-md">
    <q-responsive :ratio="16/9">
      <q-carousel
        swipeable
        animated
        v-model="slide"
        arrows
        navigation
        v-model:fullscreen="fullscreen"
        infinite
      >
        <q-carousel-slide v-for="(image, index) in images" 
        :name="index + 1" :img-src="image" />

        <template v-slot:control>
          <q-carousel-control
            position="bottom-right"
            :offset="[18, 18]"
          >
            <q-btn
              push round dense color="white" text-color="primary"
              :icon="fullscreen ? 'fullscreen_exit' : 'fullscreen'"
              @click="fullscreen = !fullscreen"
            />
          </q-carousel-control>
        </template>
      </q-carousel>
    </q-responsive>
  </div>
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