<template>
  <div>
    <Navbar />

    <!-- Hero Carousel (dynamic from db.json) -->
    <div
      id="heroCarousel"
      class="carousel slide mb-5 shadow rounded animate__animated animate__fadeInDown"
      data-bs-ride="carousel"
      style="overflow: hidden;"
    >
      <div class="carousel-inner" style="height: 340px;">
        <div
          v-for="(slide, idx) in carousels"
          :key="slide.id"
          class="carousel-item h-100"
          :class="{ active: idx === 0 }"
        >
          <img
            :src="slide.image"
            class="d-block w-100 h-100 object-fit-cover"
            alt="carousel"
            style="filter: grayscale(0.1); transition: filter 1.2s cubic-bezier(.4,2,.6,1);"
          />
          <div class="carousel-caption d-none d-md-block bg-black bg-opacity-75 rounded p-3 animate__animated animate__fadeInUp animate__delay-1s">
            <h5 class="fw-bold text-white animate__animated animate__fadeInLeft animate__delay-2s">{{ slide.title }}</h5>
            <p class="text-white-50 animate__animated animate__fadeInRight animate__delay-3s">{{ slide.description }}</p>
          </div>
        </div>
      </div>
      <button class="carousel-control-prev" type="button" data-bs-target="#heroCarousel" data-bs-slide="prev">
        <span class="carousel-control-prev-icon"></span>
      </button>
      <button class="carousel-control-next" type="button" data-bs-target="#heroCarousel" data-bs-slide="next">
        <span class="carousel-control-next-icon"></span>
      </button>
      <div class="carousel-indicators">
        <button
          v-for="(slide, idx) in carousels"
          :key="slide.id"
          type="button"
          data-bs-target="#heroCarousel"
          :data-bs-slide-to="idx"
          :class="{ active: idx === 0 }"
        ></button>
      </div>
    </div>

    <!-- Section Heading -->
    <div class="container animate__animated animate__fadeIn">
      <div class="d-flex align-items-center mb-4">
        <h2 class="fw-bold mb-0 me-3 text-black animate__animated animate__fadeInLeft">Featured Posts</h2>
        <span class="badge bg-black bg-gradient text-white animate__animated animate__pulse animate__infinite">New</span>
      </div>
      <div class="row g-4">
        <div
          class="col-md-6 col-lg-4"
          v-for="(post, idx) in posts"
          :key="post.id"
        >
          <div
            class="card h-100 shadow border-0 animate__animated"
            :class="`animate__fadeInUp animate__delay-${(idx%3)+1}s`"
            style="background: #fff; transition: box-shadow .3s;"
          >
            <div class="position-relative">
              <img
                :src="post.banner || 'https://via.placeholder.com/400x220?text=No+Image'"
                class="card-img-top"
                :alt="post.tittle"
                style="height: 220px; object-fit: cover; filter: grayscale(0.2) brightness(0.96); transition: filter .3s, transform .3s;"
                @mouseover="e => { e.target.style.filter='grayscale(0) brightness(1.05)'; e.target.style.transform='scale(1.03)'; }"
                @mouseleave="e => { e.target.style.filter='grayscale(0.2) brightness(0.96)'; e.target.style.transform='scale(1)'; }"
              >
              <span class="position-absolute top-0 end-0 m-2 badge bg-black bg-opacity-75 text-white shadow-sm animate__animated animate__fadeInDown" v-if="post.about">
                <i class="bi bi-info-circle"></i>
              </span>
            </div>
            <div class="card-body d-flex flex-column">
              <h5 class="card-title fw-semibold text-truncate text-black" :title="post.tittle">
                <span class="animate__animated animate__fadeInLeft animate__delay-1s">{{ post.tittle }}</span>
              </h5>
              <p class="card-text text-secondary" style="min-height: 48px;">
                <span class="animate__animated animate__fadeIn animate__delay-2s">{{ post.about || 'No description available.' }}</span>
              </p>
              <button class="btn btn-outline-dark mt-auto align-self-start px-3 py-1 rounded-pill animate__animated animate__fadeInUp animate__delay-3s">
                Read More
              </button>
            </div>
            <div class="card-footer bg-white border-0 small text-muted animate__animated animate__fadeIn animate__delay-4s">
              <i class="bi bi-clock"></i> Just now
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="container mt-5 py-4 border-top animate__animated animate__fadeInUp animate__delay-2s">
      <div class="row text-secondary">
        <div class="col-md-4 mb-3 fw-bold text-black">KFC Stories</div>
        <div class="col-md-4 mb-3">
          <div class="mb-1 text-black">Topics</div>
          <a href="#" class="text-decoration-none text-black-50 d-block mb-1">Lifestyle</a>
          <a href="#" class="text-decoration-none text-black-50 d-block mb-1">Travel</a>
          <a href="#" class="text-decoration-none text-black-50 d-block">Food</a>
        </div>
        <div class="col-md-4 mb-3">
          <div class="mb-1 text-black">Pages</div>
          <a href="#" class="text-decoration-none text-black-50 d-block mb-1">About</a>
          <a href="#" class="text-decoration-none text-black-50 d-block mb-1">Contact</a>
          <a href="#" class="text-decoration-none text-black-50 d-block">Privacy</a>
        </div>
      </div>
      <div class="text-center text-muted small mt-3">&copy; 2025 KFC Stories. All rights reserved.</div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
// import 'animate.css';

const posts = ref([]);
const carousels = ref([]);

const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/posts');
    posts.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

const fetchCarousels = async () => {
  try {
    const response = await axios.get('http://localhost:3001/carousel');
    carousels.value = response.data;
  } catch (error) {
    carousels.value = [];
  }
};

onMounted(() => {
  fetchPosts();
  fetchCarousels();
});
</script>

<style scoped>
.card:hover {
  box-shadow: 0 0.5rem 1.5rem rgba(0,0,0,.18);
  transform: translateY(-4px) scale(1.025);
  border-color: #000 !important;
}
.card-title {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.btn-outline-dark {
  border-width: 2px;
}
.carousel,
.card,
footer {
  background: #fff;
}
</style>