<template>
  <div class="container-fluid">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h4><i class="fas fa-user-circle me-2"></i>Bài viết của tôi</h4>
    </div>

    <div v-if="userPosts.length > 0" class="row">
      <div v-for="post in userPosts" :key="post.id" class="col-12 mb-4">
        <div class="card shadow-lg border-primary post-card">
          <!-- Image Gallery -->
          <div
            v-if="post.images && post.images.length > 0"
            class="position-relative"
          >
            <!-- Main Image -->
            <div class="image-container">
              <img
                :src="getMainImage(post)"
                :alt="post.title"
                class="card-img-top main-image"
                @click="openImageModal(post.images, 0)"
              />

              <!-- Image Count Badge -->
              <div
                v-if="post.images.length > 1"
                class="position-absolute top-0 end-0 m-3"
              >
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

          <div class="card-body">
            <div class="d-flex justify-content-between align-items-start mb-3">
              <h5 class="card-title fw-bold text-primary">{{ post.title }}</h5>
              <div class="dropdown">
                <button
                  class="btn btn-outline-secondary btn-sm dropdown-toggle"
                  data-bs-toggle="dropdown"
                >
                  Xem thêm
                </button>

                <ul class="dropdown-menu dropdown-menu-end">
                  <li>
                    <a
                      class="dropdown-item"
                      href="#"
                      @click.prevent="$emit('edit-post', post)"
                    >
                      <i class="fas fa-edit me-2 text-warning"></i>Chỉnh sửa
                    </a>
                  </li>
                  <li><hr class="dropdown-divider" /></li>
                  <li>
                    <a
                      class="dropdown-item text-danger"
                      href="#"
                      @click.prevent="deletePost(post.id)"
                    >
                      <i class="fas fa-trash-alt me-2"></i>Xóa
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            <p
              class="card-text text-muted"
              v-html="truncateContent(post.content)"
            ></p>

            <div class="d-flex justify-content-between align-items-center">
              <small class="text-muted">
                <i class="fas fa-clock me-1"></i
                >{{ formatDate(post.createdAt) }}
              </small>
              <div class="d-flex gap-2">
                <span class="badge bg-success">
                  <i class="fas fa-thumbs-up me-1"></i
                  >{{ getPostLikes(post.id) }} thích
                </span>
                <span class="badge bg-danger">
                  <i class="fas fa-thumbs-down me-1"></i
                  >{{ getPostDislikes(post.id) }} không thích
                </span>
                <span class="badge bg-info">
                  <i class="fas fa-comments me-1"></i
                  >{{ getPostComments(post.id) }} bình luận
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <div class="card shadow-sm border-0">
        <div class="card-body">
          <i class="fas fa-pen fa-3x text-muted mb-3"></i>
          <h5 class="text-muted">Bạn chưa có bài viết nào</h5>
          <p class="text-muted">
            Hãy tạo bài viết đầu tiên để chia sẻ ý tưởng của bạn!
          </p>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="showImageModal"
      class="modal fade show d-block"
      tabindex="-1"
      style="background: rgba(0, 0, 0, 0.9)"
    >
      <div class="modal-dialog modal-xl modal-dialog-centered">
        <div class="modal-content bg-transparent border-0">
          <div class="modal-header border-0">
            <button
              type="button"
              class="btn-close btn-close-white"
              @click="closeImageModal"
            ></button>
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
  </div>
</template>

<script setup>
import { ref, onMounted, watch, reactive } from "vue";
import { useAuth } from "@/composables/auth";

const { currentUser } = useAuth();

const props = defineProps({
  userId: String,
  reload: Number,
});

const emit = defineEmits(["edit-post", "create-post"]);

const userPosts = ref([]);
const reactions = ref([]);
const comments = ref([]);

// Image modal state
const showImageModal = ref(false);
const modalImages = ref([]);
const currentModalIndex = ref(0);

// Track current image index for each post
const postImageIndexes = reactive({});

