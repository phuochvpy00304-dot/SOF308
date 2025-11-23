<template>
  <div class="container-fluid">
    <h4 class="mb-4"><i class="fas fa-shield-alt me-2"></i>Bảng điều khiển Admin</h4>

    <!-- Stats Cards -->
    <div class="row mb-4">
      <div class="col-md-3">
        <div class="card bg-primary text-white">
          <div class="card-body text-center">
            <h3>{{ totalPosts }}</h3>
            <p class="mb-0">Tổng bài viết</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-success text-white">
          <div class="card-body text-center">
            <h3>{{ totalComments }}</h3>
            <p class="mb-0">Tổng bình luận</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-info text-white">
          <div class="card-body text-center">
            <h3>{{ totalUsers }}</h3>
            <p class="mb-0">Tổng người dùng</p>
          </div>
        </div>
      </div>
      <div class="col-md-3">
        <div class="card bg-warning text-white">
          <div class="card-body text-center">
            <h3>{{ totalReports }}</h3>
            <p class="mb-0">Báo cáo</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Management Tabs -->
    <ul class="nav nav-tabs mb-4">
      <li class="nav-item">
        <button :class="`nav-link ${activeTab === 'posts' ? 'active' : ''}`" 
                @click="activeTab = 'posts'">
          Quản lý bài viết
        </button>
      </li>
      <li class="nav-item">
        <button :class="`nav-link ${activeTab === 'comments' ? 'active' : ''}`" 
                @click="activeTab = 'comments'">
          Quản lý bình luận
        </button>
      </li>
    </ul>

    <!-- Posts Management -->
    <div v-if="activeTab === 'posts'">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tiêu đề</th>
              <th>Tác giả</th>
              <th>Ngày tạo</th>
              <th>Lượt xem</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in allPosts" :key="post.id">
              <td>{{ post.id }}</td>
              <td>{{ truncateText(post.title, 50) }}</td>
              <td>{{ getAuthorName(post.authorId) }}</td>
              <td>{{ formatDate(post.createdAt) }}</td>
              <td>{{ post.viewCount || 0 }}</td>
              <td>
                <button class="btn btn-sm btn-outline-danger" 
                        @click="deletePost(post.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Comments Management -->
    <div v-if="activeTab === 'comments'">
      <div class="table-responsive">
        <table class="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nội dung</th>
              <th>Tác giả</th>
              <th>Bài viết</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="comment in allComments" :key="comment.id">
              <td>{{ comment.id }}</td>
              <td>{{ truncateText(comment.content, 100) }}</td>
              <td>{{ getAuthorName(comment.authorId) }}</td>
              <td>{{ getPostTitle(comment.postId) }}</td>
              <td>{{ formatDate(comment.createdAt) }}</td>
              <td>
                <button class="btn btn-sm btn-outline-danger" 
                        @click="deleteComment(comment.id)">
                  <i class="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";

const props = defineProps({
  reload: Number
});

const emit = defineEmits(['content-updated']);

const activeTab = ref('posts');
const allPosts = ref([]);
const allComments = ref([]);
const totalPosts = ref(0);
const totalComments = ref(0);
const totalUsers = ref(0);
const totalReports = ref(0);

async function fetchAllData() {
  try {
    const [postsRes, commentsRes] = await Promise.all([
      fetch('https://sof308-json-server-production.up.railway.app/posts'),
      fetch('https://sof308-json-server-production.up.railway.app/comments')
    ]);
    
    allPosts.value = await postsRes.json();
    allComments.value = await commentsRes.json();
    
    totalPosts.value = allPosts.value.length;
    totalComments.value = allComments.value.length;
    totalUsers.value = 2; // Mock data
    totalReports.value = 0; // Mock data
  } catch (err) {
    console.error('Error fetching admin data:', err);
  }
}

async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
  
  try {
    const res = await fetch(`https://sof308-json-server-production.up.railway.app/posts/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      allPosts.value = allPosts.value.filter(post => post.id !== id);
      totalPosts.value--;
      emit('content-updated');
    }
  } catch (err) {
    console.error('Error deleting post:', err);
  }
}

async function deleteComment(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
  
  try {
    const res = await fetch(`https://sof308-json-server-production.up.railway.app/comments/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      allComments.value = allComments.value.filter(comment => comment.id !== id);
      totalComments.value--;
      emit('content-updated');
    }
  } catch (err) {
    console.error('Error deleting comment:', err);
  }
}

function getAuthorName(authorId) {
  const authors = { 1: 'Admin', 2: 'HungVu' };
  return authors[authorId] || 'Unknown';
}

function getPostTitle(postId) {
  const post = allPosts.value.find(p => p.id === postId);
  return post ? truncateText(post.title, 30) : 'Unknown';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN");
}

function truncateText(text, maxLength) {
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
}

onMounted(fetchAllData);
watch(() => props.reload, fetchAllData);
</script>
