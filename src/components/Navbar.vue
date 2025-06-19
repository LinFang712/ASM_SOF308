<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const searchQuery = ref('')

const navLinks = ref([
  { name: 'Trang chủ', path: '/' },
  { name: 'Giới thiệu', path: '/about' },
  { name: 'Bài viết', path: '/blog' }
])

const loadUser = () => {
  const stored = localStorage.getItem('loggedInUser')
  if (stored) user.value = JSON.parse(stored)
}

const logout = () => {
  localStorage.removeItem('loggedInUser')
  user.value = null
  // Dispatch event so other parts of the app can react if needed
  window.dispatchEvent(new Event('user-logged-out'))
  // Redirect to homepage after logout for better UX
  router.push('/')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push({ name: 'search', query: { q: searchQuery.value } })
    searchQuery.value = ''
  }
}

onMounted(() => {
  loadUser()
  // This listener ensures the navbar updates if login happens on another page
  window.addEventListener('user-logged-in', loadUser)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
    <div class="container-fluid">
      <router-link class="navbar-brand fw-bold fs-3" to="/">CatBase</router-link>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="link in navLinks" :key="link.name">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
        </ul>
        <form class="d-flex me-3" role="search" @submit.prevent="handleSearch">
          <input v-model="searchQuery" class="form-control" type="search" placeholder="Tìm kiếm..." />
        </form>
        <div class="d-flex align-items-center">
          <template v-if="user">
            <router-link to="/profile" class="fw-bold me-3 text-primary text-decoration-none">
              Hello, {{ user.fullName || user.name }}
            </router-link>
            
            <router-link v-if="user.role === 'admin'" to="/admin/users" class="nav-link text-danger me-3">
              Quản lý tài khoản
            </router-link>
            
            <button class="btn btn-outline-danger btn-sm" @click="logout">Đăng xuất</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-dark me-2">Đăng nhập</router-link>
            <router-link to="/register" class="btn btn-dark">Đăng ký</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
  </template>

<style scoped>
/* Optional: Add custom styles if needed, for example to ensure links don't look out of place */
.text-decoration-none {
  text-decoration: none;
}
.nav-link.text-danger:hover {
    color: #a71b29 !important;
}
</style>