async function fetchUserPosts() {
  try {
    const res = await fetch(
      `https://sof308-json-server-production.up.railway.app/posts?authorId=${props.userId}`
    );
    const data = await res.json();
    userPosts.value = data.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    // Initialize image indexes
    userPosts.value.forEach((post) => {
      if (post.images && post.images.length > 0) {
        postImageIndexes[post.id] = 0;
      }
    });
  } catch (err) {
    console.error("Error fetching user posts:", err);
  }
}

async function fetchReactions() {
  try {
    const res = await fetch("https://sof308-json-server-production.up.railway.app/reactions");
    reactions.value = await res.json();
  } catch (err) {
    console.error("Error fetching reactions:", err);
  }
}

async function fetchComments() {
  try {
    const res = await fetch("https://sof308-json-server-production.up.railway.app/comments");
    comments.value = await res.json();
  } catch (err) {
    console.error("Error fetching comments:", err);
  }
}

async function deletePost(id) {
  if (!confirm("Bạn có chắc chắn muốn xóa bài viết này?")) return;

  try {
    const res = await fetch(`https://sof308-json-server-production.up.railway.app/posts/${id}`, {
      method: "DELETE",
    });
    if (res.ok) {
      userPosts.value = userPosts.value.filter((post) => post.id !== id);
    }
  } catch (err) {
    console.error("Error deleting post:", err);
  }
}

// Image handling functions
function getMainImage(post) {
  if (!post.images || post.images.length === 0) return "";
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
  document.body.style.overflow = "hidden";
}

function closeImageModal() {
  showImageModal.value = false;
  modalImages.value = [];
  currentModalIndex.value = 0;
  document.body.style.overflow = "auto";
}

function changeModalImage(direction) {
  const newIndex = currentModalIndex.value + direction;
  if (newIndex >= 0 && newIndex < modalImages.value.length) {
    currentModalIndex.value = newIndex;
  }
}

function getPostLikes(postId) {
  return reactions.value.filter((r) => r.postId === postId && r.type === "like")
    .length;
}

function getPostDislikes(postId) {
  return reactions.value.filter(
    (r) => r.postId === postId && r.type === "dislike"
  ).length;
}

function getPostComments(postId) {
  return comments.value.filter((c) => c.postId === postId).length;
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function truncateContent(content, maxLength = 150) {
  const textContent = content.replace(/<[^>]*>/g, "");
  return textContent.length > maxLength
    ? textContent.substring(0, maxLength) + "..."
    : textContent;
}

async function loadAllData() {
  await Promise.all([fetchUserPosts(), fetchReactions(), fetchComments()]);
}

onMounted(loadAllData);
watch(() => props.reload, loadAllData);

// Keyboard navigation for modal
onMounted(() => {
  document.addEventListener("keydown", (e) => {
    if (showImageModal.value) {
      if (e.key === "Escape") {
        closeImageModal();
      } else if (e.key === "ArrowLeft") {
        changeModalImage(-1);
      } else if (e.key === "ArrowRight") {
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
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2) !important;
}

/* Image Styles */
.image-container {
  position: relative;
  overflow: hidden;
}

.main-image {
  height: 300px;
  object-fit: cover;
  cursor: pointer;
  transition: transform 0.3s ease;
  width: 100%;
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
  background: rgba(0, 0, 0, 0.7) !important;
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
  background: rgba(255, 255, 255, 0.9) !important;
  border: none;
  font-size: 1.2rem;
}

.image-counter {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.card-title {
  font-size: 1.25rem;
  line-height: 1.4;
}

.card-text {
  line-height: 1.6;
  font-size: 0.95rem;
}

.badge {
  font-size: 0.8rem;
  padding: 0.4rem 0.6rem;
}

.dropdown-menu {
  border: none;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
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
    height: 200px;
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

  .d-flex.justify-content-between {
    flex-direction: column;
    align-items: flex-start !important;
    gap: 1rem;
  }

  .d-flex.gap-2 {
    flex-wrap: wrap;
    gap: 0.5rem !important;
  }

  .badge {
    font-size: 0.75rem;
    padding: 0.3rem 0.5rem;
  }
}
</style>
