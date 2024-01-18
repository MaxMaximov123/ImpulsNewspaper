import { createRouter, createWebHistory } from 'vue-router'
import Posts from '@/views/Posts.vue'
import Post from '@/views/Post.vue'
import Auth from '@/views/Auth.vue'

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
    {
      path: '/auth',
      name: 'auth',
      component: Auth
    },
  ]
})

export default router
