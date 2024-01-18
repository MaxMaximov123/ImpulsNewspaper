<template>
  <v-card max-width="448" class="mx-auto" color="grey-lighten-3" style="z-index: 100;">
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
        
        <q-btn @click="() => this.$router.push(`../`)" flat round class="q-mx-sm">
        <q-avatar
          size="45px"
        >
          <img :src="`/images/newLogo.jpeg`">
        </q-avatar>
        </q-btn>

        <v-app-bar-title style="
        font-family: 'Gilroy-Medium', sans-serif;
        font-size: clamp(17px, 3vw, 25px);" @click="() => this.$router.push(`../`)">Импульс</v-app-bar-title>


        <div style="width: 30vw;">
          <v-text-field
            style="
            background-color: rgba(255, 255, 255, 0.196);
            border-top-right-radius: 5px;
            border-top-left-radius: 5px;"
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

        <div>
          <q-btn flat round class="q-mx-sm">
            <q-avatar>
              <img src="/images/defaultUser.png">
              <q-menu>
                <q-list>
                  <q-item-label header>Аккаунт</q-item-label>
                  <q-item clickable v-close-popup tabindex="0">
                    <q-item-section>
                      <q-item-label>Войти</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup tabindex="0">
                    <q-item-section>
                      <q-item-label>Что-то еще</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator inset spaced />
                </q-list>
              </q-menu>
            </q-avatar>
          </q-btn>
        </div>

        <div>
          <q-btn flat round  icon="more_vert" class="q-mr-sm" size="16px">
              <q-menu>
                <q-list>
                  <q-item-label header>Импульс</q-item-label>
                  <q-item clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                      <q-avatar>
                        <img src="https://cdn-icons-png.flaticon.com/512/828/828370.png">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Бумажные издания</q-item-label>
                      <q-item-label caption>2017-2018</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup tabindex="0">
                    <q-item-section avatar>
                      <q-avatar>
                        <img src="https://cdn-icons-png.flaticon.com/512/6159/6159876.png">
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Юбилейный выпуск</q-item-label>
                      <q-item-label caption>2024</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-separator inset spaced />
                </q-list>
              </q-menu>
          </q-btn>
        </div>
      </v-app-bar>
  </v-card>
</template>

<script>
import { decodeCredential } from 'vue3-google-login'
import router from '@/router';
import Auth from '@/components/Auth.vue';

export default {
  components: {
    Auth,
  },
  props: {
    filters: Object,
    loadingUpdate: Boolean,
  },

  data() {
    return {
      searchContext: '',
      user: null,
    }
  },

  methods: {
    async searchByContext() {
      await this.applyFilters();
    },

    callback(response) {
      const userData = decodeCredential(response.credential);
      this.user = userData;
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