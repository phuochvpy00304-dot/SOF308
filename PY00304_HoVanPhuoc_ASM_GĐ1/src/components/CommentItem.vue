<template>
  <div class="comment-item mb-3">
    <div class="card border-start border-primary border-3">
      <div class="card-body p-3">
        <!-- Comment Header -->
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div class="d-flex align-items-center">
            <strong class="me-2">{{ getAuthorName(comment.authorId) }}</strong>
            <small class="text-muted">{{
              formatDate(comment.createdAt)
            }}</small>
          </div>

          <!-- Comment Actions -->
          <div class="dropdown" v-if="canDeleteComment(comment)">
            <button
              class="btn btn-sm btn-outline-secondary dropdown-toggle"
              data-bs-toggle="dropdown"
            >
              Xem thêm
            </button>
            <ul class="dropdown-menu">
              <li>
                <a
                  class="dropdown-item text-danger"
                  href="#"
                  @click.prevent="deleteComment"
                >
                  <i class="fas fa-trash-alt me-2"></i>Xóa bình luận
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Comment Content -->
        <p class="mb-2">{{ comment.content }}</p>

        <!-- Comment Actions -->
        <div class="d-flex align-items-center gap-3">
          <!-- Like/Dislike -->
          <div
            v-if="hasPermission(PERMISSIONS.LIKE_POSTS)"
            class="d-flex gap-2"
          >
            <button
              @click="toggleReaction('like')"
              :class="`btn btn-sm ${userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'}`"
            >
              <i class="fas fa-thumbs-up me-1"></i>{{ likesCount }}
            </button>
            <button
              @click="toggleReaction('dislike')"
              :class="`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`"
            >
              <i class="fas fa-thumbs-down me-1"></i>{{ dislikesCount }}
            </button>
          </div>

          <!-- Reply Button -->
          <button
            v-if="hasPermission(PERMISSIONS.COMMENT_POSTS)"
            @click="toggleReplyForm"
            class="btn btn-sm btn-outline-secondary"
          >
            <i class="fas fa-comments me-1"></i>Trả lời
          </button>
        </div>

        <!-- Reply Form -->
        <div v-if="showReplyForm" class="reply-form mt-3">
          <div class="d-flex gap-2">
            <textarea
              v-model="replyContent"
              class="form-control"
              rows="2"
              :placeholder="`Trả lời ${getAuthorName(comment.authorId)}...`"
            ></textarea>
            <button
              @click="submitReply"
              class="btn btn-success btn-sm"
              :disabled="!replyContent?.trim()"
            >
              <i class="fas fa-paper-plane me-1"></i>
              Trả lời
            </button>
          </div>
        </div>

        <!-- Replies -->
        <div v-if="replies.length > 0" class="replies mt-3">
          <div
            v-for="reply in replies"
            :key="reply.id"
            class="reply-item ms-4 mb-2"
          >
            <div class="card bg-light">
              <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-start">
                  <div>
                    <strong class="me-2">{{
                      getAuthorName(reply.authorId)
                    }}</strong>
                    <small class="text-muted">{{
                      formatDate(reply.createdAt)
                    }}</small>
                  </div>
                  <div class="dropdown" v-if="canDeleteComment(reply)">
                    <button
                      class="btn btn-sm btn-outline-secondary dropdown-toggle"
                      data-bs-toggle="dropdown"
                    >
                      <i class="fas fa-plus me-1"></i>Thêm
                    </button>
                    <ul class="dropdown-menu">
                      <li>
                        <a
                          class="dropdown-item text-danger"
                          href="#"
                          @click.prevent="$emit('delete-comment', reply.id)"
                        >
                          <i class="fas fa-trash-alt me-2"></i>Xóa
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <p class="mb-0 mt-1">{{ reply.content }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { useAuth } from "@/composables/auth";

const { hasPermission, PERMISSIONS, currentUser, isAdmin } = useAuth();

const props = defineProps({
  comment: {
    type: Object,
    required: true,
  },
  post: {
    type: Object,
    required: true,
  },
  replies: {
    type: Array,
    default: () => [],
  },
  commentReactions: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(["delete-comment", "submit-reply", "toggle-reaction"]);

const showReplyForm = ref(false);
const replyContent = ref("");

// Computed properties
const likesCount = computed(() => {
  return props.commentReactions.filter(
    (r) => r.commentId === props.comment.id && r.type === "like"
  ).length;
});

const dislikesCount = computed(() => {
  return props.commentReactions.filter(
    (r) => r.commentId === props.comment.id && r.type === "dislike"
  ).length;
});

const userReaction = computed(() => {
  const reaction = props.commentReactions.find(
    (r) =>
      r.commentId === props.comment.id && r.userId === currentUser.value?.id
  );
  return reaction?.type || null;
});

// Methods
function toggleReplyForm() {
  showReplyForm.value = !showReplyForm.value;
}

function submitReply() {
  if (!replyContent.value?.trim()) return;

  const replyData = {
    postId: props.post.id,
    content: replyContent.value,
    parentId: props.comment.id,
  };

  emit("submit-reply", replyData);
  replyContent.value = "";
  showReplyForm.value = false;
}

function toggleReaction(type) {
  emit("toggle-reaction", {
    commentId: props.comment.id,
    type: type,
  });
}

function deleteComment() {
  emit("delete-comment", props.comment.id);
}

function canDeleteComment(comment) {
  if (isAdmin.value) return true;
  if (props.post.authorId === currentUser.value?.id) return true;
  if (comment.authorId === currentUser.value?.id) return true;
  return false;
}

function getAuthorName(authorId) {
  const authors = { 1: "Admin", 2: "HungVu" };
  return authors[authorId] || "Unknown";
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
</script>

<style scoped>
.comment-item {
  transition: all 0.3s ease;
}

.comment-item:hover {
  transform: translateX(5px);
}

.reply-item {
  border-left: 2px solid #dee2e6;
  padding-left: 1rem;
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
</style>
