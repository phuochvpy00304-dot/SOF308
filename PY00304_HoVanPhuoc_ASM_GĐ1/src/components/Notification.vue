<template>
  <div class="dropdown">
    <a 
      class="nav-link dropdown-toggle position-relative" 
      href="#" 
      id="notificationDropdown"
      data-bs-toggle="dropdown" 
      aria-expanded="false"
    >
      <i class="fas fa-bell fs-5"></i>
      <span 
        v-if="unreadCount > 0" 
        class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
      >
        {{ unreadCount }}
      </span>
    </a>
    
    <ul class="dropdown-menu dropdown-menu-end notification-dropdown" aria-labelledby="notificationDropdown">
      <li class="dropdown-header d-flex justify-content-between align-items-center">
        <span>Thông báo</span>
        <button v-if="unreadCount > 0" @click="markAllAsRead" class="btn btn-sm btn-link p-0">
          Đánh dấu đã đọc
        </button>
      </li>
      <li><hr class="dropdown-divider"></li>
      
      <div v-if="notifications.length === 0" class="text-center py-3 text-muted">
        <i class="fas fa-bell-slash mb-2"></i>
        <p class="mb-0">Chưa có thông báo</p>
      </div>
      
      <li v-for="notification in notifications" :key="notification.id">
        <a 
          class="dropdown-item notification-item" 
          :class="{ 'unread': !notification.read }"
          href="#" 
          @click.prevent="markAsRead(notification)"
        >
          <div class="d-flex">
            <div class="flex-shrink-0">
              <i class="fas fa-comment text-primary"></i>
            </div>
            <div class="flex-grow-1 ms-2">
              <h6 class="mb-1">{{ notification.title }}</h6>
              <p class="mb-1 text-muted small">{{ notification.message }}</p>
              <small class="text-muted">{{ formatTime(notification.createdAt) }}</small>
            </div>
          </div>
        </a>
      </li>
      
      <li v-if="notifications.length > 0"><hr class="dropdown-divider"></li>
      <li v-if="notifications.length > 0">
        <a class="dropdown-item text-center" href="#" @click.prevent="viewAllNotifications">
          Xem tất cả thông báo
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const notifications = ref([]);
const currentUserId = ref(2); // Lấy từ session hoặc store

const unreadCount = computed(() => {
  return notifications.value.filter(n => !n.read).length;
});

// Kết nối WebSocket hoặc EventSource cho real-time
let eventSource = null;

onMounted(() => {
  fetchNotifications();
  setupRealTimeConnection();
});

async function fetchNotifications() {
  try {
    const response = await fetch(`https://sof308-json-server-production.up.railway.app/notifications?userId=${currentUserId.value}&_sort=createdAt&_order=desc`);
    notifications.value = await response.json();
  } catch (error) {
    console.error('Error fetching notifications:', error);
  }
}

function setupRealTimeConnection() {
  // Sử dụng Server-Sent Events cho real-time notifications
  eventSource = new EventSource(`https://sof308-json-server-production.up.railway.app/notifications/stream?userId=${currentUserId.value}`);
  
  eventSource.onmessage = (event) => {
    const newNotification = JSON.parse(event.data);
    notifications.value.unshift(newNotification);
    
    // Hiển thị toast notification
    showToast(newNotification);
  };
}

function showToast(notification) {
  // Tạo toast notification
  const toastHtml = `
    <div class="toast align-items-center text-white bg-primary border-0" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          <strong>${notification.title}</strong><br>
          ${notification.message}
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    </div>
  `;
  
  // Thêm vào container và hiển thị
  const toastContainer = document.getElementById('toast-container');
  if (toastContainer) {
    toastContainer.insertAdjacentHTML('beforeend', toastHtml);
    const toastElement = toastContainer.lastElementChild;
    const toast = new bootstrap.Toast(toastElement);
    toast.show();
  }
}

async function markAsRead(notification) {
  if (!notification.read) {
    try {
      await fetch(`https://sof308-json-server-production.up.railway.app/notifications/${notification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: true })
      });
      notification.read = true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  }
}

async function markAllAsRead() {
  const unreadNotifications = notifications.value.filter(n => !n.read);
  
  for (const notification of unreadNotifications) {
    await markAsRead(notification);
  }
}

function formatTime(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Vừa xong';
  if (diffInMinutes < 60) return `${diffInMinutes} phút trước`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ trước`;
  return `${Math.floor(diffInMinutes / 1440)} ngày trước`;
}

function viewAllNotifications() {
  // Navigate to notifications page
  console.log('View all notifications');
}
</script>

<style scoped>
.notification-dropdown {
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
}

.notification-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #f8f9fa;
}

.notification-item.unread {
  background-color: #f8f9fa;
  border-left: 3px solid #0d6efd;
}

.notification-item:hover {
  background-color: #e9ecef;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  font-weight: 600;
}
</style>
