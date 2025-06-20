<template>
  <div>
    <Navbar />
    <div class="container py-5 post-container">
      <div v-if="loading" class="text-center p-3">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Đang tải...</span>
        </div>
        <p>Đang tải bài viết...</p>
      </div>
      <div v-else-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      <div v-else-if="!post" class="text-center text-muted p-5">
        <h5>Không tìm thấy bài viết</h5>
        <p>Bài viết với ID {{ postId }} không tồn tại hoặc đã bị xóa.</p>
        <router-link to="/" class="btn btn-brown">Quay lại Trang chủ</router-link>
      </div>
      <div v-else class="post-detail">
        <h1 class="mb-3 text-primary">{{ post.title }}</h1>
        <div class="post-meta mb-4">
          <span class="badge bg-white">{{ post.category }}</span>
          <span class="text-muted ms-2">Đăng ngày {{ formatDate(post.publishedAt) }}</span>
          <span class="text-muted ms-2">Lượt xem: {{ post.stats.views }}</span>
          <span class="text-muted ms-2">Thích:
            <span @click="toggleLike" class="like-icon" :class="{ 'liked': hasLiked }" :disabled="hasLiked">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-heart-fill" viewBox="0 0 16 16">
                <path fill-rule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z"/>
              </svg>
              <span class="ms-1">{{ post.stats.likes }}</span>
            </span>
          </span>
          <span v-if="canManagePost()" class="ms-2">
            <button @click="handleEditPost" class="btn btn-warning btn-sm me-1">Sửa</button>
            <button @click="handleDeletePost" class="btn btn-danger btn-sm">Xóa</button>
          </span>
        </div>
        <img v-if="post.featuredImage && post.featuredImage.url" :src="post.featuredImage.url" class="img-fluid mb-4 post-img" :alt="post.featuredImage.altText || post.title">
        <div class="post-content" v-html="formattedContent"></div>
        <div class="mt-4 mb-3">
        </div>
        <div class="mt-4">
          <h5 class="text-primary">Bình luận ({{ post.comments.length }})</h5>
          <div v-if="post.comments.length === 0" class="text-muted">Chưa có bình luận nào. Hãy là người đầu tiên!</div>
          <div v-else class="comments-section">
            <div v-for="comment in post.comments" :key="comment._id" class="comment mb-3 p-3 border rounded d-flex">
              <div class="comment-avatar me-3">
                <img :src="getUserAvatar(comment.authorId)" alt="Avatar" class="rounded-circle" width="40" height="40">
              </div>
              <div class="comment-body flex-grow-1">
                <p class="mb-1">{{ comment.content }}</p>
                <!-- IMPROVEMENT: Aligned metadata and delete button on the same line -->
                <div class="comment-footer d-flex justify-content-between align-items-center">
                    <small class="text-muted">Đăng bởi {{ getUserDisplayName(comment.authorId) }} vào {{ formatDate(comment.createdAt) }}</small>
                    <button v-if="canDeleteComment(comment)" @click="handleDeleteComment(comment)" class="btn btn-outline-danger btn-sm delete-btn">Xóa</button>
                </div>
              </div>
            </div>
          </div>
          <div class="mt-3">
            <h6 class="text-primary">Thêm bình luận</h6>
            <div v-if="commentError" class="alert alert-danger">{{ commentError }}</div>
            <textarea v-model="commentText" class="form-control mb-2" rows="3" placeholder="Nhập bình luận của bạn..."></textarea>
            <button @click="submitComment" class="btn btn-brown" :disabled="commentLoading">
              <span v-if="commentLoading">
                <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang gửi...
              </span>
              <span v-else>Gửi bình luận</span>
            </button>
          </div>
        </div>
        <div class="mt-5">
          <router-link to="/" class="btn btn-outline-brown">Quay lại Trang chủ</router-link>
          <router-link v-if="post.category" :to="{ path: '/search', query: { q: post.category }}" class="btn btn-brown ms-2">Xem thêm về {{ post.category }}</router-link>
        </div>
      </div>
    </div>
    <!-- IMPROVEMENT: Added the action modal for confirmations -->
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

<script setup>
import { ref, onMounted, watch, reactive, inject } from 'vue'
import { useRoute } from 'vue-router'
import axios from 'axios'
import Navbar from '../components/Navbar.vue'
// IMPROVEMENT: Import the modal component
import ActionModal from '../components/ActionModal.vue'

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

