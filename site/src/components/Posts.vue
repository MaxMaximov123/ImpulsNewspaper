<template>
  <div class="image-container">
    <img
      v-for="image in images"
      :key="image.id"
      :src="image.url"
      alt="Image"
      class="image"
    />
  </div>
</template>

<script>
  export default {
    data() {
      return {
        images: [
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          },
          {
            url: 'https://sun36-2.userapi.com/impg/aUuEudvXfQdqQKbFdSh_fytrMTIgyfucqOpc6g/EDk_5vK3-xM.jpg?size=807x418&quality=95&sign=a88baf62c51c288a2092fb5f3a0963d2&c_uniq_tag=RjIv4cRJIrm6eZ6hikt1Xci-vlAlIioWBqRo6cpWLps&type=album',
          }
        ]
      }
    }
  }
</script>

<style scoped>
.image-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
}

.image {
  width: 30%; /* Ширина изображения */
  height: 200px; /* Высота изображения */
  object-fit: cover; /* Обрезка изображения так, чтобы оно заполнило блок */
  overflow: hidden; /* Скрытие части изображения, выходящей за пределы блока */
}
</style>