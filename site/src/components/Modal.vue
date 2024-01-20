<template>
    <v-dialog v-model="dialog" class="model">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-card-title style="position:fixed;">
            <span>{{ title }}</span>
          </v-card-title>
          <v-spacer></v-spacer>
          <v-btn icon @click="close" v-close-popup>
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-actions>
        <v-card-text>
          <slot></slot>
        </v-card-text>
      </v-card>
    </v-dialog>
  </template>
  
  <script>
  export default {
    props: {
      value: Boolean,
      title: String
    },
    computed: {
      dialog: {
        get() {
          return this.value;
        },
        set(value) {
          this.$emit("input", value);
        }
      }
    },
    methods: {
      close() {
        this.dialog = false;
        this.$emit("closeModal", this.dialog);
      }
    }
  };
  </script>

  <style>

  .model {
    height: 60lvh;
    width: 50lvh;
  }
  </style>
  