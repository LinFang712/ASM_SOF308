<template>
  <div class="container">
    <h3>Quản lý người dùng</h3>
    <table class="table table-bordered">
      <thead>
        <tr>
          <th>Email</th>
          <th>Họ tên</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="u in users" :key="u.id">
          <td>{{ u.email }}</td>
          <td>{{ u.name || u.fullName }}</td>
          <td>{{ u.role }}</td>
          <td>
            <button @click="editUser(u)" class="btn btn-warning btn-sm">Đổi mật khẩu</button>
            <button @click="deleteUser(u.id)" class="btn btn-danger btn-sm">Xóa</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import axios from 'axios'

const users = ref([])

onMounted(async () => {
  const res = await axios.get('http://localhost:3001/users') // Fix port
  users.value = res.data
})

const deleteUser = async (id: string) => {
  if (confirm('Bạn có chắc muốn xóa người dùng này?')) {
    await axios.delete(`http://localhost:3001/users/${id}`) // Fix port
    users.value = users.value.filter(u => u.id !== id)
  }
}

const editUser = async (user: any) => {
  const newPass = prompt(`Nhập mật khẩu mới cho ${user.email}`)
  if (newPass) {
    await axios.patch(`http://localhost:3001/users/${user.id}`, { password: newPass }) // Fix port
    alert('Đổi mật khẩu thành công!')
  }
}
</script>
