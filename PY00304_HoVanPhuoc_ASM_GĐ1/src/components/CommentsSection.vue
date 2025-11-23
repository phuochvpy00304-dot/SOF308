<template>
  <div class="comments-section">
    <!-- Comments Header -->
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h6 class="mb-0">
        <i class="fas fa-comments me-2"></i>
        Bình luận ({{ comments.length }})
      </h6>
      <button class="btn btn-outline-secondary btn-sm" @click="toggleComments">
        <i :class="`fas ${showComments ? 'fa-eye-slash' : 'fa-eye'} me-1`"></i>
        {{ showComments ? "Ẩn" : "Hiện" }} bình luận
      </button>
    </div>

    <!-- Comment Form -->
    <div
      v-if="hasPermission(PERMISSIONS.COMMENT_POSTS)"
      class="comment-form mb-3"
    >
      <div class="d-flex gap-2">
        <textarea
          v-model="newComment"
          class="form-control"
          rows="2"
          :placeholder="`Viết bình luận cho bài viết của ${authorName}...`"
        ></textarea>
        <button
          @click="submitComment"
          class="btn btn-success"
          :disabled="!newComment?.trim() || submittingComment"
        >
          <span
            v-if="submittingComment"
            class="spinner-border spinner-border-sm me-1"
          ></span>
          <i v-else class="fas fa-paper-plane me-1"></i>
          {{ submittingComment ? "Đang gửi..." : "Bình luận" }}
        </button>
      </div>
    </div>

    <!-- Comments List -->
    <div v-if="showComments" class="comments-list">
      <div v-if="comments.length === 0" class="text-center text-muted py-3">
        <i class="fas fa-comment-dots fa-2x mb-2"></i>
        <p>Chưa có bình luận nào</p>
      </div>

      <CommentItem
        v-for="comment in comments"
        :key="comment.id"
        :comment="comment"
        :post="post"
        :replies="getReplies(comment.id)"
        @delete-comment="$emit('delete-comment', $event)"
        @submit-reply="$emit('submit-reply', $event)"
        @toggle-reaction="$emit('toggle-comment-reaction', $event)"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import CommentItem from "./CommentItem.vue";
import { useAuth } from "@/composables/auth";

const { hasPermission, PERMISSIONS } = useAuth();

const props = defineProps({
  post: {
    type: Object,
    required: true,
  },
  comments: {
    type: Array,
    default: () => [],
  },
  authorName: {
    type: String,
    required: true,
  },
});

const emit = defineEmits([
  "submit-comment",
  "delete-comment",
  "submit-reply",
  "toggle-comment-reaction",
]);

const showComments = ref(false);
const newComment = ref("");
const submittingComment = ref(false);

// Get only parent comments (not replies)
const comments = computed(() => {
  return props.comments
    .filter((c) => !c.parentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
});

function toggleComments() {
  showComments.value = !showComments.value;
}

function getReplies(commentId) {
  return props.comments
    .filter((c) => c.parentId === commentId)
    .sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
}

async function submitComment() {
  if (!newComment.value?.trim()) return;

  submittingComment.value = true;

  const commentData = {
    postId: props.post.id,
    content: newComment.value,
    parentId: null,
  };

  try {
    await emit("submit-comment", commentData);
    newComment.value = "";
    showComments.value = true;
  } finally {
    submittingComment.value = false;
  }
}
</script>

<style scoped>
.comments-section {
  border-top: 1px solid #e9ecef;
  padding-top: 1rem;
}
</style>
