<template>
  <div class="container py-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h5 class="mb-4 fw-bold">Đăng nhập</h5>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input type="email" v-model="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input type="password" v-model="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Đăng nhập</button>
        </form>
        <div v-if="errorMessage" class="mt-3 alert alert-danger p-2">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import axios from 'axios'

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const login = async () => {
  try {
    const res = await axios.get('http://localhost:3001/users', {
      params: {
        email: email.value,
        password: password.value
      }
    })

    if (res.data.length > 0) {
      const rawUser = res.data[0]

      const loggedInUser = {
        fullName: rawUser.name || rawUser.fullName || 'Người dùng',
        email: rawUser.email,
        gender: (rawUser.gender || 'other').toLowerCase(),
        dob: rawUser.dob || '01-01-2000',
        role: rawUser.role || 'user'
      }

      localStorage.setItem('loggedInUser', JSON.stringify(loggedInUser))
      alert('Đăng nhập thành công!')
      errorMessage.value = ''
      window.dispatchEvent(new Event('user-logged-in'))
    } else {
      errorMessage.value = 'Email hoặc mật khẩu không đúng.'
    }
  } catch (error) {
    errorMessage.value = 'Lỗi khi đăng nhập.'
    console.error(error)
  }
}
</script>
