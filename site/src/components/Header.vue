<template>
  <LoginForm></LoginForm>
  <v-card flat class="mx-auto" :color="'rgba(255, 255, 255, 0)'" style="z-index: 100; padding-bottom: 60px;">
    <v-app-bar
        scroll-threshold="500"
        color="teal-darken-4"
        :image="this.$reqire('assets/images/background.jpg')"
        class="header"
      >
      <!-- scroll-behavior="elevate hide" -->
        <template v-slot:image>
          <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
          ></v-img>
        </template>
        
        <q-btn @click="() => this.$router.push('../../')" flat round class="q-mx-sm">
        <q-avatar
          size="45px"
        >
          <img :src="logoSrc">
        </q-avatar>
        </q-btn>

        <q-space></q-space>

        <!-- <v-app-bar-title style="
        font-family: 'Gilroy-Medium', sans-serif;
        font-size: clamp(17px, 3vw, 25px);" @click="() => this.$router.push('../../')">Импульс</v-app-bar-title> -->

        <div style="margin-left: auto; width: clamp(50%, 10%, 100%);;">
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
          <q-btn flat round class="q-ml-sm">
            <q-avatar>
              <img :src="
                user?.avatarId ? 
                `https://avatars.yandex.net/get-yapic/${user.avatarId}/islands-50` : this.$reqire('assets/images/defaultUser.png')">
              <q-menu>
                <q-list>
                  <q-item-label header>Аккаунт</q-item-label>
                  <q-item clickable v-close-popup tabindex="0" v-if="!this.$storage.user.authorized"
                  @click="() => {
                    this.authDialog.isOpen = true;
                    console.log(this.authDialog)
                    }">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="mdi-login"></q-icon>
                        Войти
                      </q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup tabindex="0" v-if="this.$storage.user.authorized"
                  @click="async () => {
                    this.$cookies.remove('token');
                    this.$router.go();
                  }">
                    <q-item-section>
                      <q-item-label>
                        <q-icon name="mdi-logout"></q-icon>
                        Выйти
                      </q-item-label>
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
                  <q-item tabindex="0">
                    <q-tree
                      style="margin-left: -10px;"
                      :nodes="paperEdition"
                      node-key="url"
                    >
                    </q-tree>
                  </q-item>

                  <q-item clickable v-close-popup @click="async () => openInNewTab('https://forms.gle/kDQmSrg1jZwLqEKg9')">
                    <q-item-section avatar>
                      <q-avatar>
                        <q-icon size="35px" name="mdi-message-alert"></q-icon>
                      </q-avatar>
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Сделать импульс лучше</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item clickable v-close-popup tabindex="0" @click="this.$router.push('../../paperEdition/Спец выпуски/20 лет импульсу (ru)')">
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

                </q-list>
              </q-menu>
          </q-btn>
        </div>
    </v-app-bar>
  </v-card>
</template>

<script>
import { decodeCredential } from 'vue3-google-login'
import { postRequest, apiHost } from '@/services/postRequest';
import router from '@/router';
import LoginForm from '@/components/LoginForm.vue';
import paperEdition from '@/assets/paperEditionPaths.json';
import { ref } from 'vue';
import VueCookies from 'vue-cookies';

export default {
  components: {
    LoginForm,
  },
  emits: ['updateFilters'],
  props: {
    user: Object,
    filters: Object,
    loadingUpdate: Boolean,
    logoSrc: String,
  },

  data() {
    return {
      searchContext: this.$route.query?.context || '',
      authDialog: this.$storage.authDialog,
    }
  },

  async created() {
    this.addHandler(paperEdition[0]);
  },

  methods: {
    async searchByContext() {
      await this.applyFilters();
    },

    openInNewTab(url) {
      window.open(url, '_blank').focus();
    },

    addHandler(obj) {
      obj.handler = () => {
        if (obj.url.match(/\//g)?.length === 2) {
          this.$router.push('../../' + obj.url);
        }
      }

      if (obj.children) {
        obj.children.forEach(obj2 => {
          this.addHandler(obj2);
        });
      }
    },

    postRequest(url, data) {
      return postRequest(url, data);
    },

    async applyFilters(){
      this.$router.push({path: `/`, query: {
        context: this.filters.context
      }});
    },
  },

  setup () {
    return {
      paperEdition: paperEdition,
      selectedPaper: '',
      expandedPaper: ref([]),
    }
  }
}
</script>

<style>
@import url('https://fonts.cdnfonts.com/css/gilroy-bold');

</style>