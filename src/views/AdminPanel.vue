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
          <div class="card-header text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Thêm Người Dùng Mới</h5>
            <button class="btn btn-light btn-sm" @click="toggleAddUserForm">{{ showAddUserForm ? 'Hủy' : 'Thêm' }}</button>
          </div>
          <div class="card-body" v-if="showAddUserForm">
            <div v-if="addUserError" class="alert alert-danger">{{ addUserError }}</div>
            <div v-if="addUserSuccess" class="alert alert-success">Thêm người dùng thành công!</div>
            <form @submit.prevent="addUser" v-else>
              <div class="mb-3">
                <label for="userEmail" class="form-label">Email</label>
                <input type="email" id="userEmail" class="form-control" v-model="newUser.email" required>
              </div>
              <div class="mb-3">
                <label for="userPassword" class="form-label">Mật khẩu</label>
                <input type="password" id="userPassword" class="form-control" v-model="newUser.passwordHash" required>
              </div>
              <div class="mb-3">
                <label for="userDisplayName" class="form-label">Họ Tên</label>
                <input type="text" id="userDisplayName" class="form-control" v-model="newUser.profile.displayName">
              </div>
              <div class="mb-3">
                <label for="userRole" class="form-label">Vai Trò</label>
                <select id="userRole" class="form-select" v-model="newUser.role" required>
                  <option value="member">Thành Viên</option>
                  <option value="author">Tác Giả</option>
                  <option value="admin">Quản Trị Viên</option>
                </select>
              </div>
              <button type="submit" class="btn btn-brown">Thêm Người Dùng</button>
            </form>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-header text-white d-flex justify-content-between align-items-center">
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
            <div class="card-header text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Thêm Bài Viết Mới</h5>
              <button class="btn btn-light btn-sm" @click="toggleAddPostForm">{{ showAddPostForm ? 'Hủy' : 'Thêm' }}</button>
            </div>
            <div class="card-body" v-if="showAddPostForm">
              <div v-if="addPostError" class="alert alert-danger">{{ addPostError }}</div>
              <div v-if="addPostSuccess" class="alert alert-success">Thêm bài viết thành công!</div>
              <form @submit.prevent="addPost" v-else>
                <div class="mb-3">
                  <label for="postTitle" class="form-label">Tiêu Đề</label>
                  <input type="text" id="postTitle" class="form-control" v-model="newPost.title" required>
                </div>
                <div class="mb-3">
                  <label for="postSlug" class="form-label">Slug</label>
                  <input type="text" id="postSlug" class="form-control" v-model="newPost.slug">
                </div>
                <div class="mb-3">
                  <label for="postExcerpt" class="form-label">Tóm Tắt</label>
                  <textarea id="postExcerpt" class="form-control" v-model="newPost.excerpt" rows="2"></textarea>
                </div>
                <div class="mb-3">
                  <label for="postContent" class="form-label">Nội Dung</label>
                  <textarea id="postContent" class="form-control" v-model="newPost.content" rows="5"></textarea>
                </div>
                <div class="mb-3">
                  <label for="postCategory" class="form-label">Danh Mục</label>
                  <input type="text" id="postCategory" class="form-control" v-model="newPost.category" required>
                </div>
                <div class="mb-3">
                  <label for="postTags" class="form-label">Thẻ (phân cách bằng dấu phẩy)</label>
                  <input type="text" id="postTags" class="form-control" v-model="newPostTagsInput">
                </div>
                <div class="mb-3">
                  <label for="postStatus" class="form-label">Trạng Thái</label>
                  <select id="postStatus" class="form-select" v-model="newPost.status" required>
                    <option value="draft">Bản Nháp</option>
                    <option value="published">Đã Xuất Bản</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="postFeaturedImage" class="form-label">Ảnh Nổi Bật URL</label>
                  <input type="text" id="postFeaturedImage" class="form-control" v-model="newPost.featuredImage.url">
                </div>
                <button type="submit" class="btn btn-brown">Thêm Bài Viết</button>
              </form>
            </div>
         </div>
         <div class="card shadow-sm">
          <div class="card-header text-white d-flex justify-content-between align-items-center">
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
            <div class="card-header text-white d-flex justify-content-between align-items-center">
              <h5 class="mb-0">Thêm Thẻ Mới</h5>
              <button class="btn btn-light btn-sm" @click="toggleAddTagForm">{{ showAddTagForm ? 'Hủy' : 'Thêm' }}</button>
            </div>
            <div class="card-body" v-if="showAddTagForm">
              <div v-if="addTagError" class="alert alert-danger">{{ addTagError }}</div>
              <div v-if="addTagSuccess" class="alert alert-success">Thêm thẻ thành công!</div>
              <form @submit.prevent="addTag" v-else>
                <div class="mb-3">
                  <label for="tagName" class="form-label">Tên Thẻ</label>
                  <input type="text" id="tagName" class="form-control" v-model="newTag.name" required>
                </div>
                <div class="mb-3">
                  <label for="tagSlug" class="form-label">Slug</label>
                  <input type="text" id="tagSlug" class="form-control" v-model="newTag.slug">
                </div>
                <button type="submit" class="btn btn-brown">Thêm Thẻ</button>
              </form>
            </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-header text-white d-flex justify-content-between align-items-center">
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
          <div class="card-header text-white d-flex justify-content-between align-items-center">
            <h5 class="mb-0">Thêm Danh Mục Mới</h5>
            <button class="btn btn-light btn-sm" @click="toggleAddCategoryForm">{{ showAddCategoryForm ? 'Hủy' : 'Thêm' }}</button>
          </div>
          <div class="card-body" v-if="showAddCategoryForm">
            <div v-if="addCategoryError" class="alert alert-danger">{{ addCategoryError }}</div>
            <div v-if="addCategorySuccess" class="alert alert-success">Thêm danh mục thành công!</div>
            <form @submit.prevent="addCategory" v-else>
              <div class="mb-3">
                <label for="categoryName" class="form-label">Tên Danh Mục</label>
                <input type="text" id="categoryName" class="form-control" v-model="newCategory.name" required>
              </div>
              <div class="mb-3">
                <label for="categorySlug" class="form-label">Slug</label>
                <input type="text" id="categorySlug" class="form-control" v-model="newCategory.slug">
              </div>
              <button type="submit" class="btn btn-brown">Thêm Danh Mục</button>
            </form>
          </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-header text-white d-flex justify-content-between align-items-center">
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
           <div class="card-header text-white d-flex justify-content-between align-items-center">
             <h5 class="mb-0">Thêm Giống Mèo Mới</h5>
             <button class="btn btn-light btn-sm" @click="toggleAddBreedForm">{{ showAddBreedForm ? 'Hủy' : 'Thêm' }}</button>
           </div>
           <div class="card-body" v-if="showAddBreedForm">
             <div v-if="addBreedError" class="alert alert-danger">{{ addBreedError }}</div>
             <div v-if="addBreedSuccess" class="alert alert-success">Thêm giống mèo thành công!</div>
             <form @submit.prevent="addBreed" v-else>
               <div class="mb-3">
                 <label for="breedName" class="form-label">Tên Giống Mèo</label>
                 <input type="text" id="breedName" class="form-control" v-model="newBreed.name" required>
               </div>
               <div class="mb-3">
                 <label for="breedImageUrl" class="form-label">URL Hình Ảnh</label>
                 <input type="text" id="breedImageUrl" class="form-control" v-model="newBreed.imageUrl">
               </div>
               <div class="mb-3">
                 <label for="breedDescription" class="form-label">Mô Tả</label>
                 <textarea id="breedDescription" class="form-control" v-model="newBreed.description" rows="3"></textarea>
               </div>
               <div class="mb-3">
                 <label for="breedSize" class="form-label">Kích Thước</label>
                 <input type="text" id="breedSize" class="form-control" v-model="newBreed.attributes.size">
               </div>
               <div class="mb-3">
                 <label for="breedOrigin" class="form-label">Nguồn Gốc</label>
                 <input type="text" id="breedOrigin" class="form-control" v-model="newBreed.attributes.origin">
               </div>
               <div class="mb-3">
                 <label for="breedLifespan" class="form-label">Tuổi Thọ Trung Bình</label>
                 <input type="text" id="breedLifespan" class="form-control" v-model="newBreed.attributes.avgLifespan">
               </div>
               <div class="mb-3">
                 <label for="breedTemperament" class="form-label">Tính Cách (phân cách bằng dấu phẩy)</label>
                 <input type="text" id="breedTemperament" class="form-control" v-model="newBreedTemperamentInput">
               </div>
               <button type="submit" class="btn btn-brown">Thêm Giống Mèo</button>
             </form>
           </div>
        </div>
        <div class="card shadow-sm">
          <div class="card-header text-white d-flex justify-content-between align-items-center">
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
const showAddUserForm = ref(false)
const newUser = ref({
  email: '',
  passwordHash: '',
  role: 'member',
  profile: {
    displayName: '',
    bio: '',
    banner: 'https://ik.imagekit.io/xingeria/your-banner.jpg',
    avatarUrl: '',
    socialLinks: {}
  },
  createdAt: new Date().toISOString()
})
const addUserError = ref<string | null>(null)
const addUserSuccess = ref(false)

