import { createRouter, createWebHistory } from 'vue-router'
import Posts from '../views/Posts.vue'
import Post from '../views/Post.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Posts
    },
    {
      path: '/post/:postKey',
      name: 'post',
      component: Post
    },
  ]
})

export default router
