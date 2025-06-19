<template>
  <div>
    <Navbar />
    <div class="container mt-4">
      <h3 class="mb-4">Bảng Quản Trị</h3>
      <ul class="nav nav-tabs mb-4">
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'users' }" @click="activeTab = 'users'">Người Dùng</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'posts' }" @click="activeTab = 'posts'">Bài Viết</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'tags' }" @click="activeTab = 'tags'">Thẻ</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'categories' }" @click="activeTab = 'categories'">Danh Mục</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" :class="{ active: activeTab === 'catBreeds' }" @click="activeTab = 'catBreeds'">Giống Mèo</a>
        </li>
      </ul>

      <!-- Users Tab -->
      <div v-if="activeTab === 'users'">
        <div class="card shadow-sm mb-4">
          <!-- Add user form... -->
        </div>
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Quản Lý Người Dùng</h5>
            <button class="btn btn-light btn-sm" @click="fetchUsers">Làm Mới</button>
          </div>
          <div class="card-body p-0">
            <div v-if="loadingUsers" class="text-center p-3">...</div>
            <div v-else-if="errorUsers" class="alert alert-danger m-3">{{ errorUsers }}</div>
            <table v-else class="table table-hover table-bordered m-0">
              <thead>
                <tr>
                  <th>Email</th>
                  <th>Họ Tên</th>
                  <th>Vai Trò</th>
                  <th>Ngày Tạo</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="u in users" :key="u.id">
                  <td>{{ u.email }}</td>
                  <td>{{ u.profile?.displayName || 'Chưa đặt tên' }}</td>
                  <td><span :class="getRoleBadgeClass(u.role)">{{ u.role }}</span></td>
                  <td>{{ formatDate(u.createdAt) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="handleViewUser(u)" class="btn btn-info btn-sm me-1">Xem</button>
                      <button @click="handleEditPassword(u)" class="btn btn-warning btn-sm me-1">Đổi Mật Khẩu</button>
                      <button @click="handleChangeRole(u)" class="btn btn-primary btn-sm me-1">Đổi Vai Trò</button>
                      <button @click="handleDeleteUser(u)" class="btn btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Posts Tab -->
      <div v-if="activeTab === 'posts'">
         <div class="card shadow-sm mb-4">
            <!-- Add post form... -->
         </div>
         <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Quản Lý Bài Viết</h5>
            <button class="btn btn-light btn-sm" @click="fetchPosts">Làm Mới</button>
          </div>
          <div class="card-body p-0">
             <div v-if="loadingPosts" class="text-center p-3">...</div>
             <div v-else-if="errorPosts" class="alert alert-danger m-3">{{ errorPosts }}</div>
             <table v-else class="table table-hover table-bordered m-0">
              <thead>
                <tr>
                  <th>Tiêu Đề</th>
                  <th>Danh Mục</th>
                  <th>Trạng Thái</th>
                  <th>Ngày Xuất Bản</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="p in posts" :key="p.id">
                  <td>{{ p.title }}</td>
                  <td>{{ p.category }}</td>
                  <td>{{ p.status === 'published' ? 'Đã Xuất Bản' : 'Bản Nháp' }}</td>
                  <td>{{ formatDate(p.publishedAt || p.createdAt) }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="handleViewPost(p)" class="btn btn-info btn-sm me-1">Xem</button>
                      <button @click="handleEditPost(p)" class="btn btn-warning btn-sm me-1">Sửa</button>
                      <button @click="handleDeletePost(p)" class="btn btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Tags Tab -->
      <div v-if="activeTab === 'tags'">
        <div class="card shadow-sm mb-4">
            <!-- Add tag form... -->
        </div>
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Quản Lý Thẻ</h5>
            <button class="btn btn-light btn-sm" @click="fetchTags">Làm Mới</button>
          </div>
          <div class="card-body p-0">
            <div v-if="loadingTags" class="text-center p-3">...</div>
            <div v-else-if="errorTags" class="alert alert-danger m-3">{{ errorTags }}</div>
            <table v-else class="table table-hover table-bordered m-0">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Slug</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="t in tags" :key="t.id">
                  <td>{{ t.name }}</td>
                  <td>{{ t.slug }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="handleEditTag(t)" class="btn btn-warning btn-sm me-1">Sửa</button>
                      <button @click="handleDeleteTag(t)" class="btn btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Categories Tab -->
      <div v-if="activeTab === 'categories'">
        <div class="card shadow-sm mb-4">
          <!-- Add category form... -->
        </div>
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Quản Lý Danh Mục</h5>
            <button class="btn btn-light btn-sm" @click="fetchCategories">Làm Mới</button>
          </div>
          <div class="card-body p-0">
            <div v-if="loadingCategories" class="text-center p-3">...</div>
            <div v-else-if="errorCategories" class="alert alert-danger m-3">{{ errorCategories }}</div>
            <table v-else class="table table-hover table-bordered m-0">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Slug</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="c in categories" :key="c.id">
                  <td>{{ c.name }}</td>
                  <td>{{ c.slug }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="handleEditCategory(c)" class="btn btn-warning btn-sm me-1">Sửa</button>
                      <button @click="handleDeleteCategory(c)" class="btn btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- Cat Breeds Tab -->
      <div v-if="activeTab === 'catBreeds'">
        <div class="card shadow-sm mb-4">
           <!-- Add breed form... -->
        </div>
        <div class="card shadow-sm">
          <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Quản Lý Giống Mèo</h5>
            <button class="btn btn-light btn-sm" @click="fetchBreeds">Làm Mới</button>
          </div>
          <div class="card-body p-0">
            <div v-if="loadingBreeds" class="text-center p-3">...</div>
            <div v-else-if="errorBreeds" class="alert alert-danger m-3">{{ errorBreeds }}</div>
            <table v-else class="table table-hover table-bordered m-0">
              <thead>
                <tr>
                  <th>Tên</th>
                  <th>Nguồn Gốc</th>
                  <th>Kích Thước</th>
                  <th>Hành Động</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="b in catBreeds" :key="b.id">
                  <td>{{ b.name }}</td>
                  <td>{{ b.attributes.origin }}</td>
                  <td>{{ b.attributes.size }}</td>
                  <td>
                    <div class="btn-group" role="group">
                      <button @click="handleViewBreed(b)" class="btn btn-info btn-sm me-1">Xem</button>
                      <button @click="handleEditBreed(b)" class="btn btn-warning btn-sm me-1">Sửa</button>
                      <button @click="handleDeleteBreed(b)" class="btn btn-danger btn-sm">Xóa</button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <!-- The single, reusable modal -->
    <ActionModal
      :isOpen="isModalOpen"
      :mode="modalContent.mode"
      :title="modalContent.title"
      :config="modalContent.config"
      :isLoading="modalIsLoading"
      :error="modalError"
      @close="closeModal"
      @submit="onModalSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
import ActionModal from '../components/ActionModal.vue'

// --- Modal State & Handlers ---
const isModalOpen = ref(false)
const modalIsLoading = ref(false)
const modalError = ref<string | null>(null)
const modalContent = reactive({
  mode: 'view',
  title: '',
  config: {},
  action: null as Function | null,
})

const openModal = (config) => {
  modalContent.mode = config.mode
  modalContent.title = config.title
  modalContent.config = config.config
  modalContent.action = config.action
  modalError.value = null
  isModalOpen.value = true
}

const closeModal = () => {
  isModalOpen.value = false
  modalIsLoading.value = false
}

const onModalSubmit = async (formData?: any) => {
  if (modalContent.action) {
    modalIsLoading.value = true
    modalError.value = null
    try {
      await modalContent.action(formData)
      closeModal()
    } catch (err) {
      console.error("Modal action failed:", err)
      modalError.value = err.response?.data?.message || err.message || "Đã có lỗi xảy ra."
    } finally {
      modalIsLoading.value = false
    }
  }
}

// --- Data and other logic ---
const activeTab = ref('users')
// Users
const users = ref([])
const loadingUsers = ref(true)
const errorUsers = ref<string | null>(null)
// Posts
const posts = ref([])
const loadingPosts = ref(true)
const errorPosts = ref<string | null>(null)
// Tags
const tags = ref([])
const loadingTags = ref(true)
const errorTags = ref<string | null>(null)
// Categories
const categories = ref([])
const loadingCategories = ref(true)
const errorCategories = ref<string | null>(null)
// Cat Breeds
const catBreeds = ref([])
const loadingBreeds = ref(true)
const errorBreeds = ref<string | null>(null)


// --- Lifecycle & Fetching ---
onMounted(() => {
  fetchUsers()
  fetchPosts()
  fetchTags()
  fetchCategories()
  fetchBreeds()
})

const formatDate = (dateStr: string) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric'
    })
  } catch (e) { return 'Ngày không hợp lệ' }
}

const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'badge bg-danger'
    case 'author': return 'badge bg-success'
    default: return 'badge bg-secondary'
  }
}

