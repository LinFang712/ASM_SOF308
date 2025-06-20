<template>
  <div class="container">
    <Navbar />
    <h1 class="mt-5">Tạo Bài Viết Mới</h1>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="title" class="form-label">Tiêu đề</label>
        <input type="text" class="form-control" id="title" v-model="post.title" required>
      </div>
      <div class="mb-3">
        <label for="excerpt" class="form-label">Tóm tắt</label>
        <textarea class="form-control" id="excerpt" v-model="post.excerpt" rows="2" required></textarea>
      </div>
      <div class="mb-3">
        <label for="content" class="form-label">Nội dung</label>
        <QuillEditor
          v-model:content="post.content"
          :options="editorOptions"
          style="height: 400px; margin-bottom: 40px;"
          required
        />
      </div>
      <div class="mb-3">
        <label for="category" class="form-label">Danh mục</label>
        <select class="form-control" id="category" v-model="post.category" required>
          <option v-for="cat in categories" :key="cat._id" :value="cat.name">{{ cat.name }}</option>
        </select>
      </div>
      <div class="mb-3">
        <label for="imageUrl" class="form-label">URL Hình ảnh nổi bật</label>
        <input type="text" class="form-control" id="imageUrl" v-model="post.featuredImage.url" placeholder="Nhập URL hình ảnh" required>
      </div>
      <div class="mb-3">
        <label for="imageAlt" class="form-label">Mô tả hình ảnh</label>
        <input type="text" class="form-control" id="imageAlt" v-model="post.featuredImage.altText" placeholder="Nhập mô tả hình ảnh" required>
      </div>
      <div class="mb-3">
        <h3 class="mb-3" style="color: #a67c52; font-weight: 700;">Xem trước bài viết</h3>
        <div class="post-detail-preview" style="background-color: #fff8f0; padding: 2rem; border-radius: 8px; border: 1px solid #ffd6c0;">
          <h1 class="mb-3" style="color: #a67c52; font-size: 2.5rem; font-weight: 700;">{{ post.title || 'Tiêu đề bài viết' }}</h1>
          <div class="post-meta mb-4 d-flex align-items-center flex-wrap">
            <span class="badge bg-white" :style="{ backgroundColor: '#e0c9b3', color: categoryColor }">{{ post.category || 'Danh mục' }}</span>
            <span class="text-muted ms-2">Đăng ngày {{ formatDate(new Date().toISOString()) }}</span>
            <span class="text-muted ms-2">Lượt xem: 0</span>
            <span class="text-muted ms-2">Thích: 
              <span class="like-icon">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                  <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
                </svg>
                <span class="ms-1">0</span>
              </span>
            </span>
          </div>
          <img v-if="post.featuredImage.url" :src="post.featuredImage.url" class="img-fluid mb-4 post-img" :alt="post.featuredImage.altText || post.title" style="width: 100%; max-height: 400px; object-fit: cover; border-radius: 8px;">
          <div class="post-content" style="font-size: 1.1rem; line-height: 1.8; color: #8d6843;" v-html="formattedContent"></div>
        </div>
      </div>
      <div class="mb-3 form-check">
        <input type="checkbox" class="form-check-input" id="publish" v-model="publishNow">
        <label class="form-check-label" for="publish">Xuất bản ngay</label>
      </div>
      <button type="submit" class="btn btn-brown">Lưu Bài Viết</button>
      <button type="button" class="btn btn-outline-brown ms-2" @click="$router.push('/')">Hủy</button>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import Navbar from '../components/Navbar.vue';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css';

// Quill editor toolbar configuration
const editorOptions = {
  theme: 'snow',
  modules: {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['link', 'image'],
      ['clean']
    ]
  }
};

const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001';
const publishNow = ref(false);
const categories = ref([]);
const post = ref({
  title: '',
  excerpt: '',
  content: '',
  category: '',
  status: 'draft',
  featuredImage: {
    url: '',
    altText: ''
  },
  stats: {
    views: 0,
    likes: 0
  },
  comments: [],
  tags: [],
  authorId: '',
  publishedAt: null
});

