<template>
  <div class="bg-white min-vh-100">
    <!-- Navbar -->
    <Navbar />

    <!-- Register Frame Centered -->
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="row w-100 justify-content-center">
        <div class="col-lg-8">
          <div class="d-flex bg-white rounded shadow-sm p-4 align-items-stretch" style="min-height:340px;">
            <!-- Register Form -->
            <div class="flex-fill me-3" style="max-width: 350px;">
              <div class="mb-4 fw-bold fs-5">Create an account</div>
              <form>
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input type="email" class="form-control" placeholder="Value" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input type="text" class="form-control" placeholder="Value" />
                </div>
                <div class="mb-4">
                  <label class="form-label">Password</label>
                  <input type="password" class="form-control" placeholder="Value" />
                </div>
                <button type="submit" class="btn btn-dark w-100">Register</button>
              </form>
            </div>
            <!-- Image -->
            <div class="flex-fill ms-3 d-flex align-items-center justify-content-center">
              <img
                src="https://i.pinimg.com/736x/92/34/56/923456fd6933e7b58f0a99c8a52e0634.jpg"
                alt="register"
                class="rounded"
                style="width: 100%; max-width: 500px; height: 420px; object-fit: cover;"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref } from 'vue';
  import axios from 'axios';
  import Navbar from '../components/Navbar.vue';
</script>

<style>

</style>