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
              <form @submit.prevent="handleRegister">
                <div class="mb-3">
                  <label class="form-label">Email</label>
                  <input v-model="email" type="email" class="form-control" placeholder="Value" required />
                </div>
                <div class="mb-3">
                  <label class="form-label">Full Name</label>
                  <input v-model="name" type="text" class="form-control" placeholder="Value" required />
                </div>
                <div class="mb-4">
                  <label class="form-label">Password</label>
                  <input v-model="password" type="password" class="form-control" placeholder="Value" required />
                </div>
                <button type="submit" class="btn btn-dark w-100">Register</button>
                <div v-if="error" class="text-danger mt-2">{{ error }}</div>
                <div v-if="success" class="text-success mt-2">{{ success }}</div>
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

  const email = ref('');
  const name = ref('');
  const password = ref('');
  const error = ref('');
  const success = ref('');

  const handleRegister = async () => {
    error.value = '';
    success.value = '';
    if (!email.value || !name.value || !password.value) {
      error.value = 'Please fill all fields';
      return;
    }
    try {
      // Check if email already exists
      const res = await axios.get('http://localhost:3001/accounts', { params: { email: email.value } });
      if (res.data.length > 0) {
        error.value = 'Email already registered';
        return;
      }
      await axios.post('http://localhost:3001/accounts', {
        email: email.value,
        name: name.value,
        password: password.value
      });
      success.value = 'Registration successful!';
      email.value = '';
      name.value = '';
      password.value = '';
    } catch (e) {
      error.value = 'Registration failed. Please try again.';
    }
  };
</script>

<style>

</style>