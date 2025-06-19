<template>
  <div class="home-bg">
    <div class="container px-0">
      <Navbar />
    </div>

    <!-- Feature Highlight: Latest Published Post -->
    <section v-if="featurePost" class="container mt-5">
      <div class="row align-items-center g-4 feature-highlight">
        <div class="col-md-6 order-2 order-md-1">
          <span
            class="text-uppercase fw-bold text-secondary small mb-2 d-block"
            :style="{ color: getCategoryColor(featurePost.category) }"
          >
            {{ featurePost.category }}
          </span>
          <router-link :to="{ path: `/posts/${featurePost.id}` }" class="fw-bold mb-2" style="font-size:2.2rem; line-height:1.1; text-decoration: none; color: inherit;">
            {{ featurePost.title }}
          </router-link>
          <p class="lead text-muted mb-0" style="font-size:1.5rem;">
            {{ featurePost.excerpt }}
          </p>
        </div>
        <div class="col-md-6 order-1 order-md-2 text-center">
          <img
            :src="featurePost.featuredImage.url"
            :alt="featurePost.featuredImage.altText"
            class="img-fluid rounded-4 shadow feature-img"
          />
        </div>
      </div>
    </section>

    <!-- Most Viewed Posts Section -->
    <section class="container mb-5">
      <h5 class="fw-bold mb-4 most-viewed-title">
        <span>Most Viewed</span>
      </h5>
      <div class="d-flex flex-row flex-nowrap overflow-auto most-viewed-row gap-4">
        <div
          v-for="(post, idx) in mostViewedPosts"
          :key="post._id"
          class="most-viewed-card d-flex flex-column align-items-start p-3"
        >
          <div class="position-relative w-100">
            <img
              :src="post.featuredImage.url"
              :alt="post.featuredImage.altText"
              class="img-fluid rounded-4 mb-2 most-viewed-img"
            />
            <span class="position-absolute badge rounded-pill most-viewed-badge">
              {{ idx + 1 }}
            </span>
          </div>
          <span class="text-uppercase fw-bold small mb-1 most-viewed-category" :style="{ color: getCategoryColor(post.category) }">
            {{ post.category }}
          </span>
          <router-link :to="{ path: `/posts/${post.id}` }" class="fw-bold most-viewed-post-title mb-1">
            {{ post.title }}
          </router-link>
          <span class="text-muted small mb-2" style="line-height:1.2;">
            {{ post.excerpt }}
          </span>
        </div>
      </div>
    </section>

    <!-- Recent Posts Section -->
    <section class="container mb-5" v-if="recentPosts.length">
      <h5 class="fw-bold mb-4 border-bottom pb-2">Recent posts</h5>

      <!-- Special Layout for First 3 Posts -->
      <div class="row g-4 mb-4">
        <!-- First post: full width -->
        <div class="col-12" v-if="recentPosts[0]">
          <div class="card recent-post-card recent-post-card-lg">
            <img
              :src="recentPosts[0].featuredImage.url"
              :alt="recentPosts[0].featuredImage.altText"
              class="card-img recent-post-img"
            />
            <div class="card-img-overlay d-flex flex-column justify-content-end p-4">
              <span class="text-uppercase fw-bold small mb-2 d-block" :style="{ color: getCategoryColor(recentPosts[0].category) }">
                {{ recentPosts[0].category }}
              </span>
              <router-link :to="{ path: `/posts/${recentPosts[0].id}` }" class="card-title fw-bold text-white mb-1" style="text-decoration: none; color: inherit;">
                {{ recentPosts[0].title }}
              </router-link>
              <p class="card-text text-white d-none d-sm-block">
                {{ recentPosts[0].excerpt }}
              </p>
            </div>
          </div>
        </div>

        <!-- Second post: 2/3 width -->
        <div class="col-md-8" v-if="recentPosts[1]">
          <div class="card recent-post-card recent-post-card-md h-100">
            <img
              :src="recentPosts[1].featuredImage.url"
              :alt="recentPosts[1].featuredImage.altText"
              class="card-img recent-post-img"
            />
            <div class="card-img-overlay d-flex flex-column justify-content-end p-4">
              <span class="text-uppercase fw-bold small mb-2 d-block" :style="{ color: getCategoryColor(recentPosts[1].category) }">
                {{ recentPosts[1].category }}
              </span>
              <router-link :to="{ path: `/posts/${recentPosts[1].id}` }" class="card-title fw-bold text-white mb-1" style="text-decoration: none; color: inherit;">
                {{ recentPosts[1].title }}
              </router-link>
            </div>
          </div>
        </div>

        <!-- Third post: 1/3 width -->
        <div class="col-md-4" v-if="recentPosts[2]">
          <div class="card recent-post-card recent-post-card-sm h-100">
             <img
              :src="recentPosts[2].featuredImage.url"
              :alt="recentPosts[2].featuredImage.altText"
              class="card-img recent-post-img"
            />
            <div class="card-img-overlay d-flex flex-column justify-content-end p-3">
               <span class="text-uppercase fw-bold small mb-1 d-block" :style="{ color: getCategoryColor(recentPosts[2].category) }">
                {{ recentPosts[2].category }}
              </span>
              <router-link :to="{ path: `/posts/${recentPosts[2].id}` }" class="card-title fw-bold text-white mb-1" style="font-size: 1.1rem; text-decoration: none; color: inherit;">
                {{ recentPosts[2].title }}
              </router-link>
            </div>
          </div>
        </div>
      </div>

      <!-- Standard 3-Column Grid for the Rest of the Posts -->
      <div class="row g-4 mb-4">
        <div class="col-lg-4 col-md-6" v-for="post in remainingPosts" :key="post._id">
          <div class="card h-100 shadow-sm border-0 recent-post-card-grid">
             <img :src="post.featuredImage.url" class="card-img-top" :alt="post.featuredImage.altText">
             <div class="card-body">
                <span class="text-uppercase fw-bold small mb-2 d-block" :style="{ color: getCategoryColor(post.category) }">
                  {{ post.category }}
                </span>
                <router-link :to="{ path: `/posts/${post.id}` }" class="card-title fw-bold" style="text-decoration: none; color: inherit;">
                  {{ post.title }}
                </router-link>
                <p class="card-text text-muted small">{{ post.excerpt }}</p>
             </div>
          </div>
        </div>
      </div>

      <!-- Load More Button -->
      <div class="text-center mt-5 mb-3" v-if="hasMorePosts">
        <button @click="loadMore" class="btn load-more-btn" :disabled="isLoading">
          <span v-if="isLoading">
            <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Đang tải...
          </span>
          <span v-else>
            Xem thêm
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-arrow-down ms-1" viewBox="0 0 16 16">
              <path fill-rule="evenodd" d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1"/>
            </svg>
          </span>
        </button>
      </div>
    </section>

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
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

