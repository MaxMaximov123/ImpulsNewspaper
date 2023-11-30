<template>
  <link href="https://cdn.jsdelivr.net/npm/@mdi/font@5.x/css/materialdesignicons.min.css" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
  <v-card max-width="448" class="mx-auto" color="grey-lighten-3" style="z-index: 100;">
    <v-layout>
      <v-app-bar
        scroll-behavior="fade-image elevate hide"
        scroll-threshold="500"
        color="teal-darken-4"
        image="/images/background.jpg"
      >
        <template v-slot:image>
          <v-img
            gradient="to top right, rgba(19,84,122,.8), rgba(128,208,199,.8)"
          ></v-img>
        </template>

        <q-avatar
          style="margin-left: 10px;"
          size="40px"
        >
          <img :src="`/images/logo.jpeg`">
        </q-avatar>
        <!-- <template v-slot:prepend>
          <v-app-bar-nav-icon>lndslf</v-app-bar-nav-icon>
        </template> -->

        <v-app-bar-title>Импульс</v-app-bar-title>

        <v-spacer></v-spacer>

        <v-btn icon>
          <v-icon>mdi-magnify</v-icon>
        </v-btn>

        <v-btn icon>
          <v-icon>mdi-dots-vertical</v-icon>
        </v-btn>
      </v-app-bar>
    </v-layout>
  </v-card>
</template>

<script>

</script>