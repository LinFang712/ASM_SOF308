<template>
  <div>
    <Navbar />
    <!-- IMPROVEMENT: Added themed background container -->
    <div class="blog-container">
      <div class="container py-5">
        
        <!-- IMPROVEMENT: New styled header for title and controls -->
        <header class="blog-header mb-5">
          <div class="header-content">
            <h1 class="header-title">Blog của Chúng Tôi</h1>
            <p class="header-subtitle">Những câu chuyện và cập nhật mới nhất từ cộng đồng của chúng tôi.</p>
            <router-link v-if="isAuthor" to="/new-post" class="btn btn-light-custom">
              <i class="bi bi-pencil-square me-2"></i>Viết Bài Mới
            </router-link>
          </div>
          <div class="sorting-controls">
            <div class="sort-item">
              <label for="sortCategory" class="form-label">Danh Mục:</label>
              <select id="sortCategory" v-model="selectedCategory" class="form-select-custom">
                <option value="">Tất Cả</option>
                <option v-for="category in categories" :key="category._id" :value="category.name">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="sort-item">
              <label for="sortViews" class="form-label">Phổ Biến:</label>
              <select id="sortViews" v-model="sortByViews" class="form-select-custom">
                <option value="desc">Xem Nhiều Nhất</option>
                <option value="asc">Xem Ít Nhất</option>
              </select>
            </div>
          </div>
        </header>

        <!-- IMPROVEMENT: Added loading state -->
        <div v-if="loading" class="text-center p-5">
          <div class="spinner-border text-white" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>

        <!-- IMPROVEMENT: Added empty state for no results -->
          <div v-else-if="filteredAndSortedPosts.length === 0" class="empty-state text-center p-5">
          <i class="bi bi-search display-4"></i>
          <h4 class="mt-3">Không Tìm Thấy Bài Viết</h4>
          <p>Hãy thử điều chỉnh bộ lọc để tìm kiếm nội dung bạn muốn.</p>
        </div>
        
        <!-- Posts Display -->
        <div v-else class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
          <div v-for="post in filteredAndSortedPosts" :key="post._id" class="col">
            <div class="card h-100 shadow-sm border-0">
              <img
                :src="post.featuredImage?.url || 'https://placehold.co/400x220/E0C9B3/A67C52?text=Cat+Blog'"
                class="card-img-top"
                :alt="post.title"
              />
              <div class="card-body d-flex flex-column">
                <h5 class="card-title text-truncate" :title="post.title">
                  {{ post.title }}
                </h5>
                <p class="card-text">
                  {{ post.excerpt || 'Không có mô tả.' }}
                </p>
                <!-- IMPROVEMENT: Restyled stats badges -->
                <div class="post-stats mt-2">
                  <span class="stat-item" title="Likes"><i class="bi bi-heart-fill"></i> {{ post.stats.likes }}</span>
                  <span class="stat-item" title="Views"><i class="bi bi-eye-fill"></i> {{ post.stats.views }}</span>
                  <span class="stat-item" title="Comments"><i class="bi bi-chat-fill"></i> {{ post.comments?.length || 0 }}</span>
                </div>
                <router-link :to="'/posts/' + post.id" class="btn btn-outline-brown mt-auto align-self-start">
                  Đọc Thêm
                </router-link>
              </div>
              <div class="card-footer small text-muted">
                <i class="bi bi-calendar3 me-1"></i> {{ formatDate(post.publishedAt) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import Navbar from '../components/Navbar.vue';
import db from '../../db.json';

// --- State ---
const user = ref(null);
const posts = ref([]);
const categories = ref([]);
const loading = ref(true); // IMPROVEMENT: Added loading state

const selectedCategory = ref('');
const sortByViews = ref('desc');

// --- Computed Properties ---
const isAuthor = computed(() => {
  return user.value && (user.value.role === 'author' || user.value.role === 'admin');
});

const filteredAndSortedPosts = computed(() => {
  let filtered = selectedCategory.value 
    ? posts.value.filter(post => post.category === selectedCategory.value)
    : posts.value;

  return filtered.sort((a, b) => {
    return sortByViews.value === 'desc' 
      ? b.stats.views - a.stats.views 
      : a.stats.views - b.stats.views;
  });
});

// --- Functions ---
const loadUser = () => {
  const stored = localStorage.getItem('loggedInUser');
  if (stored) user.value = JSON.parse(stored);
};

const formatDate = (dateString) => {
  if (!dateString) return 'Chưa Xuất Bản';
  return new Date(dateString).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
};

// --- Lifecycle Hooks ---
onMounted(() => {
  loadUser();
  window.addEventListener('user-logged-in', loadUser);

  // IMPROVEMENT: Simulate async data loading
  setTimeout(() => {
    posts.value = db.posts;
    categories.value = db.categories;
    loading.value = false;
  }, 500); // Simulate 0.5 second network delay
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.blog-container {
  background-color: #fff8f0; /* Same as PostDetail */
  min-height: 100vh;
  font-family: 'Quicksand', sans-serif;
}

/* --- Header Styles --- */
.blog-header {
  background-color: #a67c52;
  color: white;
  padding: 2.5rem;
  border-radius: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1.5rem;
}

.header-title {
  font-weight: 700;
  font-size: 2.5rem;
  margin: 0;
}

.header-subtitle {
  font-size: 1.1rem;
  opacity: 0.9;
  margin-top: 0.25rem;
}

.btn-light-custom {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
    border: 1px solid rgba(255, 255, 255, 0.3);
    padding: 0.6rem 1.2rem;
    border-radius: 8px;
    font-weight: 700;
    transition: all 0.3s ease;
    margin-top: 1rem;
}

.btn-light-custom:hover {
    background-color: rgba(255, 255, 255, 0.25);
    transform: translateY(-2px);
}

.sorting-controls {
  display: flex;
  gap: 1.5rem;
}

.sort-item .form-label {
  font-weight: 700;
  font-size: 0.9rem;
  opacity: 0.9;
}

.form-select-custom {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  padding: 0.5rem 1rem;
}
.form-select-custom option {
  background-color: #8d6843;
  color: white;
}

/* --- Card Styles --- */
.card {
  transition: all 0.3s ease;
  border: none;
  border-radius: 12px;
  overflow: hidden;
}

.card:hover {
  transform: translateY(-8px);
  box-shadow: 0 10px 20px rgba(0,0,0,0.1);
}

.card-img-top {
  height: 220px;
  object-fit: cover;
}

.card-body {
  padding: 1.25rem;
}

.card-title {
  font-size: 1.2rem;
  font-weight: 700;
  color: #a67c52;
}

.card-text {
  color: #8d6843;
  min-height: 48px;
}

.card-footer {
    background-color: #fff;
    border-top: 1px solid #f3e9dd;
}

/* --- Stats & Buttons --- */
.post-stats {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: #8d6843;
}

.stat-item i {
    color: #c9a78a;
    margin-right: 0.3rem;
}

.btn-outline-brown {
  border: 2px solid #e0c9b3;
  color: #a67c52;
  font-weight: 700;
  border-radius: 50px;
  transition: all 0.3s ease;
}

.btn-outline-brown:hover {
  background-color: #a67c52;
  color: white;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(166, 124, 82, 0.2);
}

/* --- Empty/Loading State --- */
.empty-state {
    background-color: rgba(255,255,255,0.1);
    border-radius: 12px;
    color: white;
}
</style>