const route = useRoute()
const postId = ref(route.params.id)
const loading = ref(true)
const error = ref(null)
const post = ref(null)
const hasLiked = ref(false)

const users = ref({});
const fetchPost = async () => {
  loading.value = true
  error.value = null

  try {
    const response = await axios.get(`http://localhost:3001/posts/${postId.value}`)
    if (response.data) {
      post.value = response.data
      updateViewCount()
      await fetchUsersForComments();
    } else {
      error.value = 'Không tìm thấy bài viết với ID này.'
    }
  } catch (err) {
    console.error('Error fetching post:', err)
    error.value = 'Không thể tải bài viết. Vui lòng thử lại sau.'
  } finally {
    loading.value = false
  }
}

const fetchUsersForComments = async () => {
  if (post.value && post.value.comments && post.value.comments.length > 0) {
    const authorIds = [...new Set(post.value.comments.map(comment => comment.authorId))];
    try {
      const fallbackRes = await fetch('/db.json');
      if (!fallbackRes.ok) throw new Error('Fallback data not available');
      const fallbackData = await fallbackRes.json();
      for (const authorId of authorIds) {
        if (!users.value[authorId]) {
          if (authorId === 'user_anonymous') {
            users.value[authorId] = { id: authorId, profile: { displayName: 'Anonymous User', avatarUrl: '' } };
          } else {
            const user = fallbackData.users.find(u => u._id === authorId || u.id === authorId);
            if (user) {
              users.value[authorId] = user;
            } else {
              users.value[authorId] = { id: authorId, profile: { displayName: 'Unknown User', avatarUrl: '' } };
            }
          }
        }
      }
    } catch (err) {
      console.error('Error fetching user data from fallback:', err);
      for (const authorId of authorIds) {
        if (!users.value[authorId]) {
          if (authorId === 'user_anonymous') {
            users.value[authorId] = { id: authorId, profile: { displayName: 'Anonymous User', avatarUrl: '' } };
          } else {
            users.value[authorId] = { id: authorId, profile: { displayName: 'Unknown User', avatarUrl: '' } };
          }
        }
      }
    }
  }
}

const getUserAvatar = (authorId) => {
  const user = users.value[authorId];
  if (user && user.profile && user.profile.avatarUrl) {
    return user.profile.avatarUrl;
  } else {
    return '/logo.png';
  }
}

const getUserDisplayName = (authorId) => {
  const user = users.value[authorId];
  return user && user.profile && user.profile.displayName ? user.profile.displayName : authorId;
}

const updateViewCount = async () => {
  if (post.value) {
    try {
      const updatedViews = post.value.stats.views + 1
      await axios.patch(`http://localhost:3001/posts/${postId.value}`, {
        stats: { ...post.value.stats, views: updatedViews }
      })
      post.value.stats.views = updatedViews
    } catch (err) {
      console.error('Error updating view count:', err)
    }
  }
}

const toggleLike = async () => {
  if (post.value) {
    const likeKey = `liked_post_${postId.value}`;
    if (localStorage.getItem(likeKey)) {
      alert('Bạn đã thích bài viết này rồi!');
      return;
    }
    try {
      const updatedLikes = post.value.stats.likes + 1
      await axios.patch(`http://localhost:3001/posts/${postId.value}`, {
        stats: { ...post.value.stats, likes: updatedLikes }
      })
      post.value.stats.likes = updatedLikes
      localStorage.setItem(likeKey, 'true');
      hasLiked.value = true;
    } catch (err) {
      console.error('Error updating like count:', err)
      // Fallback to local update if server fails
      post.value.stats.likes += 1;
      localStorage.setItem(likeKey, 'true');
      hasLiked.value = true;
    }
  }
}

const commentText = ref('')
const commentError = ref(null)
const commentLoading = ref(false)

