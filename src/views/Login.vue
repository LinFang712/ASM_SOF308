<template>
  <div class="bg-white min-vh-100">
    <Navbar />
    <div class="container d-flex justify-content-center align-items-center" style="min-height: 80vh;">
      <div class="row w-100 justify-content-center">
        <div class="col-lg-6">
          <div class="bg-white rounded shadow-sm p-4">
            <div class="mb-4 fw-bold fs-5">Sign in to your account</div>
            <form @submit.prevent="handleLogin">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input v-model="email" type="email" class="form-control" placeholder="Enter email" required />
              </div>
              <div class="mb-4">
                <label class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" placeholder="Enter password" required />
              </div>
              <button type="submit" class="btn btn-dark w-100">Login</button>
              <div v-if="error" class="text-danger mt-2">{{ error }}</div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';

const email = ref('');
const password = ref('');
const error = ref('');

const handleLogin = async () => {
  error.value = '';
  try {
    const res = await axios.get('http://localhost:3001/accounts', {
      params: { email: email.value, password: password.value }
    });
    if (res.data.length > 0) {
      // Login success, you can store user info or redirect here
      alert('Login successful!');
    } else {
      error.value = 'Invalid email or password';
    }
  } catch (e) {
    error.value = 'Login failed. Please try again.';
  }
};
</script>

<style>

</style>