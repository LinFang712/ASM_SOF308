<script setup lang="ts">
import { ref, onMounted } from 'vue'

const props = defineProps({
  user: Object
})

const user = ref(null)
const isEditing = ref(false)

const fullName = ref('')
const email = ref('')
const gender = ref('')
const dob = ref('')

onMounted(() => {
  const stored = localStorage.getItem('loggedInUser')
  if (stored) {
    const u = JSON.parse(stored)
    user.value = u
    fullName.value = u.fullName
    email.value = u.email
    gender.value = u.gender
    dob.value = u.dob
  }
})

const genderLabel = (g) => g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'
const formatDate = (d) => d?.split('-').reverse().join('/') || ''

const save = () => {
  const u = { fullName: fullName.value, email: email.value, gender: gender.value, dob: dob.value }
  user.value = u
  localStorage.setItem('loggedInUser', JSON.stringify(u))
  isEditing.value = false
}
</script>

<template>
  <div v-if="user">
    <template v-if="!isEditing">
      <p><strong>Họ tên:</strong> {{ user.fullName }}</p>
      <p><strong>Email:</strong> {{ user.email }}</p>
      <p>
        <strong>Giới tính:</strong>
        <span :class="user.gender === 'male' ? 'text-primary' : user.gender === 'female' ? 'text-danger' : 'text-muted'">
          {{ genderLabel(user.gender) }}
        </span>
      </p>
      <p><strong>Ngày sinh:</strong> {{ formatDate(user.dob) }}</p>
      <button class="btn btn-sm btn-primary mt-2" @click="isEditing = true">Chỉnh sửa</button>
    </template>

    <template v-else>
      <div class="mb-2">
        <label class="form-label">Họ tên</label>
        <input v-model="fullName" class="form-control" />
      </div>
      <div class="mb-2">
        <label class="form-label">Email</label>
        <input v-model="email" type="email" class="form-control" />
      </div>
      <div class="mb-2">
        <label class="form-label">Giới tính</label>
        <select v-model="gender" class="form-select">
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
      </div>
      <div class="mb-2">
        <label class="form-label">Ngày sinh</label>
        <input v-model="dob" type="date" class="form-control" />
      </div>

      <div class="d-flex gap-2">
        <button class="btn btn-sm btn-success" @click="save">Lưu</button>
        <button class="btn btn-sm btn-secondary" @click="isEditing = false">Huỷ</button>
      </div>
    </template>
  </div>

  <div v-else>
    <p class="text-muted">Không có thông tin người dùng.</p>
  </div>
</template>