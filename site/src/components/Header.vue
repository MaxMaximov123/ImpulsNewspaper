<template>
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <v-card max-width="448" class="mx-auto" color="grey-lighten-3" style="z-index: 100;">
    <v-layout>
      <v-app-bar
        scroll-threshold="500"
        color="teal-darken-4"
        image="/images/background.jpg"
        class="header"
        scroll-behavior="elevate hide"
      >
        <template v-slot:image>
          <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
          ></v-img>
        </template>
        
        <q-avatar
          @click="() => this.$router.push(`../`)"
          style="margin-left: 10px;"
          size="40px"
        >
          <img :src="`/images/newLogo.jpeg`">
        </q-avatar>

        <v-app-bar-title style="
        font-family: 'Gilroy-Medium', sans-serif;
        font-size: clamp(17px, 3vw, 25px);" @click="() => this.$router.push(`../`)">Импульс</v-app-bar-title>


        <div style="width: 30vw;">
        <v-text-field
        style="background-color: rgba(255, 255, 255, 0.196); border-top-right-radius: 5px; border-top-left-radius: 5px;"
          @keyup.enter="searchByContext"
          v-model="filters.context"
          :loading="loadingUpdate"
          label="Поиск"
          append-inner-icon="mdi-magnify"
          single-line
          hide-details
          density="compact"
          clearable
          @click:append-inner="searchByContext"
      ></v-text-field>
    </div>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
    </v-layout>
  </v-card>
</template>

<script>
import router from '@/router';

export default {
  props: {
    filters: Object,
    loadingUpdate: Boolean,
  },

  data() {
    return {
      searchContext: '',
    }
  },

  methods: {
    async searchByContext() {
      await this.applyFilters();
    },

    postRequest(url, data){
        return new Promise((resolve, reject) => {
        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        
        fetch(url, options)
        .then(response => response.json())
        .then(result => {
            resolve(result);
        })
        .catch(error => {
            reject(error);
        });
        })
    },

    async applyFilters(){
      this.$router.push({path: `/`, query: {
        context: this.filters.context
      }});
      this.$emit('updateFilters');
    },
  },
}
</script>

<style>
@import url('https://fonts.cdnfonts.com/css/gilroy-bold');

</style>