// State
const posts = ref([]);
const isLoading = ref(true);
const error = ref(null);

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';

const fetchData = async () => {
  // Reset grid display limit on new fetch
  gridDisplayLimit.value = 3; // Initial number of grid posts

  isLoading.value = true;
  error.value = null;
  try {
    const postsResponse = await axios.get(`${API_BASE_URL}/posts`);
    posts.value = postsResponse.data
      .filter(p => p.status === 'published')
      .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt));
  } catch (err) {
    error.value = 'Không thể tải dữ liệu. Vui lòng thử lại sau.';
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

// Lifecycle hook
onMounted(fetchData);

// State for pagination
const gridDisplayLimit = ref(3); // Number of posts to show in the grid initially
const postsPerLoad = 6; // Number of additional posts to load per click

// Computed property for the main feature post (the latest one)
const featurePost = computed(() => posts.value[0]);

// Computed property for all posts excluding the main feature one
const recentPosts = computed(() => posts.value.slice(1));

// Computed property for the standard grid posts (from the 4th recent post onwards, limited by gridDisplayLimit)
const remainingPosts = computed(() => recentPosts.value.slice(3, 3 + gridDisplayLimit.value));

// Computed property to check if there are more posts to load
const hasMorePosts = computed(() => recentPosts.value.length > 3 + gridDisplayLimit.value);

// Method to load more posts

// Computed property for most viewed posts (top 5 by default)
const mostViewedPosts = computed(() =>
  [...posts.value]
    .sort((a, b) => (b.stats?.views || 0) - (a.stats?.views || 0))
    .slice(0, 5)
);

const loadMore = async () => {
  isLoading.value = true;
  // Simulate loading delay for better UX
  await new Promise(resolve => setTimeout(resolve, 500));
  gridDisplayLimit.value += postsPerLoad;
  isLoading.value = false;
};


const getCategoryColor = (category) => {
  const categoryColors = {
    'Cat Behavior': '#e57373',
    'Feline Health': '#ba68c8',
    'Grooming & Care': '#64b5f6',
    'Breed Spotlights': '#81c784',
    'Funny & Cute': '#ffd54f',
  };
  return categoryColors[category] || '#a67c52';
};
</script>

<style>
:root {
  --transition-smooth: 0.3s ease-in-out;
  --card-border-radius: 1.25rem;
  --theme-bg: #fff8f0;
  --theme-border: #ffd6c0;
  --theme-brown: #a67c52;
  --theme-blue: #6ec1e4;
}

body, .home-bg {
  background-color: var(--theme-bg) !important;
}

section.container {
  background: var(--theme-bg);
  border-radius: 1.5rem;
  border: none;
  margin-bottom: 3.5rem !important;
  padding: 1.5rem;
}

h2, h3, h4, h5, .fw-bold, .text-dark {
  color: var(--theme-brown) !important;
}

.text-secondary {
  color: var(--theme-brown) !important;
}

a, .most-viewed-post-title, .recent-post-card-grid .card-title {
  color: var(--theme-brown) !important;
  text-decoration: none;
  transition: color 0.2s;
}
a:hover, .most-viewed-post-title:hover, .recent-post-card-grid .card-title:hover {
  color: var(--theme-blue) !important;
}

/* Feature Highlight Section */
.feature-highlight .feature-img {
  border-radius: var(--card-border-radius);
  box-shadow: 0 8px 32px rgba(166,124,82,0.10);
  object-fit: cover;
  width: 100%;
  max-height: 340px;
  transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
}
.feature-highlight .feature-img:hover {
  transform: scale(1.03);
  box-shadow: 0 12px 36px rgba(166,124,82,0.18);
}

/* Most Viewed Posts Section */
.most-viewed-title {
  color: var(--theme-brown) !important;
  font-size: 1.25rem;
  border-bottom: none;
  display: inline-block;
  padding-bottom: 2px;
  margin-bottom: 1.5rem !important;
  letter-spacing: 0.5px;
}

.most-viewed-row {
  padding-bottom: 1rem;
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
}

.most-viewed-card {
  background-color: #f7e7d6;
  border-radius: 1.2rem;
  overflow: hidden;
  position: relative;
  transition: transform 0.3s, box-shadow 0.3s;
  min-width: 220px;
  border: none;
}

.most-viewed-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px rgba(0,0,0,0.08);
}