const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/categories`);
    categories.value = response.data;
  } catch (error) {
    console.error('Lỗi khi tải danh mục:', error);
    alert('Không thể tải danh mục. Vui lòng thử lại sau.');
  }
};

const loadUser = () => {
  const stored = localStorage.getItem('loggedInUser');
  if (stored) {
    const user = JSON.parse(stored);
    post.value.authorId = user._id;
  }
};

const handleSubmit = async () => {
  if (publishNow.value) {
    post.value.status = 'published';
    post.value.publishedAt = new Date().toISOString();
  } else {
    post.value.status = 'draft';
    post.value.publishedAt = null;
  }

  try {
    await axios.post(`${API_BASE_URL}/posts`, post.value);
    alert('Bài viết đã được lưu thành công!');
    router.push('/profile');
  } catch (error) {
    console.error('Lỗi khi lưu bài viết:', error);
    alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
  }
};

const getCategoryColor = (category) => {
  const categoryColors = {
    'Hành vi mèo': '#e57373',
    'Sức khỏe mèo': '#ba68c8',
    'Chải lông & Chăm sóc': '#64b5f6',
    'Giống mèo nổi bật': '#81c784',
    'Vui nhộn & Dễ thương': '#ffd54f',
  };
  return categoryColors[category] || '#a67c52';
};

const categoryColor = computed(() => getCategoryColor(post.value.category));

const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (e) {
    return 'Ngày không hợp lệ';
  }
};

const formattedContent = computed(() => {
  if (typeof post.value.content === 'string') {
    return post.value.content
      .replace(/## (.*?)\n/g, '<h2 style="color: #a67c52; margin-top: 2rem; margin-bottom: 1rem;">$1</h2>')
      .replace(/- (.*?)\n/g, '<li>$1</li>')
      .replace(/\n\n/g, '<br>')
      .replace(/\n/g, '<br>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
  } else if (post.value.content && typeof post.value.content === 'object' && post.value.content.ops) {
    // Handle Quill Delta format
    let contentHtml = '';
    let currentList = null;
    post.value.content.ops.forEach(op => {
      let text = (op.insert || '').replace(/\n/g, '<br>');
      if (op.attributes) {
        if (op.attributes.bold) {
          text = `<strong>${text}</strong>`;
        }
        if (op.attributes.italic) {
          text = `<em>${text}</em>`;
        }
        if (op.attributes.underline) {
          text = `<u>${text}</u>`;
        }
        if (op.attributes.strike) {
          text = `<del>${text}</del>`;
        }
        if (op.attributes.header) {
          text = `<h${op.attributes.header} style="color: #a67c52; margin-top: 2rem; margin-bottom: 1rem;">${text}</h${op.attributes.header}>`;
        }
        if (op.attributes.list === 'ordered') {
          if (currentList !== 'ol') {
            contentHtml += '<ol>';
            currentList = 'ol';
          }
          text = `<li>${text}</li>`;
        } else if (op.attributes.list === 'bullet') {
          if (currentList !== 'ul') {
            contentHtml += '<ul>';
            currentList = 'ul';
          }
          text = `<li>${text}</li>`;
        } else if (currentList) {
          contentHtml += currentList === 'ol' ? '</ol>' : '</ul>';
          currentList = null;
        }
        if (op.attributes.link) {
          text = `<a href="${op.attributes.link}" target="_blank">${text}</a>`;
        }
      } else if (currentList) {
        contentHtml += currentList === 'ol' ? '</ol>' : '</ul>';
        currentList = null;
      }
      contentHtml += text;
    });
    if (currentList) {
      contentHtml += currentList === 'ol' ? '</ol>' : '</ul>';
    }
    return contentHtml || '<p style="color: #8d6843;">Nội dung bài viết sẽ hiển thị ở đây.</p>';
  }
  return '<p style="color: #8d6843;">Nội dung bài viết sẽ hiển thị ở đây.</p>';
});

onMounted(() => {
  fetchCategories();
  loadUser();
});
</script>

<style scoped>
.form-control, .form-select {
  border-radius: 0.5rem;
  border: 1.5px solid #e0c9b3;
  background: #fff;
  color: #a67c52;
}

.form-control:focus, .form-select:focus {
  border-color: #a67c52;
  box-shadow: 0 0 0 0.1rem #ffd6c0;
}

.form-label {
  color: #a67c52;
  font-weight: 600;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 6px;
  min-width: 120px;
}

.btn-brown:hover, .btn-brown:focus {
  background-color: #8d6843;
  color: #fff;
}

.btn-outline-brown {
  background-color: transparent;
  border: 2px solid #a67c52;
  color: #a67c52;
  font-weight: 600;
  border-radius: 6px;
  min-width: 120px;
  transition: background 0.2s, color 0.2s;
}

.btn-outline-brown:hover, .btn-outline-brown:focus {
  background-color: #a67c52;
  color: #fff;
}

h1 {
  color: #a67c52;
  font-weight: 700;
}
</style>