// Generic fetch function to reduce repetition
const fetchData = async (endpoint, dataRef, loadingRef, errorRef) => {
    loadingRef.value = true;
    errorRef.value = null;
    try {
        const res = await axios.get(`http://localhost:3001/${endpoint}`);
        dataRef.value = res.data;
    } catch (err) {
        console.error(`Error fetching ${endpoint}:`, err);
        errorRef.value = `Không thể tải dữ liệu từ ${endpoint}. Vui lòng thử lại.`;
    } finally {
        loadingRef.value = false;
    }
};

const fetchUsers = () => fetchData('users', users, loadingUsers, errorUsers);
const fetchPosts = () => fetchData('posts', posts, loadingPosts, errorPosts);
const fetchTags = () => fetchData('tags', tags, loadingTags, errorTags);
const fetchCategories = () => fetchData('categories', categories, loadingCategories, errorCategories);
const fetchBreeds = () => fetchData('catBreeds', catBreeds, loadingBreeds, errorBreeds);

// --- MODAL HANDLER IMPLEMENTATIONS ---

// -- User Handlers --
const handleDeleteUser = (user) => {
  openModal({
    mode: 'confirm', title: 'Xác nhận Xóa',
    config: { message: `Bạn có chắc muốn xóa người dùng "${user.email}"?`, confirmButtonText: 'Xóa', confirmButtonClass: 'btn-danger' },
    action: async () => { await axios.delete(`http://localhost:3001/users/${user.id || user._id}`); await fetchUsers(); }
  })
}
const handleEditPassword = (user) => {
  openModal({
    mode: 'form', title: `Đổi mật khẩu cho ${user.email}`,
    config: { fields: [{ name: 'password', label: 'Mật khẩu mới', type: 'password', required: true }], initialData: { password: '' }, confirmButtonText: 'Lưu' },
    action: async (formData) => {
      if (!formData.password) throw new Error("Mật khẩu không được để trống.");
      await axios.patch(`http://localhost:3001/users/${user.id || user._id}`, { passwordHash: formData.password });
    }
  })
}
const handleChangeRole = (user) => {
  openModal({
    mode: 'form', title: `Đổi vai trò cho ${user.email}`,
    config: {
      fields: [{ name: 'role', label: 'Vai trò mới', type: 'select', required: true,
        options: [ { value: 'member', text: 'Thành Viên' }, { value: 'author', text: 'Tác Giả' }, { value: 'admin', text: 'Quản Trị Viên' } ]
      }], initialData: { role: user.role }, confirmButtonText: 'Cập nhật',
    },
    action: async (formData) => { await axios.patch(`http://localhost:3001/users/${user.id || user._id}`, { role: formData.role }); await fetchUsers(); }
  });
};
const handleViewUser = (user) => {
  openModal({
    mode: 'view', title: 'Thông tin người dùng',
    config: { data: [ { label: 'ID', value: user.id || user._id }, { label: 'Email', value: user.email }, { label: 'Họ Tên', value: user.profile?.displayName || 'N/A' }, { label: 'Vai Trò', value: user.role }, { label: 'Ngày Tạo', value: formatDate(user.createdAt) } ] }
  });
};

