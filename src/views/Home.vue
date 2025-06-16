<template>
  <div>
    <Navbar />

    <!-- Hero Carousel -->
    <div id="heroCarousel" class="carousel slide" data-bs-ride="carousel">
      <div class="carousel-inner" style="height: 320px;">
        <div class="carousel-item active h-100">
          <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcReILJTQcYw6SDbKWsi4bPTgZ6V5zXj7zLXbg&s" class="d-block w-100 h-100 object-fit-cover" alt="cat" />
        </div>
      </div>
      <div class="carousel-indicators">
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="0" class="active"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="1"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="2"></button>
        <button type="button" data-bs-target="#heroCarousel" data-bs-slide-to="3"></button>
      </div>
    </div>

    <!-- Section Heading -->
    <div class="container mt-5">
      <h2 class="fw-bold mb-4">Section heading</h2>
      <div class="row g-4">
        <div
          class="col-md-6"
          v-for="post in posts"
          :key="post.id"
        >
          <div class="card h-100">
            <img
              :src="post.banner || 'https://via.placeholder.com/400x220?text=No+Image'"
              class="card-img-top"
              :alt="post.title"
              style="height: 220px; object-fit: cover;"
            >
            <div class="card-body">
              <h5 class="card-title">{{ post.title }}</h5>
              <p class="card-text">{{ post.about }}</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <footer class="container mt-5 py-4 border-top">
      <div class="row">
        <div class="col-md-4 mb-3">Site name</div>
        <div class="col-md-4 mb-3">
          <div>Topic</div>
          <div>Page</div>
          <div>Page</div>
          <div>Page</div>
        </div>
        <div class="col-md-4 mb-3">
          <div>Topic</div>
          <div>Page</div>
          <div>Page</div>
          <div>Page</div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const posts = ref([]);

const fetchPosts = async () => {
  try {
    const response = await axios.get('http://localhost:3001/posts');
    posts.value = response.data;
  } catch (error) {
    console.error('Lỗi khi lấy dữ liệu:', error);
  }
};

onMounted(fetchPosts);
</script>