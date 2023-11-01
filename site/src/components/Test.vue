<template>
    <div class="q-pa-md">
      <div class="news-container justify-center q-gutter-sm">
        <div
          v-for="(post, index) in postList"
          :key="post.key"
          :data-id="index - 1"
          class="news-item q-pa-sm flex-center relative-position"
        >
          <transition name="q-transition--scale">
            <q-card>
              <q-card-section>
                <div>{{ post.text }}</div>
              </q-card-section>

              <div v-if="post.images.length > 0">
                <q-card-section>
                  <div v-if="post.images.length === 1">
                    <q-img
                        class="rounded-borders"
                        :src=post.images[0]
                        alt="Large Image"
                    />
                  </div>
                  <div v-if="post.images.length === 2" class="q-col-gutter-md row items-start">
                    <div v-for="index in 2" class="col-6">
                      <q-img
                          :src=post.images[index-1]
                          class="rounded-borders"
                          alt="Large Image"
                          :ratio="4/3"
                      />
                    </div>
                  </div>
                  <div v-if="post.images.length >= 3" class="q-col-gutter-md">
                    <div>
                      <q-img
                          class="rounded-borders"
                          :src=post.images[0]
                          alt="Large Image"
                      />
                    </div>
                    <div class="q-col-gutter-md row items-start">
                      <div v-for="index in post.images.length-1" class="col">
                        <q-img
                            :src=post.images[index]
                            class="rounded-borders"
                            alt="Large Image"
                            :ratio="Math.max(1, 10/(post.images.length-1)/3)"
                        />
                      </div>
                    </div>
                  </div>
                </q-card-section>
              </div>
            </q-card>
          </transition>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  import { ref } from 'vue'
  
  export default {
    data() {
        return {
          format: {
            6: 2,
            3: 4,
            4: 3,
            2: 6,
          },
          postList: [
              {
                  text: 'вадшрпждварпдавпСмотри фотографии со стритбола (7-8 класс) и отмечай своих одноклассников 🏀',
                  images: [
                      'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',

                    ],
                  key: ''
              },
              {
                  text: 'Смотри фотографии со стритбола (7-8 класс) и отмечай своих одноклассников 🏀',
                  images: [
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                  ],
                  key: ''
              },
              {
                  text: 'Смотри фотографии со стритбола (7-8 класс) и отмечай своих одноклассников 🏀',
                  images: [
                      'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                  ],
                  key: ''
              },
              {
                  text: 'Смотри фотографии со стритбола (7-8 класс) и отмечай своих одноклассников 🏀',
                  images: [
                      'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
                      'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                  ],
                  key: ''
              }
          ],
        }
    },

    async mounted() {

    },

    methods: {
      formatCountPictures(n) {
        if ([2, 3, 4, 6].includes(n)) {
          return n;
        }
        for (let i of [2, 3, 4, 6]) {
          if (n % i === 0) {
            return this.formatCountPictures(n / i);
          }
        }

        return n;
      }
    },
  }
  </script>
  
  <style scoped>
  .news-item {
    font-size: 1em;
    width: 40%; /* Используем проценты вместо px */
    margin-bottom: 20px;
    background-color: #f4f4f4;
    border-radius: 10px;
    padding: 20px;
    margin-left: auto;
    margin-right: auto;
    
  }

  @media (max-width: 767px) {
  
    .news-item {
      width: 100%;
      margin-right: 0;
    }
  }

  .news-container {
    justify-content: center;
  }

  .small-images {
      display: flex;
      justify-content: space-between;
  }

  .small-image {
      max-width: 50%; /* Ширина меньших фотографий */
      height: auto;
  }
  </style>