// Posts
const posts = ref([])
const loadingPosts = ref(true)
const errorPosts = ref<string | null>(null)
const showAddPostForm = ref(false)
const newPost = ref({
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: '',
  tags: [],
  status: 'draft',
  authorId: '',
  featuredImage: {
    url: '',
    altText: ''
  },
  publishedAt: null,
  stats: {
    likes: 0,
    views: 0
  },
  comments: []
})
const newPostTagsInput = ref('')
const addPostError = ref<string | null>(null)
const addPostSuccess = ref(false)

// Tags
const tags = ref([])
const loadingTags = ref(true)
const errorTags = ref<string | null>(null)
const showAddTagForm = ref(false)
const newTag = ref({
  name: '',
  slug: ''
})
const addTagError = ref<string | null>(null)
const addTagSuccess = ref(false)

// Categories
const categories = ref([])
const loadingCategories = ref(true)
const errorCategories = ref<string | null>(null)
const showAddCategoryForm = ref(false)
const newCategory = ref({
  name: '',
  slug: ''
})
const addCategoryError = ref<string | null>(null)
const addCategorySuccess = ref(false)

// Cat Breeds
const catBreeds = ref([])
const loadingBreeds = ref(true)
const errorBreeds = ref<string | null>(null)
const showAddBreedForm = ref(false)
const newBreed = ref({
  name: '',
  imageUrl: '',
  description: '',
  attributes: {
    size: '',
    origin: '',
    avgLifespan: '',
    temperament: []
  }
})
const newBreedTemperamentInput = ref('')
const addBreedError = ref<string | null>(null)
const addBreedSuccess = ref(false)


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
    config: { data: [ 
      { label: 'ID', value: user.id || user._id }, 
      { label: 'Email', value: user.email }, 
      { label: 'Họ Tên', value: user.profile?.displayName || 'N/A' }, 
      { label: 'Vai Trò', value: user.role }, 
      { label: 'Ngày Tạo', value: formatDate(user.createdAt) },
      { label: 'Bio', value: user.profile?.bio || 'N/A' },
      { label: 'Avatar URL', value: user.profile?.avatarUrl || 'N/A' },
      { label: 'Banner URL', value: user.profile?.banner || 'N/A' }
    ] }
  });
};
const handleEditUser = (user) => {
  openModal({
    mode: 'form', title: `Chỉnh sửa thông tin ${user.email}`,
    config: { 
      fields: [ 
        { name: 'email', label: 'Email', type: 'text', required: true },
        { name: 'displayName', label: 'Họ Tên', type: 'text' },
        { name: 'bio', label: 'Bio', type: 'textarea' },
        { name: 'avatarUrl', label: 'Avatar URL', type: 'text' },
        { name: 'banner', label: 'Banner URL', type: 'text' },
        { name: 'role', label: 'Vai Trò', type: 'select', required: true,
          options: [ { value: 'member', text: 'Thành Viên' }, { value: 'author', text: 'Tác Giả' }, { value: 'admin', text: 'Quản Trị Viên' } ]
        }
      ], 
      initialData: { 
        email: user.email, 
        displayName: user.profile?.displayName || '', 
        bio: user.profile?.bio || '', 
        avatarUrl: user.profile?.avatarUrl || '', 
        banner: user.profile?.banner || '', 
        role: user.role 
      }, 
      confirmButtonText: 'Lưu thay đổi' 
    },
    action: async (formData) => { 
      const userId = user.id || user._id;
      const updatedProfile = { 
        displayName: formData.displayName, 
        bio: formData.bio, 
        avatarUrl: formData.avatarUrl, 
        banner: formData.banner 
      };
      await axios.patch(`http://localhost:3001/users/${userId}`, { 
        email: formData.email, 
        role: formData.role, 
        profile: updatedProfile 
      }); 
      await fetchUsers(); 
    }
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
        config: { 
          fields: [ 
            { name: 'title', label: 'Tiêu Đề', type: 'text', required: true }, 
            { name: 'slug', label: 'Slug', type: 'text' },
            { name: 'excerpt', label: 'Tóm Tắt', type: 'textarea' },
            { name: 'content', label: 'Nội Dung', type: 'textarea' },
            { name: 'category', label: 'Danh Mục', type: 'text', required: true },
            { name: 'tags', label: 'Thẻ (phân cách bằng dấu phẩy)', type: 'text' },
            { name: 'status', label: 'Trạng Thái', type: 'select', required: true,
              options: [ { value: 'draft', text: 'Bản Nháp' }, { value: 'published', text: 'Đã Xuất Bản' } ]
            },
            { name: 'featuredImageUrl', label: 'Ảnh Nổi Bật URL', type: 'text' }
          ], 
          initialData: { 
            title: post.title, 
            slug: post.slug || '', 
            excerpt: post.excerpt || '', 
            content: post.content || '', 
            category: post.category, 
            tags: post.tags ? post.tags.join(', ') : '', 
            status: post.status,
            featuredImageUrl: post.featuredImage?.url || ''
          }, 
          confirmButtonText: 'Lưu thay đổi' 
        },
        action: async (formData) => { 
          const postId = post.id || post._id;
          const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
          await axios.patch(`http://localhost:3001/posts/${postId}`, { 
            title: formData.title, 
            slug: formData.slug, 
            excerpt: formData.excerpt, 
            content: formData.content, 
            category: formData.category, 
            tags: tagsArray, 
            status: formData.status, 
            featuredImage: { url: formData.featuredImageUrl, altText: '' },
            publishedAt: formData.status === 'published' ? new Date().toISOString() : null
          }); 
          await fetchPosts(); 
        }
    });
};
const handleViewPost = (post) => {
  openModal({
    mode: 'view', title: 'Thông tin bài viết',
    config: { data: [ 
      { label: 'ID', value: post.id || post._id }, 
      { label: 'Tiêu đề', value: post.title }, 
      { label: 'Danh mục', value: post.category }, 
      { label: 'Trạng thái', value: post.status === 'published' ? 'Đã Xuất Bản' : 'Bản Nháp' }, 
      { label: 'Ngày tạo', value: formatDate(post.createdAt) },
      { label: 'Ngày xuất bản', value: post.publishedAt ? formatDate(post.publishedAt) : 'N/A' },
      { label: 'Slug', value: post.slug || 'N/A' },
      { label: 'Tóm tắt', value: post.excerpt || 'N/A' },
      { label: 'Thẻ', value: post.tags ? post.tags.join(', ') : 'N/A' },
      { label: 'Ảnh nổi bật', value: post.featuredImage?.url || 'N/A' }
    ] }
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
        config: { 
          fields: [
            { name: 'name', label: 'Tên thẻ mới', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text' }
          ], 
          initialData: { name: tag.name, slug: tag.slug || '' }, 
          confirmButtonText: 'Lưu' 
        },
        action: async (formData) => { 
          await axios.patch(`http://localhost:3001/tags/${tag.id || tag._id}`, { name: formData.name, slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-') }); 
          await fetchTags(); 
        }
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
        config: { 
          fields: [
            { name: 'name', label: 'Tên danh mục mới', type: 'text', required: true },
            { name: 'slug', label: 'Slug', type: 'text' }
          ], 
          initialData: { name: category.name, slug: category.slug || '' }, 
          confirmButtonText: 'Lưu' 
        },
        action: async (formData) => { 
          await axios.patch(`http://localhost:3001/categories/${category.id || category._id}`, { name: formData.name, slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-') }); 
          await fetchCategories(); 
        }
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
        config: { 
          fields: [ 
            { name: 'name', label: 'Tên mới', type: 'text', required: true }, 
            { name: 'imageUrl', label: 'URL Hình Ảnh', type: 'text' },
            { name: 'description', label: 'Mô Tả', type: 'textarea' },
            { name: 'origin', label: 'Nguồn gốc', type: 'text', required: true },
            { name: 'size', label: 'Kích thước', type: 'text' },
            { name: 'avgLifespan', label: 'Tuổi thọ trung bình', type: 'text' },
            { name: 'temperament', label: 'Tính cách (phân cách bằng dấu phẩy)', type: 'text' }
          ], 
          initialData: { 
            name: breed.name, 
            imageUrl: breed.imageUrl || '', 
            description: breed.description || '', 
            origin: breed.attributes.origin, 
            size: breed.attributes.size || '', 
            avgLifespan: breed.attributes.avgLifespan || '', 
            temperament: breed.attributes.temperament ? breed.attributes.temperament.join(', ') : '' 
          }, 
          confirmButtonText: 'Lưu' 
        },
        action: async (formData) => {
            const breedId = breed.id || breed._id;
            const temperamentArray = formData.temperament.split(',').map(temp => temp.trim()).filter(temp => temp);
            const updatedAttributes = { 
              origin: formData.origin, 
              size: formData.size, 
              avgLifespan: formData.avgLifespan, 
              temperament: temperamentArray 
            };
            await axios.patch(`http://localhost:3001/catBreeds/${breedId}`, { 
              name: formData.name, 
              imageUrl: formData.imageUrl, 
              description: formData.description, 
              attributes: updatedAttributes 
            });
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
                { label: 'Tính cách', value: breed.attributes.temperament ? breed.attributes.temperament.join(', ') : 'N/A' },
                { label: 'URL Hình Ảnh', value: breed.imageUrl || 'N/A' },
                { label: 'Mô tả', value: breed.description || 'N/A' }
            ]
        }
    });
};

const toggleAddUserForm = () => {
  showAddUserForm.value = !showAddUserForm.value
  if (showAddUserForm.value) {
    // Reset form when opening
    newUser.value = {
      email: '',
      passwordHash: '',
      role: 'member',
      profile: {
        displayName: '',
        bio: '',
        banner: 'https://ik.imagekit.io/xingeria/your-banner.jpg',
        avatarUrl: '',
        socialLinks: {}
      },
      createdAt: new Date().toISOString()
    }
    addUserError.value = null
    addUserSuccess.value = false
  }
}

const toggleAddPostForm = () => {
  showAddPostForm.value = !showAddPostForm.value
  if (showAddPostForm.value) {
    // Reset form when opening
    newPost.value = {
      title: '',
      slug: '',
      excerpt: '',
      content: '',
      category: '',
      tags: [],
      status: 'draft',
      authorId: '',
      featuredImage: {
        url: '',
        altText: ''
      },
      publishedAt: null,
      stats: {
        likes: 0,
        views: 0
      },
      comments: []
    }
    newPostTagsInput.value = ''
    addPostError.value = null
    addPostSuccess.value = false
  }
}

const toggleAddTagForm = () => {
  showAddTagForm.value = !showAddTagForm.value
  if (showAddTagForm.value) {
    // Reset form when opening
    newTag.value = {
      name: '',
      slug: ''
    }
    addTagError.value = null
    addTagSuccess.value = false
  }
}

const toggleAddCategoryForm = () => {
  showAddCategoryForm.value = !showAddCategoryForm.value
  if (showAddCategoryForm.value) {
    // Reset form when opening
    newCategory.value = {
      name: '',
      slug: ''
    }
    addCategoryError.value = null
    addCategorySuccess.value = false
  }
}

const toggleAddBreedForm = () => {
  showAddBreedForm.value = !showAddBreedForm.value
  if (showAddBreedForm.value) {
    // Reset form when opening
    newBreed.value = {
      name: '',
      imageUrl: '',
      description: '',
      attributes: {
        size: '',
        origin: '',
        avgLifespan: '',
        temperament: []
      }
    }
    newBreedTemperamentInput.value = ''
    addBreedError.value = null
    addBreedSuccess.value = false
  }
}

const addUser = async () => {
  addUserError.value = null
  addUserSuccess.value = false
  
  try {
    // Generate a simple ID if needed
    const newUserId = `user_${Date.now().toString().substring(7)}`
    const userToAdd = { ...newUser.value, _id: newUserId }
    
    // Attempt to save to server
    const response = await axios.post('http://localhost:3001/users', userToAdd)
    users.value.push(response.data)
    addUserSuccess.value = true
    setTimeout(() => {
      toggleAddUserForm()
    }, 2000)
  } catch (err) {
    console.error('Error adding user to server:', err)
    addUserError.value = 'Không thể thêm người dùng vào server. Đang lưu cục bộ...'
    // Fallback to local update if server is down
    users.value.push({ ...newUser.value, id: newUser.value._id || `temp_${Date.now()}` })
    addUserSuccess.value = true
    setTimeout(() => {
      toggleAddUserForm()
    }, 2000)
  }
}

const addPost = async () => {
  addPostError.value = null
  addPostSuccess.value = false
  
  try {
    // Generate a simple ID if needed
    const newPostId = `post_${Date.now().toString().substring(7)}`
    const tagsArray = newPostTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    const postToAdd = { 
      ...newPost.value, 
      _id: newPostId,
      tags: tagsArray,
      publishedAt: newPost.value.status === 'published' ? new Date().toISOString() : null
    }
    
    // Attempt to save to server
    const response = await axios.post('http://localhost:3001/posts', postToAdd)
    posts.value.push(response.data)
    addPostSuccess.value = true
    setTimeout(() => {
      toggleAddPostForm()
    }, 2000)
  } catch (err) {
    console.error('Error adding post to server:', err)
    addPostError.value = 'Không thể thêm bài viết vào server. Đang lưu cục bộ...'
    // Fallback to local update if server is down
    const tagsArray = newPostTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    posts.value.push({ 
      ...newPost.value, 
      id: newPost.value._id || `temp_${Date.now()}`,
      tags: tagsArray
    })
    addPostSuccess.value = true
    setTimeout(() => {
      toggleAddPostForm()
    }, 2000)
  }
}

const addTag = async () => {
  addTagError.value = null
  addTagSuccess.value = false
  
  try {
    // Generate a simple ID if needed
    const newTagId = `tag_${Date.now().toString().substring(7)}`
    const tagToAdd = { ...newTag.value, _id: newTagId }
    
    // Attempt to save to server
    const response = await axios.post('http://localhost:3001/tags', tagToAdd)
    tags.value.push(response.data)
    addTagSuccess.value = true
    setTimeout(() => {
      toggleAddTagForm()
    }, 2000)
  } catch (err) {
    console.error('Error adding tag to server:', err)
    addTagError.value = 'Không thể thêm thẻ vào server. Đang lưu cục bộ...'
    // Fallback to local update if server is down
    tags.value.push({ ...newTag.value, id: newTag.value._id || `temp_${Date.now()}` })
    addTagSuccess.value = true
    setTimeout(() => {
      toggleAddTagForm()
    }, 2000)
  }
}

const addCategory = async () => {
  addCategoryError.value = null
  addCategorySuccess.value = false
  
  try {
    // Generate a simple ID if needed
    const newCategoryId = `cat_${Date.now().toString().substring(7)}`
    const categoryToAdd = { ...newCategory.value, _id: newCategoryId }
    
    // Attempt to save to server
    const response = await axios.post('http://localhost:3001/categories', categoryToAdd)
    categories.value.push(response.data)
    addCategorySuccess.value = true
    setTimeout(() => {
      toggleAddCategoryForm()
    }, 2000)
  } catch (err) {
    console.error('Error adding category to server:', err)
    addCategoryError.value = 'Không thể thêm danh mục vào server. Đang lưu cục bộ...'
    // Fallback to local update if server is down
    categories.value.push({ ...newCategory.value, id: newCategory.value._id || `temp_${Date.now()}` })
    addCategorySuccess.value = true
    setTimeout(() => {
      toggleAddCategoryForm()
    }, 2000)
  }
}

const addBreed = async () => {
  addBreedError.value = null
  addBreedSuccess.value = false
  
  try {
    // Generate a simple ID if needed
    const newBreedId = `breed_${Date.now().toString().substring(7)}`
    const temperamentArray = newBreedTemperamentInput.value.split(',').map(temp => temp.trim()).filter(temp => temp)
    const breedToAdd = { 
      ...newBreed.value, 
      _id: newBreedId,
      attributes: {
        ...newBreed.value.attributes,
        temperament: temperamentArray
      }
    }
    
    // Attempt to save to server
    const response = await axios.post('http://localhost:3001/catBreeds', breedToAdd)
    catBreeds.value.push(response.data)
    addBreedSuccess.value = true
    setTimeout(() => {
      toggleAddBreedForm()
    }, 2000)
  } catch (err) {
    console.error('Error adding breed to server:', err)
    addBreedError.value = 'Không thể thêm giống mèo vào server. Đang lưu cục bộ...'
    // Fallback to local update if server is down
    const temperamentArray = newBreedTemperamentInput.value.split(',').map(temp => temp.trim()).filter(temp => temp)
    catBreeds.value.push({ 
      ...newBreed.value, 
      id: newBreed.value._id || `temp_${Date.now()}`,
      attributes: {
        ...newBreed.value.attributes,
        temperament: temperamentArray
      }
    })
    addBreedSuccess.value = true
    setTimeout(() => {
      toggleAddBreedForm()
    }, 2000)
  }
}

</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

.container {
  background-color: #fff8f0;
  min-height: 100vh;
  padding-top: 1.5rem;
  padding-bottom: 1.5rem;
}

.card {
  border: none;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff8f0;
  border: 1px solid #ffd6c0;
}

.card-header {
  background-color: #fff8f0;
  border-bottom: 2px solid #ffd6c0;
  padding: 1rem 1.5rem;
  color: #a67c52;
  font-family: 'Quicksand', Arial, sans-serif;
}

.card-body {
  background-color: #fff8f0;
}

.table {
  margin-bottom: 0;
  color: #a67c52;
}

.table th, .table td {
  vertical-align: middle;
  border-color: #ffd6c0;
}

.btn-group .btn {
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  font-family: 'Quicksand', Arial, sans-serif;
}

.spinner-border {
  width: 2rem;
  height: 2rem;
  color: #a67c52;
}

.badge {
  padding: 0.35em 0.65em;
  font-weight: 500;
  border-radius: 4px;
  color: white;
  font-family: 'Quicksand', Arial, sans-serif;
}

.bg-danger {
  background-color: #a71b29;
}

.bg-success {
  background-color: #8d6843;
}

.bg-secondary {
  background-color: #e0c9b3;
}

.nav-tabs .nav-link {
  color: #a67c52;
  font-family: 'Quicksand', Arial, sans-serif;
  font-weight: 600;
}

.nav-tabs .nav-link.active {
  color: #6ec1e4;
  border-color: #ffd6c0 #ffd6c0 #fff8f0;
}

.btn-outline-brown {
  background-color: transparent;
  border: 2px solid #a67c52;
  color: #a67c52;
  font-weight: 600;
  border-radius: 6px;
  transition: background 0.2s, color 0.2s;
}

.btn-outline-brown:hover,
.btn-outline-brown:focus {
  background-color: #a67c52;
  color: #fff;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 6px;
}

.btn-brown:hover,
.btn-brown:focus {
  background-color: #8d6843;
  color: #fff;
}

.btn, .nav-link, .form-control, .form-select {
  cursor: pointer;
}

.btn:hover, .nav-link:hover, .form-control:hover, .form-select:hover {
  cursor: pointer;
}
</style>
