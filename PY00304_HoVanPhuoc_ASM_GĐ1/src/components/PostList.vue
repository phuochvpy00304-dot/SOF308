<template>
  <div class="container-fluid">
    <!-- Guest Notice -->
    <div v-if="!isAuthenticated" class="alert alert-info mb-4">
      <i class="fas fa-user me-1"></i>
      <strong>Chào mừng!</strong> Bạn đang xem ở chế độ khách. 
      <button class="btn btn-link p-0 ms-2" @click="$emit('show-login')">
        Đăng nhập
      </button> để thích, bình luận và tạo bài viết.
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Đang tải...</span>
      </div>
      <p class="mt-3 text-muted">Đang tải danh sách bài viết...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger d-flex align-items-center" role="alert">
      <i class="fas fa-exclamation-triangle me-2"></i>
      <div>{{ error }}</div>
    </div>

    <!-- Empty State -->
    <div v-else-if="posts.length === 0" class="text-center py-5">
      <div class="card border-0">
        <div class="card-body">
          <i class="fas fa-inbox fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Chưa có bài viết nào</h5>
          <p class="text-muted">Hãy tạo bài viết đầu tiên của bạn!</p>
        </div>
      </div>
    </div>

    <!-- Posts List -->
    <div v-else class="row">
      <div 
        v-for="post in posts" 
        :key="post.id" 
        class="col-12 mb-4"
      >
        <div class="card shadow-lg border-0 post-card">
          <!-- Image Gallery -->
          <div v-if="post.images && post.images.length > 0" class="position-relative">
            <!-- Main Image -->
            <div class="image-container">
              <img
                :src="getMainImage(post)"
                :alt="post.title"
                class="card-img-top main-image"
                @click="openImageModal(post.images, 0)"
              />
              
              <!-- Image Count Badge -->
              <div v-if="post.images.length > 1" class="position-absolute top-0 end-0 m-3">
                <span class="badge bg-dark bg-opacity-75">
                  <i class="fas fa-images me-1"></i>{{ post.images.length }} ảnh
                </span>
              </div>
              
              <!-- Image Navigation -->
              <div v-if="post.images.length > 1" class="image-navigation">
                <button 
                  class="btn btn-dark btn-sm nav-btn prev-btn"
                  @click.stop="changeMainImage(post, -1)"
                >
                  <i class="fas fa-chevron-left"></i>
                </button>
                <button 
                  class="btn btn-dark btn-sm nav-btn next-btn"
                  @click.stop="changeMainImage(post, 1)"
                >
                  <i class="fas fa-chevron-right"></i>
                </button>
              </div>
            </div>
            
            <!-- Image Thumbnails -->
            <div v-if="post.images.length > 1" class="image-thumbnails p-2">
              <div class="d-flex gap-2 overflow-auto">
                <img
                  v-for="(image, index) in post.images"
                  :key="index"
                  :src="image.url"
                  :alt="`${post.title} - ${index + 1}`"
                  :class="`thumbnail ${getCurrentImageIndex(post) === index ? 'active' : ''}`"
                  @click="setMainImage(post, index)"
                />
              </div>
            </div>
          </div>
          
          <!-- Card Body -->
          <div class="card-body">
            <div class="row">
              <div class="col-md-8">
                <h5 class="card-title fw-bold text-primary mb-2">
                  {{ post.title }}
                </h5>
                
                <div class="card-text mb-3">
                  <div class="content-preview" v-html="truncateContent(post.content)"></div>
                </div>
                
                <!-- Author & Date -->
                <div class="d-flex justify-content-between align-items-center mb-3">
                  <small class="text-muted">
                    <i class="fas fa-user me-1"></i>{{ getAuthorName(post.authorId) }}
                  </small>
                  <small class="text-muted">
                    <i class="fas fa-clock me-1"></i>{{ formatDate(post.createdAt) }}
                  </small>
                </div>
              </div>
              
              <div class="col-md-4">
                <!-- Like/Dislike -->
                <div v-if="hasPermission(PERMISSIONS.LIKE_POSTS)" class="mb-3">
                  <LikeDislike 
                    :post-id="post.id" 
                    @reaction-updated="$emit('reaction-updated')"
                  />
                </div>
                <div v-else class="mb-3">
                  <div class="text-muted small text-center p-2 bg-light rounded">
                    Đăng nhập để thích bài viết
                  </div>
                </div>
                
                <!-- Action Buttons -->
                <div class="d-flex gap-2 mb-3">
                  <button class="btn btn-outline-primary btn-sm flex-fill" @click="viewPost(post)">
                    <i class="fas fa-eye me-1"></i>Xem chi tiết
                  </button>
                  
                  <!-- Edit/Delete for authorized users -->
                  <div v-if="isAuthenticated && (canEditPost(post) || canDeletePost(post))" class="dropdown">
                    <button 
                      class="btn btn-outline-secondary btn-sm dropdown-toggle" 
                      type="button" 
                      :id="`dropdownMenu${post.id}`"
                      data-bs-toggle="dropdown"
                    >
                      <i class="fas fa-ellipsis-v"></i>
                    </button>
                    <ul class="dropdown-menu dropdown-menu-end">
                      <li v-if="canEditPost(post)">
                        <a class="dropdown-item" href="#" @click.prevent="$emit('edit-post', post)">
                          <i class="fas fa-edit me-2"></i>Sửa
                        </a>
                      </li>
                      <li v-if="canDeletePost(post)">
                        <a class="dropdown-item text-danger" href="#" @click.prevent="deletePost(post.id)">
                          <i class="fas fa-trash me-2"></i>Xóa
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Comments Section -->
            <CommentsSection
              :post="post"
              :comments="getPostComments(post.id)"
              :author-name="getAuthorName(post.authorId)"
              :comment-reactions="commentReactions"
              @submit-comment="handleSubmitComment"
              @delete-comment="handleDeleteComment"
              @submit-reply="handleSubmitReply"
              @toggle-comment-reaction="handleToggleCommentReaction"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div v-if="showImageModal" class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.9)">
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-header border-0">
            <button type="button" class="btn-close btn-close-white" @click="closeImageModal"></button>
          </div>
          <div class="modal-body text-center p-0">
            <img 
              :src="modalImages[currentModalIndex]?.url" 
              :alt="`Image ${currentModalIndex + 1}`"
              class="img-fluid modal-image"
            />
            
            <!-- Modal Navigation -->
            <div v-if="modalImages.length > 1" class="modal-navigation">
              <button 
                class="btn btn-light btn-lg modal-nav-btn prev"
                @click="changeModalImage(-1)"
                :disabled="currentModalIndex === 0"
              >
                <i class="fas fa-chevron-left"></i>
              </button>
              <button 
                class="btn btn-light btn-lg modal-nav-btn next"
                @click="changeModalImage(1)"
                :disabled="currentModalIndex === modalImages.length - 1"
              >
                <i class="fas fa-chevron-right"></i>
              </button>
            </div>
            
            <!-- Image Counter -->
            <div class="image-counter">
              {{ currentModalIndex + 1 }} / {{ modalImages.length }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Post Detail Modal -->
    <PostDetailModal 
      v-if="showPostDetail"
      :post="selectedPost"
      @close="showPostDetail = false"
      @show-login="$emit('show-login')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import LikeDislike from "@/components/LikeDislike.vue";
import CommentsSection from "@/components/CommentsSection.vue";
import { useAuth } from '@/composables/auth';

const { 
  isAuthenticated,
  hasPermission, 
  canEditPost, 
  canDeletePost, 
  PERMISSIONS,
  currentUser,
} = useAuth();

const props = defineProps({
  reload: Number,
  showAll: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['edit-post', 'reaction-updated', 'show-login']);

const posts = ref([]);
const comments = ref([]);
const commentReactions = ref([]);
const loading = ref(false);
const error = ref("");
const deleting = ref(null);
const showPostDetail = ref(false);
const selectedPost = ref(null);

// Image modal state
const showImageModal = ref(false);
const modalImages = ref([]);
const currentModalIndex = ref(0);

// Track current image index for each post
const postImageIndexes = reactive({});

async function fetchPosts() {
  loading.value = true;
  error.value = "";
  try {
    const res = await fetch("https://sof308-json-server-production.up.railway.app/posts");
    if (!res.ok) throw new Error("Không thể lấy danh sách bài viết!");
    const data = await res.json();
    posts.value = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    
    // Initialize image indexes
    posts.value.forEach(post => {
      if (post.images && post.images.length > 0) {
        postImageIndexes[post.id] = 0;
      }
    });
  } catch (err) {
    error.value = err.message;
  }
  loading.value = false;
}

async function fetchComments() {
  try {
    const res = await fetch('https://sof308-json-server-production.up.railway.app/comments');
    comments.value = await res.json();
  } catch (err) {
    console.error('Error fetching comments:', err);
  }
}

async function fetchCommentReactions() {
  try {
    const res = await fetch('https://sof308-json-server-production.up.railway.app/commentReactions');
    commentReactions.value = await res.json();
  } catch (err) {
    console.error('Error fetching comment reactions:', err);
  }
}

async function deletePost(id) {
  if (!confirm('Bạn có chắc chắn muốn xóa bài viết này?')) return;
  
  deleting.value = id;
  try {
    const res = await fetch(`https://sof308-json-server-production.up.railway.app/posts/${id}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      posts.value = posts.value.filter(post => post.id !== id);
      emit('reaction-updated');
    }
  } catch (err) {
    error.value = err.message;
  }
  deleting.value = null;
}

function viewPost(post) {
  selectedPost.value = post;
  showPostDetail.value = true;
}

// Image handling functions
function getMainImage(post) {
  if (!post.images || post.images.length === 0) return '';
  const currentIndex = postImageIndexes[post.id] || 0;
  return post.images[currentIndex]?.url || post.images[0]?.url;
}

function getCurrentImageIndex(post) {
  return postImageIndexes[post.id] || 0;
}

function setMainImage(post, index) {
  postImageIndexes[post.id] = index;
}

function changeMainImage(post, direction) {
  const currentIndex = postImageIndexes[post.id] || 0;
  const newIndex = currentIndex + direction;
  
  if (newIndex >= 0 && newIndex < post.images.length) {
    postImageIndexes[post.id] = newIndex;
  }
}

function openImageModal(images, startIndex = 0) {
  modalImages.value = images;
  currentModalIndex.value = startIndex;
  showImageModal.value = true;
  document.body.style.overflow = 'hidden';
}

function closeImageModal() {
  showImageModal.value = false;
  modalImages.value = [];
  currentModalIndex.value = 0;
  document.body.style.overflow = 'auto';
}

function changeModalImage(direction) {
  const newIndex = currentModalIndex.value + direction;
  if (newIndex >= 0 && newIndex < modalImages.value.length) {
    currentModalIndex.value = newIndex;
  }
}

// Comments functions
function getPostComments(postId) {
  return comments.value.filter(c => c.postId === postId);
}

async function handleSubmitComment(commentData) {
  try {
    const comment = {
      id: Date.now().toString(),
      postId: commentData.postId,
      authorId: currentUser.value.id,
      content: commentData.content,
      parentId: commentData.parentId,
      createdAt: new Date().toISOString()
    };

    const response = await fetch('https://sof308-json-server-production.up.railway.app/comments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(comment)
    });

    if (response.ok) {
      comments.value.push(comment);
    }
  } catch (error) {
    console.error('Error submitting comment:', error);
  }
}

async function handleDeleteComment(commentId) {
  if (!confirm('Bạn có chắc chắn muốn xóa bình luận này?')) return;
  
  try {
    const res = await fetch(`https://sof308-json-server-production.up.railway.app/comments/${commentId}`, {
      method: 'DELETE'
    });
    if (res.ok) {
      comments.value = comments.value.filter(c => c.id !== commentId);
    }
  } catch (err) {
    console.error('Error deleting comment:', err);
  }
}

async function handleSubmitReply(replyData) {
  await handleSubmitComment(replyData);
}

async function handleToggleCommentReaction({ commentId, type }) {
  try {
    const existingReaction = commentReactions.value.find(
      r => r.commentId === commentId && r.userId === currentUser.value.id
    );

    if (existingReaction) {
      if (existingReaction.type === type) {
        await fetch(`https://sof308-json-server-production.up.railway.app/commentReactions/${existingReaction.id}`, {
          method: 'DELETE'
        });
        commentReactions.value = commentReactions.value.filter(r => r.id !== existingReaction.id);
      } else {
        existingReaction.type = type;
        await fetch(`https://sof308-json-server-production.up.railway.app/commentReactions/${existingReaction.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type })
        });
      }
    } else {
      const reaction = {
        id: Date.now().toString(),
        commentId,
        userId: currentUser.value.id,
        type,
        createdAt: new Date().toISOString()
      };

      await fetch('https://sof308-json-server-production.up.railway.app/commentReactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(reaction)
      });

      commentReactions.value.push(reaction);
    }
  } catch (error) {
    console.error('Error toggling comment reaction:', error);
  }
}

function getAuthorName(authorId) {
  const authors = { 1: 'Admin', 2: 'HungVu' };
  return authors[authorId] || 'Unknown';
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit", 
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit"
  });
}

function truncateContent(content, maxLength = 200) {
  const textContent = content.replace(/<[^>]*>/g, '');
  return textContent.length > maxLength 
    ? textContent.substring(0, maxLength) + '...' 
    : textContent;
}

async function loadAllData() {
  await Promise.all([
    fetchPosts(),
    fetchComments(),
    fetchCommentReactions()
  ]);
}

onMounted(loadAllData);
watch(() => props.reload, loadAllData);

// Keyboard navigation for modal
onMounted(() => {
  document.addEventListener('keydown', (e) => {
    if (showImageModal.value) {
      if (e.key === 'Escape') {
        closeImageModal();
      } else if (e.key === 'ArrowLeft') {
        changeModalImage(-1);
      } else if (e.key === 'ArrowRight') {
        changeModalImage(1);
      }
    }
  });
});
</script>

<style scoped>
.post-card {
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.post-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 10px 30px rgba(0,0,0,0.2) !important;
}

/* Image Styles */
.image-container {
  position: relative;
  overflow: hidden;
}

.main-image {
  height: 400px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.main-image:hover {
  transform: scale(1.02);
}

.image-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 1rem;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.image-container:hover .image-navigation {
  opacity: 1;
}

.nav-btn {
  background: rgba(0,0,0,0.7) !important;
  border: none;
  color: white;
  width: 40px;
  height: 40px;
  border-radius: 50%;
}

.image-thumbnails {
  background: #f8f9fa;
  border-top: 1px solid #dee2e6;
}

.thumbnail {
  width: 60px;
  height: 60px;
  object-fit: cover;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.7;
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.thumbnail:hover {
  opacity: 1;
  transform: scale(1.05);
}

.thumbnail.active {
  opacity: 1;
  border-color: #007bff;
}

/* Modal Styles */
.modal-image {
  max-height: 80vh;
  max-width: 100%;
  object-fit: contain;
}

.modal-navigation {
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  padding: 0 2rem;
}

.modal-nav-btn {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255,255,255,0.9) !important;
  border: none;
  font-size: 1.2rem;
}

.image-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0,0,0,0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.content-preview {
  line-height: 1.6;
  color: #6c757d;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
  border-radius: 8px;
}

.dropdown-item {
  padding: 0.5rem 1rem;
  transition: all 0.3s ease;
}

.dropdown-item:hover {
  background-color: #f8f9fa;
  transform: translateX(5px);
}

.dropdown-item.text-danger:hover {
  background-color: #f8d7da;
  color: #721c24 !important;
}

@media (max-width: 768px) {
  .main-image {
    height: 250px;
  }
  
  .image-navigation {
    opacity: 1;
  }
  
  .nav-btn {
    width: 35px;
    height: 35px;
  }
  
  .modal-nav-btn {
    width: 50px;
    height: 50px;
  }
  
  .thumbnail {
    width: 50px;
    height: 50px;
  }
}
</style>
