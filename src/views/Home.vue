<template>
  <div class="home-bg">
    <!-- Navbar wrapped in container for consistent width -->
    <div class="container px-0">
      <Navbar />
    </div>

    <!-- Feature Highlight Section -->
    <section class="container mb-5">
      <div class="row align-items-center g-4 feature-highlight">
        <div class="col-md-6 order-2 order-md-1">
          <span class="text-uppercase fw-bold text-secondary small mb-2 d-block" style="color: #e57373;">People</span>
          <h2 class="fw-bold mb-2" style="font-size:2.2rem; line-height:1.1;">
            Creative pretty photography ideas from smart devices
          </h2>
          <p class="lead text-muted mb-0" style="font-size:1.5rem;">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faci...
          </p>
        </div>
        <div class="col-md-6 order-1 order-md-2 text-center">
          <img
            src="https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=800&q=80"
            alt="Creative pretty photography ideas from smart devices"
            class="img-fluid rounded-4 shadow feature-img"
            style="max-height:340px; object-fit:cover; width:100%;"
          />
        </div>
      </div>
    </section>

    <!-- Most Viewed Section: full container width, dynamic height -->
    <section class="container mb-5">
      <h5 class="fw-bold mb-3 border-bottom pb-2">Most Viewed</h5>
      <div class="d-flex flex-row flex-nowrap overflow-auto most-viewed-row gap-4">
        <div
          v-for="(item, idx) in mostViewed"
          :key="item.id"
          class="most-viewed-card d-flex flex-column align-items-start"
        >
          <div class="position-relative w-100">
            <img
              :src="item.image"
              :alt="item.title"
              class="img-fluid rounded-4 mb-2 most-viewed-img"
              style="width:100%;height:auto;object-fit:cover;"
            />
            <span class="position-absolute badge rounded-pill bg-light text-dark shadow-sm most-viewed-badge">
              {{ idx + 1 }}
            </span>
          </div>
          <span class="text-uppercase fw-bold small mb-1" :style="{ color: item.categoryColor || '#e57373' }">
            {{ item.category }}
          </span>
          <a href="#" class="fw-bold text-dark mb-1 most-viewed-title" style="font-size:1rem; line-height:1.1;">
            {{ item.title }}
          </a>
          <span class="text-muted small mb-2" style="line-height:1.2;">
            {{ item.description }}
          </span>
        </div>
      </div>
    </section>

    <!-- Recent Posts Section (example, you can adjust as needed) -->
    <section class="container mb-5">
      <h5 class="fw-bold mb-3">Recent posts</h5>
      <div class="row">
        <div class="col-12">
          <div class="position-relative rounded-4 overflow-hidden recent-post-card">
            <img
              src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=800&q=80"
              alt="Recent post"
              class="img-fluid w-100 h-100 recent-post-img"
              style="object-fit:cover; min-height:220px;"
            />
            <div class="position-absolute bottom-0 start-0 w-100 p-4 recent-post-caption">
              <span class="text-uppercase fw-bold small mb-2 d-block" style="color: #fff; opacity:0.8;">Design</span>
              <h3 class="fw-bold text-white mb-0" style="font-size:1.5rem;">
                Is Britain’s likely next leader a great brain or an opportunist? <span class="fw-normal">Lorem ipsum dolor sit, consectetur adipiscin...</span>
              </h3>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Posts Section -->
    <div class="container animate__animated animate__fadeIn animate__delay-1s">
      <div class="d-flex align-items-center mb-4">
        <h2 class="fw-bold mb-0 me-3 text-black">Bài viết nổi bật</h2>
        <span class="badge bg-dark bg-gradient text-white animate__animated animate__pulse animate__infinite">Mới</span>
      </div>

      <!-- Loading and Error States -->
      <div v-if="isLoading" class="text-center py-5">
        <div class="spinner-border text-secondary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else-if="error" class="alert alert-danger" role="alert">
        {{ error }}
      </div>

      <!-- Post Grid -->
      <div v-else-if="posts.length" class="row g-4">
        <div
          class="col-md-6 col-lg-4 d-flex"
          v-for="(post, idx) in posts"
          :key="post.id"
        >
          <PostCard :post="post" class="w-100 animate__animated animate__fadeInUp" :style="{ 'animation-delay': `${idx * 100}ms` }"/>
        </div>
      </div>
      <div v-else class="text-center text-muted py-5">
        Không có bài viết nào.
      </div>
    </div>

    <!-- Footer -->
    <footer class="container mt-5 py-4 border-top">
       <div class="row text-secondary">
        <div class="col-md-4 mb-3 fw-bold text-dark">CatBase Stories</div>
        <div class="col-md-4 mb-3">
          <div class="mb-1 text-dark">Chủ đề</div>
          <a href="#" class="text-decoration-none text-muted d-block mb-1">Lối sống</a>
          <a href="#" class="text-decoration-none text-muted d-block mb-1">Du lịch</a>
          <a href="#" class="text-decoration-none text-muted d-block">Ẩm thực</a>
        </div>
        <div class="col-md-4 mb-3">
          <div class="mb-1 text-dark">Trang</div>
          <a href="#" class="text-decoration-none text-muted d-block mb-1">Giới thiệu</a>
          <a href="#" class="text-decoration-none text-muted d-block mb-1">Liên hệ</a>
          <a href="#" class="text-decoration-none text-muted d-block">Bảo mật</a>
        </div>
      </div>
      <div class="text-center text-muted small mt-3">&copy; 2025 CatBase Stories. Bảo lưu mọi quyền.</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import PostCard from '../components/PostCard.vue';

