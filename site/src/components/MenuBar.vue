<template>
    <VueAwesomeSideBar
        v-model:miniMenu="miniMenu"
        v-model:collapsed="collapsed"
        :menu="testMenu"
        vueRouterEnabel
      ></VueAwesomeSideBar>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const collapsed = ref(false)
  const miniMenu = ref(false)
  
  const testMenu = [
    {
      name: 'Getting Started',
      icon: { text: '' , class: 'material-icons-outlined' },
      children: [
        {
          name: 'level 1.1',
          href: '/a',
          icon: { text: '' , class: 'material-icons-outlined'},
          children: [
            {
              href: '/b',
              name: 'level 1.1.1',
            },
          ]
        },
        {
          name: 'level 1.2'
        }
      ],
    },
    {
      header: 'Settings'
    },
    {
      name: 'Dashboard',
      icon: { class: 'material-icons-outlined', text: '' },
      children: [
        {
          href: '/c',
          name: 'level 2.1',
        },
      ]
    },
    {
      name: 'close menu',
      icon: { text: '', class: 'material-icons-outlined' },
    },
  ]
  </script>

  <style>

    .background-blur {
        /* background-image: url('/images/background1.jpg'); */
        /* background-size: cover; */
        /* background-attachment: fixed; */
        filter: blur(10px);
        position: fixed;
        top: -15px;
        left: 0;
        width: 100lvw;
        height: 100lvh;
        background-color: #003391bd;
        z-index: 2;
    }
  </style>

  <style lang="scss">
    // @import "custom-var.scss";
    @import "vue-awesome-sidebar/src/scss/vue-awesome-sidebar.scss";

    $overlayer-bg-color: rgba(0, 0, 0, 0.6);
    $toggle-mini-btn-height: 50px;
    $menu-item-simpleType-icon-height: 35px;
    $menu-item-fullyType-height: 44px;
    $label-font-size: 16px;//may not work with slots
    $label-icon-size: 20px;//may not work with slots
    $scroll-bar-width: 13px;

    //<--COLORS-->
    //NOTE : the "-white" at the end of each var defines the theme, you can change it to "-dark" to set it for dark mode theme
    //example :"$icon-color-dark : #000000 " for dark theme and "$icon-color-white : #fafafa " for white theme
    //note : may not work with slots depending on how the slots is used

    //Menu
    $menu-back-ground-color-white: white; //==> $menu-back-ground-color-dark:#0d1117
    $border-color-white: #cfcfcf;
    $scroll-bar-color-white: rgb(184, 184, 184);
    $header-color-white: #213547;

    //Menu item prepend icon
    $icon-color-white: rgb(28, 30, 33);
    $icon-active-color-white: #2c7ae0;
    $icon-mini-active-color-white: #2c7ae0;
    $icon-hover-color-white: '';

    //Menu item
    $menu-item-bg-color-white: none;
    $menu-item-hover-bg-white: rgb(242, 242, 242);
    $menu-item-active-bg-color-white: rgb(242, 242, 242);
    $mini-active-item-bg-color-white: none;
    //Menu item label
    $text-color-none-hover-white: rgb(28, 30, 33);
    $text-active-color-white: #2c7ae0;
    $text-mini-active-color-white: #2c7ae0;
    $text-hover-color-white: none;

    //menu item append icon
    $append-icon-color-white: rgb(28, 30, 33);
    $append-active-icon-color-white: rgb(28, 30, 33);

    //horizental line
    $hr-line-color-white: rgba(211, 211, 211, 0.548);

    //bottomBtn for miniMenu
    $bottomBtn-bg-color-white: white;
  </style>