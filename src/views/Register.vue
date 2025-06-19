<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="row">
          <!-- Form Section -->
          <div class="col-md-6 border-end">
            <h5 class="mb-4 fw-bold">Create an account</h5>
            <form @submit.prevent="register">
              <div class="mb-3">
                <label class="form-label">Email</label>
                <input type="email" v-model="email" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Full Name</label>
                <input type="text" v-model="fullName" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label">Password</label>
                <input type="password" v-model="password" class="form-control" required />
              </div>
              <div class="mb-3">
                <label class="form-label d-block">Gender</label>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="gender" value="Male" id="genderMale" />
                  <label class="form-check-label" for="genderMale">Male</label>
                </div>
                <div class="form-check form-check-inline">
                  <input class="form-check-input" type="radio" v-model="gender" value="Female" id="genderFemale" />
                  <label class="form-check-label" for="genderFemale">Female</label>
                </div>
              </div>
              <div class="mb-4">
                <label class="form-label">Date of Birth</label>
                <input type="date" v-model="dob" class="form-control" required />
              </div>
              <button type="submit" class="btn btn-dark w-100">Register</button>
            </form>
          </div>
          <!-- Image Section -->
          <div class="col-md-6 d-flex align-items-center justify-content-center">
            <img
              src="../img/register.png"
              class="img-fluid rounded"
              style="max-height: 400px; object-fit: cover;"
              alt="Register Image"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const fullName = ref('')
const password = ref('')
const gender = ref('')
const dob = ref('')

const register = async () => {
  try {
    const check = await axios.get(`http://localhost:3001/users?email=${email.value}`)
    if (check.data.length > 0) {
      alert('Email đã tồn tại. Vui lòng nhập email khác!')
      return
    }

    await axios.post('http://localhost:3001/users', {
      email: email.value,
      fullName: fullName.value,
      password: password.value,
      gender: gender.value,
      dob: dob.value,
      role: 'user'
    })

    alert('Đăng ký thành công!')
    email.value = ''
    fullName.value = ''
    password.value = ''
    gender.value = ''
    dob.value = ''
  } catch (error) {
    alert('Lỗi đăng ký!')
    console.error(error)
  }
}
</script>
