<template>
    <div>
      <button @click="signInWithGoogle">Войти с помощью Google</button>
      <!-- Другие варианты аутентификации -->
      <!-- ... -->
    </div>
  </template>
  
  <script>
  import firebase from 'firebase/app';
  import 'firebase/auth';
  
  export default {
    methods: {
      async signInWithGoogle() {
        try {
          const provider = new firebase.auth.GoogleAuthProvider();
          await firebase.auth().signInWithPopup(provider);
          // Аутентификация прошла успешно
        } catch (error) {
          console.error(error.message);
        }
      },
      // Другие методы для других вариантов аутентификации
      // ...
    }
  }
  </script>
  