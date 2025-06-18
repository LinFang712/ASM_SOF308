<template>
  <div class="container py-5">
    <h1>Search Results</h1>
    <p v-if="!query">Please enter a search term.</p>
    <p v-else>Showing results for: <strong>{{ query }}</strong></p>
    <!-- Display search results here -->
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
const query = route.query.q
</script>