// -- Post Handlers --
const handleDeletePost = (post) => {
    openModal({
        mode: 'confirm', title: 'Xác nhận xóa bài viết',
        config: { message: `Bạn có chắc chắn muốn xóa bài viết "${post.title}"?`, confirmButtonText: 'Xóa', confirmButtonClass: 'btn-danger' },
        action: async () => { await axios.delete(`http://localhost:3001/posts/${post.id || post._id}`); await fetchPosts(); }
    });
};
const handleEditPost = (post) => {
    openModal({
        mode: 'form', title: 'Chỉnh sửa bài viết',
        config: { fields: [ { name: 'title', label: 'Tiêu đề mới', type: 'text', required: true }, { name: 'category', label: 'Danh mục', type: 'text', required: true } ], initialData: { title: post.title, category: post.category }, confirmButtonText: 'Lưu thay đổi' },
        action: async (formData) => { await axios.patch(`http://localhost:3001/posts/${post.id || post._id}`, { title: formData.title, category: formData.category }); await fetchPosts(); }
    });
};
const handleViewPost = (post) => {
  openModal({
    mode: 'view', title: 'Thông tin bài viết',
    config: { data: [ { label: 'ID', value: post.id || post._id }, { label: 'Tiêu đề', value: post.title }, { label: 'Danh mục', value: post.category }, { label: 'Trạng thái', value: post.status }, { label: 'Ngày tạo', value: formatDate(post.createdAt) } ] }
  });
};

