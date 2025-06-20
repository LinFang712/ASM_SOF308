<script setup>
import { ref, onMounted, inject } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref(null)
const searchQuery = ref('')
const notificationStore = inject('notificationStore')

const markNotificationsAsRead = () => {
  notificationStore.markAllAsRead()
}

// Function to fetch notifications based on user's posts
const fetchNotifications = async () => {
  if (!user.value) return;
  try {
    // Fetch notifications from db.json
    const response = await fetch('/db.json')
    const data = await response.json()
    const userId = user.value._id || user.value.id
    const userNotifications = data.notifications.find(n => n.userId === userId)
    notificationStore.clearNotifications()
    if (userNotifications && userNotifications.notifications.length > 0) {
      userNotifications.notifications.forEach(notification => {
        notificationStore.addNotification({
          id: notification.id,
          message: notification.message,
          unread: notification.unread
        })
      })
    }
  } catch (error) {
    console.error('Error fetching notifications:', error)
  }
}

const navLinks = ref([
  { name: 'Trang chủ', path: '/' },
  { name: 'Giới thiệu', path: '/about' },
  { name: 'Blog', path: '/blog' }
])

const loadUser = () => {
  const stored = localStorage.getItem('loggedInUser')
  if (stored) user.value = JSON.parse(stored)
}

const logout = () => {
  localStorage.removeItem('loggedInUser')
  user.value = null
  window.dispatchEvent(new Event('user-logged-out'))
  router.push('/')
}

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    router.push(`/search?q=${encodeURIComponent(searchQuery.value)}`)
    searchQuery.value = ''
  }
}

onMounted(() => {
  loadUser()
  window.addEventListener('user-logged-in', loadUser)
  fetchNotifications()
  // Simulate periodic check for new notifications (every 30 seconds)
  setInterval(fetchNotifications, 30000)
})
</script>

<template>
  <nav class="navbar navbar-expand-lg cat-navbar sticky-top">
    <div class="container px-0">
      <router-link class="navbar-brand fw-bold fs-3 d-flex align-items-center" to="/">
        <span class="brand-text">CatBase</span>
      </router-link>
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
          <input v-model="searchQuery" class="form-control search-input" type="search" placeholder="Tìm kiếm..." />
        </form>
        <div class="d-flex align-items-center">
          <template v-if="user">
            <router-link to="/profile" class="fw-bold me-3 text-brown text-decoration-none">
              Hello, {{ user.fullName || user.name || user.displayName || user.profile?.displayName || user.email.split('@')[0] }}
            </router-link>
            <div class="dropdown me-3">
              <button class="btn btn-link text-brown position-relative p-0" type="button" id="notificationDropdown" data-bs-toggle="dropdown" aria-expanded="false" @click="markNotificationsAsRead">
                🔔
                <span v-if="notificationStore.unreadCount > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {{ notificationStore.unreadCount }}
                </span>
              </button>
              <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="notificationDropdown">
                <li v-for="notification in notificationStore.notifications" :key="notification.id" class="dropdown-item" :class="{ 'fw-bold': notification.unread }">
                  {{ notification.message }}
                </li>
                <li v-if="notificationStore.notifications.length === 0" class="dropdown-item text-muted">Không có thông báo nào.</li>
              </ul>
            </div>
            <router-link v-if="user.role === 'admin'" to="/adminpanel" class="nav-link text-danger me-3">
              Trang quản trị
            </router-link>
            <button class="btn btn-outline-brown btn-sm" @click="logout">Đăng xuất</button>
          </template>
          <template v-else>
            <router-link to="/login" class="btn btn-outline-brown me-2">Đăng nhập</router-link>
            <router-link to="/register" class="btn btn-brown">Đăng ký</router-link>
          </template>
        </div>
      </div>
    </div>
  </nav>
</template>

<style>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

.cat-navbar {
  background: #fff8f0 !important;
  border-bottom: 2px solid #ffd6c0;
  font-family: 'Quicksand', Arial, sans-serif;
  min-height: 60px;
}

.navbar-brand,
.nav-link {
  color: #a67c52 !important;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.brand-text {
  color: #a67c52;
  font-weight: 700;
  font-size: 1.6rem;
  margin-left: 2px;
}

.navbar-brand img {
  margin-bottom: 2px;
}

.nav-link.active,
.nav-link.router-link-exact-active {
  color: #6ec1e4 !important;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 6px;
  min-width: 90px;
}
.btn-brown:hover,
.btn-brown:focus {
  background-color: #8d6843;
  color: #fff;
}

.btn-outline-brown {
  background-color: transparent;
  border: 2px solid #a67c52;
  color: #a67c52;
  font-weight: 600;
  border-radius: 6px;
  min-width: 90px;
  transition: background 0.2s, color 0.2s;
}
.btn-outline-brown:hover,
.btn-outline-brown:focus {
  background-color: #a67c52;
  color: #fff;
}

.text-brown {
  color: #a67c52 !important;
}

.text-decoration-none {
  text-decoration: none;
}

.search-input {
  min-width: 180px;
  font-size: 1em;
  border-radius: 6px;
  border: 1.5px solid #e0c9b3;
  background: #fff;
  color: #a67c52;
}

.search-input:focus {
  border-color: #a67c52;
  box-shadow: 0 0 0 0.1rem #ffd6c0;
}

.nav-link.text-danger:hover {
  color: #a71b29 !important;
}

.btn, .nav-link, .search-input {
  cursor: pointer;
}

.btn:hover, .nav-link:hover, .search-input:hover {
  cursor: pointer;
}
</style>
