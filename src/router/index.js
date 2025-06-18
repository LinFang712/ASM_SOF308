import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login.vue')
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/Register.vue')
  },
  {
    path: '/profile',
    name: 'profile',
    component: () => import('../views/Profile.vue')
  },
  // Add About page
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About.vue')
  },
  // Add Blog page
  {
    path: '/blog',
    name: 'blog',
    component: () => import('../views/Blog.vue')
  },
  // Add Search Results page
  {
    path: '/search',
    name: 'search',
    component: () => import('../views/Search.vue')
  },
  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'notfound',
    component: () => import('../views/NotFound.vue')
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router