const submitComment = async () => {
  if (!commentText.value.trim()) {
    commentError.value = 'Vui lòng nhập nội dung bình luận.'
    return
  }

  commentLoading.value = true
  commentError.value = null

  try {
    const newComment = {
      content: commentText.value,
      authorId: 'user_101', 
      createdAt: new Date().toISOString()
    }
    const response = await axios.patch(`http://localhost:3001/posts/${postId.value}`, {
      comments: [...post.value.comments, newComment]
    })
    if (response.data) {
      post.value.comments.push(newComment)
      commentText.value = ''
      await fetchUsersForComments();
      // Trigger notification for post author if not the same as commenter
      if (post.value.authorId !== newComment.authorId) {
        const store = inject('notificationStore', null)
        if (store) {
          store.addNotification({
            id: Date.now(),
            message: `Có người đã bình luận bài viết "${post.value.title}" của bạn.`,
            unread: true
          })
        }
      }
    } else {
      commentError.value = 'Không thể gửi bình luận. Vui lòng thử lại sau.'
    }
  } catch (err) {
    console.error('Error submitting comment:', err.message, err.response?.data)
    commentError.value = 'Không thể gửi bình luận do lỗi server. Vui lòng thử lại sau.'
    // Fallback to local update if server fails
    post.value.comments.push({
      content: commentText.value,
      authorId: 'user_101',
      createdAt: new Date().toISOString()
    })
    commentText.value = ''
    await fetchUsersForComments();
    // Trigger notification for post author if not the same as commenter (fallback)
    if (post.value.authorId !== 'user_101') {
      const store = inject('notificationStore', null)
      if (store) {
        store.addNotification({
          id: Date.now(),
          message: `Có người đã bình luận bài viết "${post.value.title}" của bạn.`,
          unread: true
        })
      }
    }
  } finally {
    commentLoading.value = false
  }
}

const canDeleteComment = (comment) => {
  const currentUserId = 'user_101'; // Hardcoded for now; ideally, this would be dynamically set based on logged-in user
  const currentUser = users.value[currentUserId];
  const isAdmin = currentUser && currentUser.role === 'admin';
  const isPostAuthor = post.value && post.value.authorId === currentUserId;
  return isAdmin || isPostAuthor;
}

// IMPROVEMENT: Replaced old deleteComment with a modal handler
const handleDeleteComment = (comment) => {
    openModal({
        mode: 'confirm',
        title: 'Xác nhận xóa bình luận',
        config: {
            message: 'Bạn có chắc muốn xóa bình luận này? Hành động này không thể hoàn tác.',
            confirmButtonText: 'Xóa',
            confirmButtonClass: 'btn-danger'
        },
        action: async () => {
            try {
                const updatedComments = post.value.comments.filter(c => c !== comment);
                await axios.patch(`http://localhost:3001/posts/${postId.value}`, {
                    comments: updatedComments
                });
                post.value.comments = updatedComments;
            } catch (err) {
                console.error('Error deleting comment:', err);
                // Throw error to be caught by the modal handler
                throw new Error('Có lỗi xảy ra khi xóa bình luận. Server có thể không khả dụng.');
            }
        }
    });
};

const canManagePost = () => {
  const currentUserId = 'user_101'; // Hardcoded for now; ideally, this would be dynamically set based on logged-in user
  const currentUser = users.value[currentUserId];
  const isAdmin = currentUser && currentUser.role === 'admin';
  const isPostAuthor = post.value && post.value.authorId === currentUserId;
  return isAdmin || isPostAuthor;
};

const handleEditPost = () => {
    let isPreviewMode = false;
    let currentContent = post.value.content;
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
                { name: 'title', label: 'Tiêu đề', type: 'text', required: true, value: post.value.title },
                { name: 'content', label: 'Nội dung', type: 'textarea', required: true, value: post.value.content },
                { name: 'category', label: 'Danh mục', type: 'text', required: true, value: post.value.category },
                { name: 'status', label: 'Trạng thái', type: 'select', required: true, value: post.value.status, options: [
                    { value: 'draft', text: 'Bản nháp' },
                    { value: 'published', text: 'Đã xuất bản' }
                ]},
                { name: 'featuredImageUrl', label: 'URL ảnh nổi bật', type: 'text', required: false, value: post.value.featuredImage?.url || '' }
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
                const updatedPost = {
                    ...post.value,
                    title: formData.title,
                    content: formData.content,
                    category: formData.category,
                    status: formData.status,
                    featuredImage: {
                        url: formData.featuredImageUrl || post.value.featuredImage?.url || '',
                        altText: formData.featuredImageUrl ? post.value.featuredImage?.altText || 'Ảnh nổi bật' : ''
                    },
                    publishedAt: formData.status === 'published' && !post.value.publishedAt ? new Date().toISOString() : post.value.publishedAt
                };
                await axios.patch(`http://localhost:3001/posts/${postId.value}`, updatedPost);
                post.value = updatedPost;
            } catch (err) {
                console.error('Error updating post:', err);
                throw new Error('Có lỗi xảy ra khi cập nhật bài viết. Server có thể không khả dụng.');
            }
        }
    });
};