.most-viewed-img {
  width: 100%;
  height: 140px;
  object-fit: cover;
  border-radius: 0.8rem;
}

.most-viewed-badge {
  background-color: var(--theme-border);
  color: var(--theme-brown) !important;
  padding: 0.5rem 1rem;
  font-size: 1rem;
  font-weight: bold;
  top: 10px;
  left: 10px;
  border: none;
}

.most-viewed-category {
  color: var(--theme-brown) !important;
  opacity: 0.7;
  letter-spacing: 0.5px;
}

.most-viewed-post-title {
  color: var(--theme-brown) !important;
  font-size: 1.1rem;
  font-weight: 700;
  text-decoration: none;
  line-height: 1.2;
  transition: color 0.2s;
  display: block;
}

.most-viewed-post-title:hover {
  color: var(--theme-blue) !important;
}

.most-viewed-card .small {
  color: #6c757d !important;
}

.load-more-btn {
    background-color: #f7e7d6;
    color: var(--theme-brown) !important;
    border: 2px solid var(--theme-border);
    border-radius: 2rem;
    padding: 0.75rem 2.5rem;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 8px rgba(166,124,82,0.1);
}

.load-more-btn:hover {
    background-color: var(--theme-border);
    color: var(--theme-brown) !important;
    transform: translateY(-3px);
    box-shadow: 0 8px 15px rgba(166,124,82,0.15);
}

