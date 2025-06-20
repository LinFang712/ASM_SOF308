<script setup lang="ts">
import { ref, onMounted, reactive } from 'vue'
import axios from 'axios'
// The Navbar component might need separate styling to match the new theme.
import Navbar from '../components/Navbar.vue'
import ActionModal from '../components/ActionModal.vue'

// --- State Management ---
const user = ref(null)
const allUsers = ref([])
const isEditing = ref(false)
const fullName = ref('')
const email = ref('')
const gender = ref('')
const dob = ref('')
const avatarUrl = ref('')
const bannerUrl = ref('')
const isLoading = ref(true)
const error = ref<string | null>(null)
// --- Modal State & Handlers ---
const isModalOpen = ref(false)
const modalIsLoading = ref(false)
const modalError = ref(null)
const modalContent = reactive({
  mode: 'confirm',
  title: '',
  config: {},
  action: null,
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

const onModalSubmit = async (formData) => {
  if (modalContent.action) {
    modalIsLoading.value = true
    modalError.value = null
    try {
      await modalContent.action(formData)
      closeModal()
    } catch (err) {
      console.error("Modal action failed:", err)
      modalError.value = err.message || "Đã có lỗi xảy ra."
    } finally {
      modalIsLoading.value = false
    }
  }
}

const showSuccessMessage = ref(false)

// --- Lifecycle Hooks ---
onMounted(() => {
  fetchUserData()
})

// --- Data Fetching ---
function fetchUserData() {
  isLoading.value = true
  error.value = null
  const storedUser = localStorage.getItem('loggedInUser')
  if (storedUser) {
    user.value = JSON.parse(storedUser)
  }

  fetch('/db.json')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok')
      return response.json()
    })
    .then(data => {
      allUsers.value = data.users;
      if (user.value) {
        const dbUser = data.users.find(u => u.email === user.value.email);
        if (dbUser) {
          user.value = { ...user.value, ...dbUser };
        }
        if (user.value._id) {
          // IMPROVEMENT: Use the featured image URL from the post data
          user.value.posts = data.posts
            .filter(post => post.authorId === user.value._id)
            .map(post => ({
              ...post,
              imageUrl: post.featuredImage?.url || `https://picsum.photos/400/300?random=${post.id}`
            }));
        }
      }
    })
    .catch(fetchError => {
      console.error('Error loading user data:', fetchError);
      error.value = 'Rất tiếc, đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại sau.';
    })
    .finally(() => {
      isLoading.value = false
    })
}

// --- Helper Functions ---
const genderLabel = (g) => g === 'male' ? 'Nam' : g === 'female' ? 'Nữ' : 'Khác'
const formatDate = (d) => {
    if (!d) return '';
    try {
        return new Date(d).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    } catch (e) {
        return d.split('-').reverse().join('/')
    }
}


// --- Form Handling ---
const startEditing = () => {
  if (!user.value) return;
  fullName.value = user.value.fullName;
  email.value = user.value.email;
  gender.value = user.value.gender;
  dob.value = user.value.dob;
  avatarUrl.value = user.value.profile?.avatarUrl || '';
  bannerUrl.value = user.value.profile?.banner || '';
  isEditing.value = true;
}

const cancelEditing = () => {
  isEditing.value = false;
}

