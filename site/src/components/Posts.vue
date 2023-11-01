<template>
    <div class="q-pa-md row items-start q-gutter-md posts-container">
      <q-card class="post-item" v-for="post in postList">
        <q-card-section class="q-pt-none">
          {{ post.text }}
        </q-card-section>

        <div class="images" v-if="post.images.length > 0">
            <q-card-section class="q-pa-md">
            <q-img
                :src=post.images[0]
                alt="Large Image"
                class="large-image"
            />
                </q-card-section>

            <q-card-section class="q-pa-md">
                <div class="small-images">
                    <q-img v-for="image in post.images.slice(1)"
                    :src=image
                    alt="Small Image 1"
                    class="small-image"
                    />
                </div>
            </q-card-section>
        </div>
      </q-card>
  
    </div>
  </template>
  
  <script>
  export default {
    data() {
        return {
        postList: [
            {
                text: 'Смотри фотографии со стритбола (7-8 класс) и отмечай своих одноклассников 🏀',
                images: [
                    'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
                    'https://sun36-1.userapi.com/impg/rnpFtvam8TSOWJPH9fruCgn7TsP5WSgU2k7LHA/BkaU1QUbZDo.jpg?size=807x605&quality=95&sign=f561044c4100011ed5b080e5f25fcc3c&c_uniq_tag=MkIVAZkL6CZfIqbnDIVy9QDvpww5XG3O0SVultjCVmI&type=album',
                ],
                key: ''
            }
        ],

        loading: false,
        page: 1,
        };
    },
  }
  </script>
  
  <style scoped>
    .posts-container {
        max-width: 800px; /* Максимальная ширина контейнера новостей */
        margin: 0 auto; /* Центрирование контейнера на странице */
        display: flex;
        flex-wrap: wrap;
        justify-content: space-between; /* Равномерное распределение между новостями */
    }

    .post-item {
        width: calc(33.33% - 10px); /* Ширина каждой новости с расстоянием между ними */
        margin-bottom: 20px; /* Расстояние между новостями */
        background-color: #f4f4f4; /* Цвет фона новости */
        border-radius: 10px; /* Округлые рамки новости */
        padding: 20px;
    }
    .posts {
        width: 100%;
        max-width: 250px;
    }

    .large-image {
        max-width: 100%;
        height: auto;
    }
    
    .small-images {
        display: flex;
        justify-content: space-between;
    }
    
    .small-image {
        max-width: 30%; /* Ширина меньших фотографий */
        height: auto;
    }
  </style>