.load-more-btn:active {
    transform: translateY(-1px);
    box-shadow: 0 4px 8px rgba(166,124,82,0.1);
}

.load-more-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
    transform: none;
}
/* Recent Posts Cards - General Styling */
.recent-post-card, .recent-post-card-grid {
  border: none;
  border-radius: var(--card-border-radius);
  overflow: hidden;
  position: relative;
  transition: transform var(--transition-smooth), box-shadow var(--transition-smooth);
  background: #f7e7d6;
}

.recent-post-card:hover, .recent-post-card-grid:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 24px rgba(0,0,0,0.1);
}

.recent-post-card .card-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  filter: brightness(0.8);
  transition: filter var(--transition-smooth), transform var(--transition-smooth);
}
.recent-post-card:hover .card-img {
    filter: brightness(1);
    transform: scale(1.05);
}

.recent-post-card .card-img-overlay {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%);
  color: white;
}
.recent-post-card .card-title, .recent-post-card .card-text, .recent-post-card .small {
    color: white !important;
    text-shadow: 1px 1px 3px rgba(0,0,0,0.5);
}
.recent-post-card .small {
    opacity: 0.9;
}

/* Specific Sizes for Special Layout */
.recent-post-card-lg { min-height: 400px; }
.recent-post-card-md { min-height: 350px; }
.recent-post-card-sm { min-height: 350px; }

/* Grid Layout Card Styling */
.recent-post-card-grid {
    background-color: #f7e7d6;
}
.recent-post-card-grid .card-img-top {
    height: 200px;
    object-fit: cover;
    border-radius: var(--card-border-radius) var(--card-border-radius) 0 0;
}
.recent-post-card-grid .card-body {
    padding: 1.25rem;
}
.recent-post-card-grid .card-title {
    font-size: 1.15rem;
    color: var(--theme-brown) !important;
}
.recent-post-card-grid .card-text {
    font-size: 0.9rem;
    color: #6c757d !important;
}
.recent-post-card-grid .small {
    color: var(--theme-brown) !important;
}

/* Footer */
footer.container {
  border-radius: 1.5rem;
  border: none;
  background: var(--theme-bg);
  margin-bottom: 2rem;
  box-shadow: 0 2px 12px rgba(166,124,82,0.06);
}
footer .fw-bold {
  color: var(--theme-brown) !important;
  font-size: 1.2rem;
  letter-spacing: 0.5px;
}
footer .text-dark {
  color: var(--theme-brown) !important;
}
footer .text-muted {
  color: var(--theme-blue) !important;
}
footer a {
  transition: color 0.2s;
}
footer a:hover {
  color: var(--theme-brown) !important;
  text-decoration: underline;
}


/* Responsive Adjustments */
@media (max-width: 991.98px) {
  .recent-post-card-lg, .recent-post-card-md, .recent-post-card-sm {
    min-height: 300px;
  }
}

@media (max-width: 767.98px) {
  .recent-post-card-lg, .recent-post-card-md, .recent-post-card-sm {
    min-height: 250px;
  }
  .feature-highlight .feature-img {
    max-height: 250px;
  }
}
</style>
