<file name=App.vue path=/Users/maximsmirnov/School/SchoolProject 10/ImpulsNewspaper/vk-scanner/src>  
<template>
  <q-layout view="lHh Lpr lFf">
    <q-header>
      <q-toolbar>
        <q-toolbar-title>Impuls Newspaper</q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>

    <q-dialog v-model="loginDialog" persistent backdrop-filter="blur(4px) saturate(150%)">
      <q-card style="width: 320px" class="text-center">
        <q-card-section class="text-h5">
          Добро пожаловать
        </q-card-section>

        <q-card-section>
          <q-btn rounded color="primary" label="Создать комнату" class="q-mb-sm full-width" @click="createRoom" />
          <q-input dense filled v-model="roomCode" label="Код комнаты" class="q-mb-sm" />
          <q-btn rounded color="secondary" label="Войти в комнату" class="full-width" @click="joinRoom" />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      loginDialog: true,
      roomCode: '',
      ws: null,
      // other data properties...
    };
  },

  methods: {
    async createRoom() {
      try {
        const userId = window?.Telegram?.WebApp?.initDataUnsafe?.user?.id || Math.floor(Math.random() * 10000);
        const { data } = await axios.post('/api/rooms', { telegram_id: userId });
        this.roomCode = data.code;
        this.loginDialog = false;
        this.connectToServer();
      } catch (e) {
        console.error('Ошибка при создании комнаты', e);
      }
    },

    async joinRoom() {
      try {
        const { data } = await axios.get(`/api/rooms/${this.roomCode}`);
        if (data) {
          this.loginDialog = false;
          this.connectToServer();
        }
      } catch (e) {
        console.error('Комната не найдена', e);
      }
    },

    connectToServer() {
      this.ws = new WebSocket(`ws://localhost:8000/ws/${this.roomCode}`);

      this.ws.onmessage = (event) => {
        // existing player logic unchanged
        const message = JSON.parse(event.data);
        // ...player logic here...
      };

      // other websocket event handlers...
    },

    // other methods...
  },
};
</script>
</file>