// --- Post Editing ---
const handleEditPost = (post) => {
  let isPreviewMode = false;
  let currentContent = post.content;
  const togglePreview = (formData) => {
    isPreviewMode = !isPreviewMode;
    if (isPreviewMode) {
      const formattedPreview = currentContent
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/\n\n/g, '<br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      modalContent.config.previewContent = formattedPreview;
    }
    modalContent.config.showPreview = isPreviewMode;
    modalContent.config.showForm = !isPreviewMode;
  };
  const insertSnippet = (snippet, formData) => {
    const textarea = formData.content;
    currentContent = textarea + snippet;
    formData.content = currentContent;
    modalContent.config.fields[1].value = currentContent;
  };
  openModal({
    mode: 'form',
    title: 'Chỉnh sửa bài viết',
    config: {
      fields: [
        { name: 'title', label: 'Tiêu đề', type: 'text', required: true, value: post.title },
        { name: 'content', label: 'Nội dung', type: 'textarea', required: true, value: post.content },
        { name: 'category', label: 'Danh mục', type: 'text', required: true, value: post.category },
        { name: 'status', label: 'Trạng thái', type: 'select', required: true, value: post.status, options: [
          { value: 'draft', text: 'Bản nháp' },
          { value: 'published', text: 'Đã xuất bản' }
        ]},
        { name: 'featuredImageUrl', label: 'URL ảnh nổi bật', type: 'text', required: false, value: post.featuredImage?.url || '' }
      ],
      snippets: [
        { label: 'Tiêu đề phụ (##)', value: '## Tiêu đề phụ\n' },
        { label: 'Danh sách (-)', value: '- Mục 1\n- Mục 2\n- Mục 3\n' },
        { label: 'In đậm (**)', value: '**Văn bản in đậm**' }
      ],
      onSnippetSelect: insertSnippet,
      confirmButtonText: 'Lưu thay đổi',
      additionalButtons: [
        { label: 'Xem trước', action: togglePreview, class: 'btn-primary' }
      ],
      showPreview: false,
      showForm: true,
      previewContent: ''
    },
    action: async (formData) => {
      try {
        const postId = post.id || post._id;
        const updatedPost = {
          ...post,
          title: formData.title,
          content: formData.content,
          category: formData.category,
          status: formData.status,
          featuredImage: {
            url: formData.featuredImageUrl || post.featuredImage?.url || '',
            altText: formData.featuredImageUrl ? post.featuredImage?.altText || 'Ảnh nổi bật' : ''
          },
          publishedAt: formData.status === 'published' && !post.publishedAt ? new Date().toISOString() : post.publishedAt
        };
        await axios.patch(`http://localhost:3001/posts/${postId}`, updatedPost);
        // Update the local post data
        const index = user.value.posts.findIndex(p => (p.id || p._id) === postId);
        if (index !== -1) {
          user.value.posts[index] = updatedPost;
        }
      } catch (err) {
        console.error('Error updating post:', err);
        throw new Error('Có lỗi xảy ra khi cập nhật bài viết. Server có thể không khả dụng.');
      }
    }
  });
};

const saveChanges = async () => {
  const updatedUser = {
    ...user.value,
    fullName: fullName.value,
    email: email.value,
    gender: gender.value,
    dob: dob.value,
    profile: {
      ...user.value.profile,
      avatarUrl: avatarUrl.value,
      banner: bannerUrl.value
    }
  }
  user.value = updatedUser
  localStorage.setItem('loggedInUser', JSON.stringify(updatedUser))
  
  // Attempt to save to server if available
  try {
    if (user.value.id || user.value._id) {
      const userId = user.value.id || user.value._id;
      await axios.patch(`http://localhost:3001/users/${userId}`, updatedUser);
      showSuccessMessage.value = true;
    } else {
      showSuccessMessage.value = true;
      error.value = 'Lưu thành công cục bộ, nhưng không thể đồng bộ với server do thiếu ID người dùng.';
    }
  } catch (err) {
    console.error('Error saving to server:', err);
    showSuccessMessage.value = true;
    error.value = 'Lưu thành công cục bộ, nhưng không thể đồng bộ với server. Server có thể không khả dụng.';
  }
  
  isEditing.value = false;
  setTimeout(() => {
    showSuccessMessage.value = false;
    error.value = null;
  }, 3000);
}
</script>