const handleDeletePost = () => {
    openModal({
        mode: 'confirm',
        title: 'Xác nhận xóa bài viết',
        config: {
            message: `Bạn có chắc muốn xóa bài viết "${post.value.title}"? Hành động này không thể hoàn tác.`,
            confirmButtonText: 'Xóa',
            confirmButtonClass: 'btn-danger'
        },
        action: async () => {
            try {
                await axios.delete(`http://localhost:3001/posts/${postId.value}`);
                alert('Xóa bài viết thành công!');
                // Redirect to home page after deletion
                window.location.href = '/';
            } catch (err) {
                console.error('Error deleting post:', err);
                throw new Error('Có lỗi xảy ra khi xóa bài viết. Server có thể không khả dụng.');
            }
        }
    });
};


const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A'
  try {
    return new Date(dateStr).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  } catch (e) {
    return 'Ngày không hợp lệ'
  }
}

const formattedContent = ref('')
onMounted(() => {
  window.scrollTo(0, 0);
  fetchPost();
  const likeKey = `liked_post_${postId.value}`;
  hasLiked.value = !!localStorage.getItem(likeKey);
})

const updateFormattedContent = () => {
  if (post.value && post.value.content) {
    if (typeof post.value.content === 'string') {
      formattedContent.value = post.value.content
        .replace(/## (.*?)\n/g, '<h2>$1</h2>')
        .replace(/- (.*?)\n/g, '<li>$1</li>')
        .replace(/\n\n/g, '<br>')
        .replace(/\n/g, '<br>')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    } else if (typeof post.value.content === 'object' && post.value.content.ops) {
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
            text = `<h${op.attributes.header}>${text}</h${op.attributes.header}>`;
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
      formattedContent.value = contentHtml || '<p>Nội dung bài viết không khả dụng.</p>';
    } else {
      formattedContent.value = '<p>Nội dung bài viết không khả dụng.</p>';
    }
  }
}

watch(post, () => {
  updateFormattedContent()
})
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@400;600&display=swap');

.post-container {
  background-color: #fff8f0;
  min-height: 100vh;
  font-family: 'Quicksand', Arial, sans-serif;
}

.text-primary {
  color: #a67c52 !important;
}

.text-muted {
  color: #8d6843 !important;
}

.post-img {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 8px;
}

.post-meta {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
}

.badge {
  background-color: #e0c9b3;
  color: #a67c52;
  font-weight: 500;
  padding: 0.35em 0.65em;
  border-radius: 4px;
}

.post-content {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #8d6843;
}

.post-content h2 {
  color: #a67c52;
  margin-top: 2rem;
  margin-bottom: 1rem;
}

.post-content ul {
  padding-left: 1.5rem;
}

.comments-section {
  margin-top: 1.5rem;
}

.comment {
  background-color: #fff;
  border: 1px solid #ffd6c0;
}

.comment-avatar {
  flex-shrink: 0;
}

.comment-avatar img {
  object-fit: cover;
}

.comment-body {
  overflow-wrap: break-word;
}

.delete-btn {
  border-color: #a71b29;
  color: #a71b29;
  font-size: 0.75rem;
  padding: 0.2rem 0.5rem;
  transition: background 0.2s, color 0.2s;
  /* IMPROVEMENT: Removed margin as alignment is now handled by flexbox */
}

.delete-btn:hover {
  background-color: #a71b29;
  color: #fff;
}

.btn-brown {
  background-color: #a67c52;
  border: none;
  color: #fff;
  font-weight: 600;
  transition: background 0.2s;
  border-radius: 6px;
  min-width: 90px;
}

.btn-brown:hover,
.btn-brown:focus {
  background-color: #8d6843;
  color: #fff;
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

.spinner-border {
  width: 2rem;
  height: 2rem;
  color: #a67c52;
}

.btn {
  cursor: pointer;
}

.btn:hover {
  cursor: pointer;
}

.like-icon {
  cursor: pointer;
  color: #a67c52;
  display: inline-flex;
  align-items: center;
  vertical-align: middle;
  transition: color 0.2s;
}

.like-icon:hover {
  color: #8d6843;
}

.like-icon.liked {
  color: #ff6b6b;
  cursor: not-allowed;
}

.like-icon.liked:hover {
  color: #ff6b6b;
}
</style>
