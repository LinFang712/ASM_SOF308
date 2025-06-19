import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Profile from '../views/Profile.vue'
import About from '../views/About.vue'
import Blog from '../views/Blog.vue'
const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/profile', component: Profile, meta: { requiresAuth: true } },
  { path: '/about', component: About },
  { path: '/blog', component: Blog },
  { path: '/adminpanel', component: () => import('../views/AdminPanel.vue'), meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/search', component: () => import('../views/Search.vue') },
  { path: '/posts/:id', component: () => import('../views/PostDetail.vue') }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

// Bảo vệ route nếu chưa đăng nhập
router.beforeEach((to, from, next) => {
  const storedUser = localStorage.getItem('loggedInUser')
  const user = storedUser ? JSON.parse(storedUser) : null

  if (to.meta.requiresAuth && !user) {
    next('/login')
  } else if (to.meta.requiresAdmin && user?.role !== 'admin') {
    alert('Bạn không có quyền truy cập trang này!')
    next('/') // hoặc quay lại trang chủ
  } else {
    next()
  }
})

export default router