<template>
  <Navbar />
  <div class="page-background">
    <div class="container mt-4">
      <div v-if="isLoading" class="text-center text-white">
        <div class="spinner-border" role="status"><span class="visually-hidden">Loading...</span></div>
        <p>Đang tải dữ liệu...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger">{{ error }}</div>

      <div v-else-if="user" class="profile-layout">
        <main class="main-content">
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
          <h2 class="section-title">Bài viết của tôi</h2>
          <div v-if="user.posts && user.posts.length > 0" class="posts-grid">
            <div v-for="post in user.posts" :key="post.id" class="post-card">
              <router-link :to="{ path: `/posts/${post.id || post._id}` }" class="post-link">
                <img :src="post.imageUrl" alt="Post image" class="post-card-img">
                <div class="post-card-body">
                  <h5 class="post-card-title">{{ post.title }}</h5>
                  <p class="post-card-date">Đăng vào {{ formatDate(post.publishedAt || post.createdAt || post.date) }}</p>
                </div>
              </router-link>
              <button @click="handleEditPost(post)" class="btn btn-warning btn-sm edit-btn">Sửa</button>
            </div>
          </div>
          <div v-else>
            <p class="text-muted">Không có bài viết nào.</p>
          </div>
        </main>

        <aside class="sidebar">
          <div class="sidebar-widget">
            <div class="profile-header">
              <div class="banner" :style="{ backgroundImage: `url(${user.profile?.banner && user.profile.banner.trim() !== '' ? user.profile.banner : '/src/img/banner2.png'})` }"></div>
              <div class="profile-picture">
                <img :src="user.profile?.avatarUrl || '/src/img/logo.png'" alt="Profile Picture">
              </div>
              <h3 class="profile-name">{{ user.profile?.displayName || user.displayName || user.fullName || user.name || user.email.split('@')[0] }}</h3>
            </div>
            
            <div v-if="showSuccessMessage" class="alert alert-success mt-3">Đã lưu thành công!</div>

            <template v-if="!isEditing">
              <div class="profile-details">
                <p><strong>Email:</strong> {{ user.email }}</p>
                <p><strong>Giới tính:</strong> {{ genderLabel(user.gender) }}</p>
                <p><strong>Ngày sinh:</strong> {{ formatDate(user.dob) }}</p>
              </div>
              <button class="btn btn-primary w-100 mt-3" @click="startEditing">Chỉnh sửa</button>
            </template>
            
            <template v-else>
              <div class="edit-form">
                <div class="mb-2"><label class="form-label">Tên hiển thị</label><input v-model="fullName" class="form-control" /></div>
                <div class="mb-2"><label class="form-label">Email</label><input v-model="email" type="email" class="form-control" /></div>
                <div class="mb-2"><label class="form-label">Giới tính</label><select v-model="gender" class="form-select"><option value="male">Nam</option><option value="female">Nữ</option><option value="other">Khác</option></select></div>
                <div class="mb-2"><label class="form-label">Ngày sinh</label><input v-model="dob" type="date" class="form-control" /></div>
                <div class="mb-2"><label class="form-label">URL Ảnh Đại Diện</label><input v-model="avatarUrl" type="url" class="form-control" placeholder="https://ik.imagekit.io/xingeria/..." /></div>
                <div class="mb-2"><label class="form-label">URL Banner</label><input v-model="bannerUrl" type="url" class="form-control" placeholder="https://ik.imagekit.io/xingeria/..." /></div>
                <div class="d-flex gap-2 mt-3">
                  <button class="btn btn-success flex-grow-1" @click="saveChanges">Lưu</button>
                  <button class="btn btn-secondary flex-grow-1" @click="cancelEditing">Huỷ</button>
                </div>
              </div>
            </template>
          </div>
        </aside>
      </div>

      <div v-else class="text-center text-white">
        <p>Không có thông tin người dùng.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* --- Theme and Layout --- */
:root {
  --primary-bg-color: #f5a693; /* Salmon/Coral from image */
  --card-bg-color: #ffffff;
  --text-color: #333333;
  --text-light-color: #555555;
  --font-family: 'Lato', sans-serif;
}

.page-background {
  background-color: var(--primary-bg-color);
  font-family: var(--font-family);
  min-height: 100vh;
  padding-top: 3.5rem;
}

.profile-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 992px) {
  .profile-layout {
    /* 2/3 for main content, 1/3 for sidebar */
    grid-template-columns: 2fr 1fr;
  }
}

.main-content .section-title {
  color: white;
  margin-bottom: 1.5rem;
  font-weight: 700;
}

/* --- Posts Grid --- */
.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.post-card {
  background-color: var(--card-bg-color);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  position: relative;
}

.edit-btn {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 10;
}

.post-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
}

.post-link {
  text-decoration: none;
  color: inherit;
  display: block;
}

.post-link:hover {
  text-decoration: none;
  color: inherit;
}

.post-card-img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.post-card-body {
  padding: 1rem;
}

.post-card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.post-card-date {
  font-size: 0.85rem;
  color: var(--text-light-color);
}

/* --- Sidebar --- */
.sidebar-widget {
  background-color: rgba(255, 255, 255, 0.9);
  padding: 1.5rem;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.profile-header {
  text-align: center;
  margin-bottom: 1rem;
}

.profile-header .banner {
  height: 120px;
  background-size: cover;
  background-position: center;
  border-radius: 10px;
}

.profile-picture {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  margin: -50px auto 0;
  border: 4px solid var(--card-bg-color);
  background-color: var(--card-bg-color);
  position: relative;
}

.profile-picture img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-name {
  margin-top: 0.75rem;
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--text-color);
}

.profile-details p {
  margin-bottom: 0.5rem;
  color: var(--text-light-color);
}

.profile-details p strong {
  color: var(--text-color);
}

.btn, .form-control, .form-select {
  cursor: pointer;
}

.btn:hover, .form-control:hover, .form-select:hover {
  cursor: pointer;
}
</style>
