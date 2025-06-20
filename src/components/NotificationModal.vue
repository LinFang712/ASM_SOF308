<template>
  <!-- IMPROVEMENT: Switched to a transition-based modal for smoother animations -->
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal-backdrop" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h5 class="modal-title">
            <i class="bi bi-bell-fill me-2"></i>Notifications
          </h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div v-if="!notifications || notifications.length === 0" class="empty-state">
            <i class="bi bi-check-circle display-4"></i>
            <h6 class="mt-3">You're all caught up!</h6>
            <p>You have no new notifications.</p>
          </div>
          <div v-else class="list-group">
            <!-- IMPROVEMENT: Restyled notification items for better clarity -->
            <div
              v-for="notification in notifications"
              :key="notification.id"
              class="list-group-item notification-item"
              @click="handleNotificationClick(notification)"
            >
              <div class="d-flex align-items-center">
                <div class="notification-icon">
                  <i class="bi bi-chat-left-text-fill"></i>
                </div>
                <div class="flex-grow-1 ms-3">
                  <p class="mb-0 notification-message">{{ notification.message }}</p>
                  <small class="text-muted">{{ formatTimeAgo(notification.createdAt) }}</small>
                </div>
                <span v-if="notification.unread" class="unread-dot" title="Unread"></span>
              </div>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-outline-brown"
            @click="emit('mark-all-read')"
            :disabled="!hasUnread"
          >
            Mark All As Read
          </button>
          <button type="button" class="btn btn-brown" @click="closeModal">Close</button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed } from 'vue';
import 'bootstrap-icons/font/bootstrap-icons.css';

// --- Component Interface ---
const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  notifications: {
    type: Array,
    default: () => [],
  },
});

// IMPROVEMENT: Using defineEmits for clean, standard event handling
const emit = defineEmits(['close', 'notification-click', 'mark-all-read']);

// --- Computed Properties ---
const hasUnread = computed(() => {
  return props.notifications.some(n => n.unread);
});

// --- Methods ---
const closeModal = () => {
  emit('close');
};

const handleNotificationClick = (notification) => {
  // Emit the event for the parent component to handle
  emit('notification-click', notification);
  // Optionally close the modal after clicking a notification
  closeModal();
};

// IMPROVEMENT: A better UX for timestamps
const formatTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const seconds = Math.round((now - date) / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);

  if (seconds < 60) return `${seconds} seconds ago`;
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hours ago`;
  if (days === 1) return `yesterday`;
  return `${days} days ago`;
};
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;700&display=swap');

.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background-color: #fff8f0;
  border: 1px solid #e0c9b3;
  border-radius: 12px;
  width: 90%;
  max-width: 550px;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
  font-family: 'Quicksand', sans-serif;
}

.modal-header {
  border-bottom: 1px solid #e0c9b3;
  color: #a67c52;
  padding: 1rem 1.5rem;
}

.modal-title {
  font-weight: 700;
}

.modal-body {
  padding: 1.5rem;
  overflow-y: auto;
}

.list-group {
  border: none;
}

.notification-item {
  background-color: transparent;
  border: 1px solid #e0c9b3;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  transition: background-color 0.3s, transform 0.3s;
  cursor: pointer;
  position: relative;
}

.notification-item:hover {
  background-color: #f3e9dd;
  transform: translateX(5px);
}

.notification-icon {
  color: #a67c52;
  font-size: 1.5rem;
}

.notification-message {
  color: #8d6843;
  font-weight: 500;
}

.unread-dot {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 10px;
    height: 10px;
    background-color: #a71b29; /* Red for unread */
    border-radius: 50%;
    border: 2px solid #fff8f0;
}

.empty-state {
  color: #a67c52;
  text-align: center;
  padding: 2rem;
}

.modal-footer {
  border-top: 1px solid #e0c9b3;
  padding: 1rem 1.5rem;
  background-color: #fdfaf5;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.btn-brown, .btn-outline-brown {
  font-weight: 700;
  border-radius: 8px;
  padding: 0.5rem 1rem;
}

/* --- Transitions --- */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-active .modal-content, .modal-fade-leave-active .modal-content {
  transition: transform 0.3s ease;
}

.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-content, .modal-fade-leave-to .modal-content {
  transform: translateY(-20px);
}
</style>
