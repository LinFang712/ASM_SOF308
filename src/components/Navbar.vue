<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom sticky-top">
    <div class="container-fluid">
      <!-- Brand logo now uses router-link to prevent page reload -->
      <router-link class="navbar-brand fw-bold fs-3" to="/">CatBase</router-link>

      <!-- Added ARIA controls for better accessibility -->
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
        <span class="navbar-toggler-icon"></span>
      </button>

      <div class="collapse navbar-collapse" id="navbarNav">
        <!-- Navigation links are now dynamically generated from a data source -->
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item" v-for="link in navLinks" :key="link.name">
            <router-link class="nav-link" :to="link.path">{{ link.name }}</router-link>
          </li>
        </ul>

        <!-- The search form is now functional -->
        <form class="d-flex me-3" role="search" @submit.prevent="handleSearch">
          <input
            v-model="searchQuery"
            class="form-control"
            type="search"
            placeholder="Tìm kiếm..."
            aria-label="Search"
          />
        </form>

        <!-- The "Join" button is now a router-link for correct SPA navigation, styled as a button -->
        <router-link to="/register" class="btn btn-dark">Tham gia</router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

// --- Data-driven navigation links ---
// This makes it much easier to add, remove, or change links in the future.
const navLinks = ref([
  { name: 'Trang chủ', path: '/' },
  { name: 'Giới thiệu', path: '/about' },
  { name: 'Nhật ký', path: '/blog' },
]);

// --- Search functionality ---
const searchQuery = ref('');

/**
 * Handles the search form submission.
 * Navigates to a search results page with the query.
 */
const handleSearch = () => {
  // Proceed only if the search query isn't empty
  if (searchQuery.value.trim()) {
    // Navigate to a search results page.
    // This requires a route like { path: '/search', name: 'search' } in your router setup.
    router.push({ name: 'search', query: { q: searchQuery.value } });
    // Clear input after search for a better user experience
    searchQuery.value = '';
  }
};
</script>

<style scoped>
.navbar {
  /* The `!important` is removed as scoped styles provide enough specificity. */
  backdrop-filter: blur(10px);
  background-color: rgba(255, 255, 255, 0.9);
  transition: box-shadow 0.3s ease;
}

.nav-link {
  position: relative;
  padding: 0.5rem 0;
  margin: 0 1rem;
  transition: color 0.3s ease;
  color: #555;
  font-weight: 500;
}

/* Underline effect for nav links */
.nav-link::after {
  content: '';
  position: absolute;
  width: 0;
  height: 2px;
  bottom: -4px; /* Position the line slightly below the text */
  left: 50%;
  transform: translateX(-50%);
  background-color: var(--bs-dark);
  transition: width 0.3s ease-in-out;
}

/* Trigger underline on hover AND when the link is active */
.nav-link:hover::after,
.router-link-active::after {
  width: 100%;
}

/* Vue Router adds this class to the active link automatically. */
/* We make the active link color darker for better visual feedback. */
.router-link-active {
  /* Using !important here is acceptable to override Bootstrap's high-specificity selectors */
  color: var(--bs-dark) !important;
}

.btn-dark {
  transition: all 0.3s ease;
  background-color: #2c3e50;
  border: none;
  border-radius: 50px;
  padding: 0.5rem 1.2rem;
}

.btn-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  background-color: #34495e;
}

.form-control {
  border-radius: 20px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.form-control:focus {
  box-shadow: 0 0 0 2px rgba(44, 62, 80, 0.15);
  border-color: #2c3e50;
}
</style>
```