<template>
    <Modal :value="dialog.isOpen" title="Войти черз" @closeModal="() => dialog.isOpen = false">
        <div class="social-login-buttons">
        <button @click="loginWith('yandex')" class="yandex">
            <img style="width: 20px; margin-right: 5px;" src="https://yastatic.net/s3/web4static/_/v2/AppFavicon-Icon_size64_ru.5f7303b2887f57.link.png">
            <a href="https://oauth.yandex.ru/authorize?response_type=code&client_id=34a4fadda62f45a694dd6f6d20e144a6" title="Яндекс">Войти c Яндекс ID</a>
        </button>
        <button @click="loginWith('google')" class="google">
            <i class="fab fa-google"></i>
            Войти через Google
        </button>
        <button @click="loginWith('vk')" class="vk">
            <i class="fab fa-vk"></i>
            Войти через ВКонтакте
        </button>
        <button @click="loginWith('telegram')" class="telegram">
            <i class="fab fa-telegram"></i>
            Войти через Телеграм
        </button>
        </div>
    </Modal>

  </template>
  
  <script>
  import Modal from '@/components/Modal.vue';

  export default {
    components: {
        Modal,
    },
    props: {
        dialog: Object,
    },
    methods: {
      loginWith(provider) {
        // Ваш код для обработки входа через выбранного провайдера
        console.log(`Вход через ${provider}`);
      },
    },
  };
  </script>
  
  <style scoped>

  a {
    color: #fff;
    text-decoration: none;
  }
  .social-login-buttons {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    transition: background-color 0.3s;
  }
  
  button:hover {
    opacity: 0.8;
  }
  
  .yandex {
    background-color: #000000;
    color: #fff;
  }
  
  .google {
    background-color: #4285f4;
    color: #fff;
  }
  
  .vk {
    background-color: #4680c2;
    color: #fff;
  }
  
  .telegram {
    background-color: #0088cc;
    color: #fff;
  }
  
  i {
    margin-right: 10px;
  }
  </style>
  