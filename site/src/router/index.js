import { createRouter, createWebHistory } from 'vue-router'
import Posts from '@/views/Posts.vue'
import Post from '@/views/Post.vue'
import Auth from '@/views/Auth.vue'
import PaperEdition from '@/views/PaperEdition.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'main',
      component: Posts
    },
    {
      path: '/post/:postId',
      name: 'post',
      component: Post
    },
    {
      path: '/auth/:key',
      name: 'auth',
      component: Auth
    },
    {
      path: '/paperEdition/:pathMatch(.*)*',
      name: 'paperEdition',
      component: PaperEdition
    },
  ]
})

export default router