// -- Tag Handlers --
const handleDeleteTag = (tag) => {
    openModal({
        mode: 'confirm', title: 'Xác nhận xóa thẻ',
        config: { message: `Bạn có chắc muốn xóa thẻ "${tag.name}"?`, confirmButtonText: 'Xóa', confirmButtonClass: 'btn-danger' },
        action: async () => { await axios.delete(`http://localhost:3001/tags/${tag.id || tag._id}`); await fetchTags(); }
    });
};
const handleEditTag = (tag) => {
    openModal({
        mode: 'form', title: 'Chỉnh sửa thẻ',
        config: { fields: [{ name: 'name', label: 'Tên thẻ mới', type: 'text', required: true }], initialData: { name: tag.name }, confirmButtonText: 'Lưu' },
        action: async (formData) => { await axios.patch(`http://localhost:3001/tags/${tag.id || tag._id}`, { name: formData.name, slug: formData.name.toLowerCase().replace(/\s+/g, '-') }); await fetchTags(); }
    });
};

// -- Category Handlers --
const handleDeleteCategory = (category) => {
    openModal({
        mode: 'confirm', title: 'Xác nhận xóa danh mục',
        config: { message: `Bạn có chắc muốn xóa danh mục "${category.name}"?`, confirmButtonText: 'Xóa', confirmButtonClass: 'btn-danger' },
        action: async () => { await axios.delete(`http://localhost:3001/categories/${category.id || category._id}`); await fetchCategories(); }
    });
};
const handleEditCategory = (category) => {
    openModal({
        mode: 'form', title: 'Chỉnh sửa danh mục',
        config: { fields: [{ name: 'name', label: 'Tên danh mục mới', type: 'text', required: true }], initialData: { name: category.name }, confirmButtonText: 'Lưu' },
        action: async (formData) => { await axios.patch(`http://localhost:3001/categories/${category.id || category._id}`, { name: formData.name, slug: formData.name.toLowerCase().replace(/\s+/g, '-') }); await fetchCategories(); }
    });
};

// -- Cat Breed Handlers --
const handleDeleteBreed = (breed) => {
    openModal({
        mode: 'confirm', title: 'Xác nhận xóa giống mèo',
        config: { message: `Bạn có chắc muốn xóa giống mèo "${breed.name}"?`, confirmButtonText: 'Xóa', confirmButtonClass: 'btn-danger' },
        action: async () => { await axios.delete(`http://localhost:3001/catBreeds/${breed.id || breed._id}`); await fetchBreeds(); }
    });
};
const handleEditBreed = (breed) => {
    openModal({
        mode: 'form', title: 'Chỉnh sửa giống mèo',
        config: { fields: [ { name: 'name', label: 'Tên mới', type: 'text', required: true }, { name: 'origin', label: 'Nguồn gốc', type: 'text', required: true } ], initialData: { name: breed.name, origin: breed.attributes.origin }, confirmButtonText: 'Lưu' },
        action: async (formData) => {
            const breedId = breed.id || breed._id;
            const updatedAttributes = { ...breed.attributes, origin: formData.origin };
            await axios.patch(`http://localhost:3001/catBreeds/${breedId}`, { name: formData.name, attributes: updatedAttributes });
            await fetchBreeds();
        }
    });
};
const handleViewBreed = (breed) => {
    openModal({
        mode: 'view', title: 'Thông tin giống mèo',
        config: {
            data: [
                { label: 'ID', value: breed.id || breed._id },
                { label: 'Tên', value: breed.name },
                { label: 'Nguồn gốc', value: breed.attributes.origin },
                { label: 'Kích thước', value: breed.attributes.size },
                { label: 'Tuổi thọ', value: breed.attributes.avgLifespan },
                { label: 'Tính cách', value: breed.attributes.temperament.join(', ') },
            ]
        }
    });
};

/* NOTE: Add/toggle form functions are omitted for brevity but should be kept in your actual file */

</script>

<style scoped>
/* Your existing styles are perfect and require no changes. */
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');
/* ... */
</style>
