<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-white border-bottom">
    <div class="container-fluid">
      <a class="navbar-brand fw-bold fs-3" href="#">KFC</a>
      <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav me-auto mb-2 mb-lg-0">
          <li class="nav-item"><router-link class="nav-link" to="/">Home</router-link></li>
          <li class="nav-item"><a class="nav-link" href="#">About</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Style test</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Changelog</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Accessories</a></li>
          <li class="nav-item"><a class="nav-link" href="#">Architecture</a></li>
        </ul>
        <form class="d-flex me-2">
          <input class="form-control me-2" type="search" placeholder="Tìm kiếm" />
        </form>
        <button class="btn btn-dark" @click="goRegister">THAM GIA</button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()
function goRegister() {
  router.push('/register')
}
</script>