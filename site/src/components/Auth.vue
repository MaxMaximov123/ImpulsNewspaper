<!-- frontend/src/views/Home.vue -->
<template>
  <a href="https://oauth.yandex.ru/authorize?response_type=code&client_id=34a4fadda62f45a694dd6f6d20e144a6" title="Яндекс">Войти через Яндекс</a>
  <!-- <button @click="loginWithGoogle">Войти через Google</button> -->
  <!-- <div>
    <div v-if="user">
      <p>Привет, {{ user.displayName }}!</p>
      <button @click="logout">Выйти</button>
    </div>
    <div v-else>
      <button @click="loginWithGoogle">Войти через Google</button>
    </div>
  </div> -->
</template>

<script>
import { loginWithGoogle, logout, getUser } from '@/services/authService.js';

export default {
  data() {
    return {
      user: null,
    };
  },
  mounted() {
    // this.checkAuthStatus();
  },
  methods: {
    async loginWithGoogle() {
      loginWithGoogle();
    },
    async logout() {
      logout();
      this.user = null;
    },
    async checkAuthStatus() {
      this.user = await getUser();
    },
  },
};
</script>
