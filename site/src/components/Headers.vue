<template>
    <!-- <div class="">
      <q-layout view="lHh lpr lFf" container class="shadow-2">
        <q-header>
          <q-toolbar>
            <q-btn flat round dense icon="menu" class="q-mr-sm" />
            <q-avatar>
              <img src="logo1.png">
            </q-avatar>
    
            <q-toolbar-title>Импульс</q-toolbar-title>
    
          </q-toolbar>
        </q-header>
      </q-layout>
    </div> -->

    <div class="row items-center q-pa-sm header">
      <q-toolbar>
        <q-btn flat round dense icon="menu" class="q-mr-sm" />

        <div class="row justify-center">
          <q-avatar :onclick="() => console.log(5645)">
            <img src="/images/logo1.png">
          </q-avatar>

          <q-toolbar-title>Импульс</q-toolbar-title>
        </div>

      </q-toolbar>

      <q-space />
    </div>
</template>

<script>
</script>

<style>
  .header {
    justify-content: center;
    height: 65px;
    background-color: #2196f3;
    position:fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100; /* Уровень, на котором будет отображаться заголовок */
  }
</style>