const posts = ref([]);
const isLoading = ref(true);
const error = ref(null);

// Example data for Most Viewed section
const mostViewed = ref([
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    category: 'People',
    categoryColor: '#e57373',
    title: 'Creative pretty photography ideas from smart devices',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscin...'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80',
    category: 'Lifestyle',
    categoryColor: '#ba68c8',
    title: 'Duis tempor purus rutrum, tincidunt lacus.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscin...'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80',
    category: 'Carousel',
    categoryColor: '#64b5f6',
    title: 'Lorem ipsum dolor sit amet, consectetur adipiscin...',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscin...'
  },
  {
    id: 4,
    image: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
    category: 'Friends',
    categoryColor: '#81c784',
    title: 'Nunc accumsan ex ligula, in sapien consectetur.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscin...'
  },
  {
    id: 5,
    image: 'https://images.unsplash.com/photo-1519125323398-675f0ddb6308?auto=format&fit=crop&w=400&q=80',
    category: 'Business',
    categoryColor: '#ffd54f',
    title: 'Corporate Workflow make a difference.',
    description: 'Lorem ipsum dolor sit amet, consectetur adipiscin...'
  }
]);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const fetchData = async () => {
  isLoading.value = true;
  error.value = null;
  try {
    const postsResponse = await axios.get(`${API_BASE_URL}/posts`);
    posts.value = postsResponse.data;
  } catch (err) {
    console.error('Error fetching data:', err);
    error.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(fetchData);
</script>

<style scoped>
:root {
  --carousel-height: 300px;
  --image-filter-grayscale: grayscale(0.1);
  --transition-smooth: 0.5s ease-in-out;
}

/* Match Home.vue color scheme to Navbar/Login.vue */
.home-bg,
body,
#app {
  background: #fff8f0 !important;
  min-height: 100vh;
}

.feature-highlight {
  min-height: 340px;
  margin-bottom: 2.5rem;
}

.feature-highlight h2 {
  font-size: 2.2rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.feature-highlight .feature-img {
  border-radius: 2rem;
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  object-fit: cover;
  width: 100%;
  max-height: 340px;
}

.most-viewed-row {
  scrollbar-width: thin;
  scrollbar-color: #e0e0e0 #fff;
  padding-bottom: 0.5rem;
}
.most-viewed-row::-webkit-scrollbar {
  height: 8px;
}
.most-viewed-row::-webkit-scrollbar-thumb {
  background: #e0e0e0;
  border-radius: 4px;
}
.most-viewed-card {
  min-width: 210px;
  max-width: 220px;
  flex: 0 0 auto;
  background: transparent;
}
.most-viewed-img {
  transition: transform 0.2s;
  width: 100%;
  height: auto;
  aspect-ratio: 4/3;
  object-fit: cover;
  border-radius: 1.2rem;
}
.most-viewed-img:hover {
  transform: scale(1.04);
}
.most-viewed-title {
  text-decoration: none;
  transition: color 0.2s;
  display: block;
  font-size: 1.05rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
  line-height: 1.2;
}
.most-viewed-title:hover {
  color: #6ec1e4 !important;
}
.most-viewed-badge {
  left: 16px;
  top: 16px;
  font-size: 1rem;
  padding: 0.35em 0.8em;
  font-weight: 600;
  z-index: 2;
}

.recent-post-card {
  min-height: 240px;
  max-height: 340px;
  background: #eee;
}
.recent-post-img {
  min-height: 220px;
  max-height: 340px;
  object-fit: cover;
  filter: brightness(0.85);
  transition: filter 0.2s;
}
.recent-post-card:hover .recent-post-img {
  filter: brightness(1);
}
.recent-post-caption {
  background: linear-gradient(0deg, rgba(0,0,0,0.7) 60%, rgba(0,0,0,0.1) 100%);
  border-radius: 0 0 1.5rem 1.5rem;
}

@media (max-width: 1200px) {
  .most-viewed-card {
    min-width: 180px;
    max-width: 200px;
  }
}
@media (max-width: 768px) {
  .feature-highlight {
    flex-direction: column;
    min-height: unset;
  }
  .feature-highlight .feature-img {
    max-height: 200px;
    margin-bottom: 1rem;
  }
  .most-viewed-card {
    min-width: 140px;
    max-width: 180px;
  }
  .recent-post-card {
    min-height: 160px;
    max-height: 200px;
  }
  .recent-post-img {
    min-height: 160px;
    max-height: 200px;
  }
}
.footer {
  background-color: #fafafa;
}

.feature-highlight,
.recent-post-card {
  background: #fdf6f0cc !important;
  border-radius: 1.5rem;
}

.most-viewed-card {
  background: #fff8f0 !important;
  border-radius: 1.2rem;
}
h2,
h3,
h5,
.fw-bold,
.text-dark {
  color: #a67c52 !important;
}

.badge.bg-dark {
  background: #a67c52 !important;
  color: #fff !important;
}
section.container,
footer.container {
  border-radius: 1.5rem;
  border: 1.5px solid #ffd6c0;
  background: #fff8f0;
}
</style>
