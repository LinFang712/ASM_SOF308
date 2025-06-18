<template>
  <div class="card h-100 shadow border-0 animate__animated animate__fadeInUp">
    <div class="position-relative">
      <img
        :src="post.banner || 'https://via.placeholder.com/400x220?text=No+Image'"
        class="card-img-top"
        :alt="post.title"
      />
      <span v-if="post.about?.trim()" class="position-absolute top-0 end-0 m-2 badge bg-dark bg-opacity-75 text-white shadow-sm">
        <i class="bi bi-info-circle"></i>
      </span>
    </div>
    <div class="card-body d-flex flex-column">
      <h5 class="card-title fw-semibold text-truncate text-black" :title="post.title">
        {{ post.title }}
      </h5>
      <p class="card-text text-secondary">
        {{ post.about || 'Không có mô tả.' }}
      </p>
      <button class="btn btn-outline-dark mt-auto align-self-start px-3 py-1 rounded-pill">
        Đọc thêm
      </button>
    </div>
    <div class="card-footer bg-white border-0 small text-muted">
      <i class="bi bi-clock"></i> Vừa xong
    </div>
  </div>
</template>

<script setup>
defineProps({
  post: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  background: var(--bs-white);
  border: 1px solid rgba(0, 0, 0, 0.08);
}

.card:hover {
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  transform: translateY(-4px);
  border-color: transparent;
}

.card-img-top {
  height: 220px;
  object-fit: cover;
  filter: grayscale(0.2) brightness(0.96);
  transition: filter 0.3s, transform 0.3s;
}

.card:hover .card-img-top {
  filter: grayscale(0) brightness(1.05);
  transform: scale(1.03);
}

.card-title {
  font-size: 1.1rem;
  color: #2c3e50;
}

.card-text {
  min-height: 48px; /* Ensures consistent height */
}

.btn-outline-dark {
  border-width: 1.5px;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  padding: 0.5rem 1.2rem;
}

.btn-outline-dark:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
</style>