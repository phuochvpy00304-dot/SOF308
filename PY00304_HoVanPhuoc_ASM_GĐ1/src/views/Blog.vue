<template>
  <div class="container mt-4">
    <!-- Header với Login/Logout -->
    <nav class="navbar navbar-expand-lg navbar-light bg-light mb-4 rounded">
      <div class="container-fluid">
        <span class="navbar-brand">📝 Quản lý bài viết</span>
        <div class="d-flex align-items-center">
          <div v-if="!isAuthenticated" class="d-flex gap-2">
            <button class="btn btn-outline-primary btn-sm" @click="showLoginModal = true">
              <i class="fas fa-user me-1"></i>Đăng nhập
            </button>
          </div>
          <div v-else class="d-flex align-items-center gap-3">
            <span class="text-muted">{{ currentUser?.username }}</span>
            <span :class="`badge ${isAdmin() ? 'bg-danger' : 'bg-secondary'}`">
              {{ isAdmin() ? 'Admin' : 'User' }}
            </span>
            <button class="btn btn-outline-secondary btn-sm" @click="handleLogout">
              <i class="fas fa-user me-1"></i>Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>

    <!-- Guest Notice -->
    <div v-if="!isAuthenticated" class="alert alert-info mb-4">
      <div class="d-flex justify-content-between align-items-center">
        <div>
          <i class="fas fa-user me-1"></i>Đăng nhập
          <strong>Chào mừng!</strong> Bạn đang xem ở chế độ khách. 
          <strong>Đăng nhập</strong> để thích, bình luận và tạo bài viết.
        </div>
        <button class="btn btn-primary btn-sm" @click="showLoginModal = true">
          Đăng nhập
        </button>
      </div>
    </div>

    <!-- Stats Section -->
    <div class="stats-section mb-4">
      <div class="row g-3">
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-newspaper text-primary fs-2 mb-2"></i>
            <h6 class="text-muted">Tổng bài viết</h6>
            <h4 class="text-primary">{{ totalPosts }}</h4>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-thumbs-up text-success fs-2 mb-2"></i>
            <h6 class="text-muted">Lượt thích</h6>
            <h4 class="text-success">{{ totalLikes }}</h4>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-thumbs-down text-danger fs-2 mb-2"></i>
            <h6 class="text-muted">Lượt không thích</h6>
            <h4 class="text-danger">{{ totalDislikes }}</h4>
          </div>
        </div>
        <div class="col-md-3 col-sm-6">
          <div class="stat-card text-center p-3">
            <i class="fas fa-comments text-warning fs-2 mb-2"></i>
            <h6 class="text-muted">Bình luận</h6>
            <h4 class="text-warning">{{ totalComments }}</h4>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <ul class="nav nav-pills nav-fill bg-light rounded p-2 mb-4">
      <li class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'all' ? 'active' : ''}`"
          @click="setActiveTab('all')"
        >
          <i class="fas fa-newspaper me-2"></i>Tất cả bài viết
        </button>
      </li>
      <li v-if="isAuthenticated" class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'my-posts' ? 'active' : ''}`"
          @click="setActiveTab('my-posts')"
        >
          <i class="fas fa-folder-open me-2"></i>Bài viết của tôi
        </button>
      </li>
      <li v-if="isAuthenticated" class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'create' ? 'active' : ''}`"
          @click="setActiveTab('create')"
        >
          <i class="fas fa-plus me-2"></i>Tạo bài viết
        </button>
      </li>
      <li v-if="isAdmin.value" class="nav-item">
        <button 
          :class="`nav-link ${activeTab === 'admin' ? 'active' : ''}`"
          @click="setActiveTab('admin')"
        >
          <i class="fas fa-shield-alt me-2"></i>Quản trị
        </button>
      </li>
    </ul>

    <!-- Tab Content -->
    <div class="tab-content">
      <!-- All Posts Tab -->
      <div v-if="activeTab === 'all'">
        <PostList 
          :reload="reloadCounter" 
          :show-all="true"
          @edit-post="handleEditPost"
          @reaction-updated="handleReactionUpdate"
          @show-login="showLoginModal = true"
          @view-post="handleViewPost"
        />
      </div>

      <!-- My Posts Tab -->
      <div v-if="activeTab === 'my-posts' && isAuthenticated">
        <UserPosts 
          :user-id="currentUser.id"
          :reload="reloadCounter"
          @edit-post="handleEditPost"
        />
      </div>

      <!-- Create Post Tab -->
      <div v-if="activeTab === 'create' && isAuthenticated">
        <FormPost 
          :edit-post="editingPost"
          @post-success="handlePostSuccess" 
          @cancel-edit="handleCancelEdit"
        />
      </div>

      <!-- Admin Panel Tab -->
      <div v-if="activeTab === 'admin' && isAdmin.value">
        <AdminPanel 
          :reload="reloadCounter"
          @content-updated="handleContentUpdate"
        />
      </div>
      <br />
      <a href="/post" class="btn btn-primary">Xem thêm</a>
    </div>
    <div class="d-flex justify-content-between align-items-center">
      <h2 class="mb-0">Tạo bài viết mới</h2>
      <router-link class="btn btn-info text-white" to="createPost">Đăng bài</router-link>
    </div>

    <!-- Login Modal -->
    <LoginModal 
      v-if="showLoginModal"
      @close="showLoginModal = false"
      @login-success="handleLoginSuccess"
    />

    <!-- Post Detail Modal -->
    <PostDetailModal 
      v-if="showPostDetail"
      :post="selectedPost"
      @close="showPostDetail = false"
      @show-login="showLoginModal = true"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import FormPost from "@/components/FormPost.vue";
import PostList from "@/components/PostList.vue";
import UserPosts from "@/components/UserPosts.vue";
import AdminPanel from "@/components/AdminPanel.vue";
import LoginModal from "@/components/LoginModal.vue";
import { useAuth } from '@/composables/auth';
import { useStats } from '@/composables/useStats';

const { 
  currentUser, 
  isAuthenticated, 
  isAdmin, 
  logout, 
  initializeAuth 
} = useAuth();

const {
  totalPosts,
  totalLikes,
  totalDislikes,
  totalComments,
  fetchStats
} = useStats();

const activeTab = ref('all');
const reloadCounter = ref(0);
const editingPost = ref(null);
const showLoginModal = ref(false);
const showPostDetail = ref(false);
const selectedPost = ref(null);

function setActiveTab(tab) {
  activeTab.value = tab;
  editingPost.value = null;
}

function handleEditPost(post) {
  if (!isAuthenticated.value) {
    showLoginModal.value = true;
    return;
  }
  editingPost.value = post;
  activeTab.value = 'create';
}

function handlePostSuccess() {
  reloadCounter.value++;
  editingPost.value = null;
  activeTab.value = 'all';
  fetchStats(); // Refresh stats
}

function handleCancelEdit() {
  editingPost.value = null;
  activeTab.value = 'all';
}

function handleReactionUpdate() {
  fetchStats(); // Refresh stats when reactions change
}

function handleContentUpdate() {
  reloadCounter.value++;
  fetchStats(); // Refresh stats
}

function handleLoginSuccess() {
  showLoginModal.value = false;
  reloadCounter.value++;
  fetchStats(); // Refresh stats
}

function handleLogout() {
  logout();
  activeTab.value = 'all';
  reloadCounter.value++;
  fetchStats(); // Refresh stats
}

function handleViewPost(post) {
  selectedPost.value = post;
  showPostDetail.value = true;
}

onMounted(() => {
  initializeAuth();
  fetchStats(); // Load initial stats
});
</script>

<style scoped>
.nav-pills .nav-link {
  color: #6c757d;
  border-radius: 8px;
  transition: all 0.3s ease;
}

.nav-pills .nav-link:hover {
  background-color: #e9ecef;
  color: #495057;
}

.nav-pills .nav-link.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.alert-info {
  border-left: 4px solid #0d6efd;
}

/* Stats Section */
.stats-section {
  margin-bottom: 2rem;
}

.stat-card {
  background: white;
  border-radius: 15px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: all 0.3s ease;
  border: 1px solid #f1f3f4;
  height: 100%;
}

.stat-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0,0,0,0.15);
}

.stat-card h4 {
  font-weight: 700;
  font-size: 1.8rem;
}

.stat-card h6 {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

@media (max-width: 768px) {
  .stat-card h4 {
    font-size: 1.5rem;
  }
  
  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }
}
</style>
