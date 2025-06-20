import { createApp, reactive } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Reactive store for notifications
const notificationStore = reactive({
  notifications: [],
  unreadCount: 0,
  addNotification(notification) {
    this.notifications.push(notification);
    this.unreadCount = this.notifications.filter(n => n.unread).length;
  },
  markAllAsRead() {
    this.notifications.forEach(n => n.unread = false);
    this.unreadCount = 0;
  },
  clearNotifications() {
    this.notifications = [];
    this.unreadCount = 0;
  }
});

// Provide the store to all components
const app = createApp(App);
app.provide('notificationStore', notificationStore);
app.use(router).mount('#app');
