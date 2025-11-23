<template>
  <div class="like-dislike-container d-flex align-items-center gap-2">
    <button
      @click="handleLike"
      :disabled="!isAuthenticated || isLoading"
      :class="`btn btn-sm ${userReaction === 'like' ? 'btn-primary' : 'btn-outline-primary'}`"
    >
      <i class="fas fa-thumbs-up me-1"></i>
      Like {{ likesCount }}
    </button>

    <button
      @click="handleDislike"
      :disabled="!isAuthenticated || isLoading"
      :class="`btn btn-sm ${userReaction === 'dislike' ? 'btn-danger' : 'btn-outline-danger'}`"
    >
      <i class="fas fa-thumbs-down me-1"></i>
      Dislike {{ dislikesCount }}
    </button>

    <div v-if="!isAuthenticated" class="text-muted small">
      <i class="fas fa-info-circle me-1"></i>
      Đăng nhập để thích bài viết
    </div>

    <!-- Loading indicator -->
    <div
      v-if="isLoading"
      class="spinner-border spinner-border-sm text-primary"
      role="status"
    >
      <span class="visually-hidden">Đang xử lý...</span>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useAuth } from "@/composables/auth"; // ✅ Thêm import này

const props = defineProps({
  postId: {
    type: String,
    required: true,
  },
});

// Emit events để thông báo cho parent component
const emit = defineEmits(["reaction-updated"]);

// ✅ Sử dụng useAuth composable (đã import)
const { currentUser, isAuthenticated } = useAuth();

const likesCount = ref(0);
const dislikesCount = ref(0);
const userReaction = ref(null); // 'like', 'dislike', or null
const isLoading = ref(false);

onMounted(() => {
  fetchReactions();
  if (isAuthenticated.value) {
    fetchUserReaction();
  }
});

async function fetchReactions() {
  try {
    const response = await fetch(
      `https://sof308-json-server-production.up.railway.app/reactions?postId=${props.postId}`
    );
    if (!response.ok) throw new Error("Failed to fetch reactions");

    const reactions = await response.json();

    likesCount.value = reactions.filter((r) => r.type === "like").length;
    dislikesCount.value = reactions.filter((r) => r.type === "dislike").length;
  } catch (error) {
    console.error("Error fetching reactions:", error);
    // Set default values on error
    likesCount.value = 0;
    dislikesCount.value = 0;
  }
}

async function fetchUserReaction() {
  if (!currentUser.value?.id) return;

  try {
    const response = await fetch(
      `https://sof308-json-server-production.up.railway.app/reactions?postId=${props.postId}&userId=${currentUser.value.id}`
    );
    if (!response.ok) throw new Error("Failed to fetch user reaction");

    const reactions = await response.json();

    if (reactions.length > 0) {
      userReaction.value = reactions[0].type;
    } else {
      userReaction.value = null;
    }
  } catch (error) {
    console.error("Error fetching user reaction:", error);
    userReaction.value = null;
  }
}

async function handleLike() {
  if (!isAuthenticated.value) {
    alert("Vui lòng đăng nhập để thích bài viết");
    return;
  }

  await toggleReaction("like");
}

async function handleDislike() {
  if (!isAuthenticated.value) {
    alert("Vui lòng đăng nhập để không thích bài viết");
    return;
  }

  await toggleReaction("dislike");
}

async function toggleReaction(type) {
  if (isLoading.value) return;

  isLoading.value = true;

  try {
    // Nếu user đã có reaction
    if (userReaction.value) {
      // Nếu click vào cùng loại reaction -> remove
      if (userReaction.value === type) {
        await removeReaction();

        // Update local counts
        if (type === "like") {
          likesCount.value = Math.max(0, likesCount.value - 1);
        } else {
          dislikesCount.value = Math.max(0, dislikesCount.value - 1);
        }

        userReaction.value = null;
      } else {
        // Nếu click vào reaction khác -> update
        await updateReaction(type);

        // Cập nhật count
        if (userReaction.value === "like") {
          likesCount.value = Math.max(0, likesCount.value - 1);
          dislikesCount.value++;
        } else {
          dislikesCount.value = Math.max(0, dislikesCount.value - 1);
          likesCount.value++;
        }

        userReaction.value = type;
      }
    } else {
      // Nếu user chưa có reaction -> tạo mới
      await createReaction(type);
      userReaction.value = type;

      if (type === "like") {
        likesCount.value++;
      } else {
        dislikesCount.value++;
      }
    }

    // Emit event để thông báo cho parent component
    emit("reaction-updated", {
      postId: props.postId,
      likesCount: likesCount.value,
      dislikesCount: dislikesCount.value,
      userReaction: userReaction.value,
    });
  } catch (error) {
    console.error("Error toggling reaction:", error);
    alert("Có lỗi xảy ra. Vui lòng thử lại.");

    // Refresh data on error
    await fetchReactions();
    if (isAuthenticated.value) {
      await fetchUserReaction();
    }
  }

  isLoading.value = false;
}

async function createReaction(type) {
  const reaction = {
    id: generateId(),
    postId: props.postId,
    userId: currentUser.value.id,
    type: type,
    createdAt: new Date().toISOString(),
  };

  const response = await fetch("https://sof308-json-server-production.up.railway.app/reactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(reaction),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || "Failed to create reaction");
  }

  return await response.json();
}

async function updateReaction(type) {
  const response = await fetch(
    `https://sof308-json-server-production.up.railway.app/reactions?postId=${props.postId}&userId=${currentUser.value.id}`
  );
  if (!response.ok) throw new Error("Failed to fetch existing reaction");

  const reactions = await response.json();

  if (reactions.length > 0) {
    const reactionId = reactions[0].id;
    const updateResponse = await fetch(
      `https://sof308-json-server-production.up.railway.app/reactions/${reactionId}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: type,
          updatedAt: new Date().toISOString(),
        }),
      }
    );

    if (!updateResponse.ok) {
      const errorData = await updateResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to update reaction");
    }

    return await updateResponse.json();
  } else {
    throw new Error("No existing reaction found to update");
  }
}

async function removeReaction() {
  const response = await fetch(
    `https://sof308-json-server-production.up.railway.app/reactions?postId=${props.postId}&userId=${currentUser.value.id}`
  );
  if (!response.ok) throw new Error("Failed to fetch existing reaction");

  const reactions = await response.json();

  if (reactions.length > 0) {
    const reactionId = reactions[0].id;
    const deleteResponse = await fetch(
      `https://sof308-json-server-production.up.railway.app/reactions/${reactionId}`,
      {
        method: "DELETE",
      }
    );

    if (!deleteResponse.ok) {
      const errorData = await deleteResponse.json().catch(() => ({}));
      throw new Error(errorData.message || "Failed to remove reaction");
    }
  } else {
    throw new Error("No existing reaction found to remove");
  }
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2, 5);
}

// Expose methods for parent component if needed
defineExpose({
  refreshReactions: () => {
    fetchReactions();
    if (isAuthenticated.value) {
      fetchUserReaction();
    }
  },
});
</script>

<style scoped>
.like-dislike-container {
  margin-top: 0.5rem;
  min-height: 32px; /* Prevent layout shift */
}

.btn {
  transition: all 0.3s ease;
  border-radius: 6px;
  font-weight: 500;
}

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.875rem;
  min-width: 60px; /* Prevent button size change */
}

.btn-primary {
  background: linear-gradient(135deg, #007bff, #0056b3);
  border: none;
}

.btn-danger {
  background: linear-gradient(135deg, #dc3545, #c82333);
  border: none;
}

.btn-outline-primary:hover {
  background: linear-gradient(135deg, #007bff, #0056b3);
}

.btn-outline-danger:hover {
  background: linear-gradient(135deg, #dc3545, #c82333);
}

.spinner-border-sm {
  width: 1rem;
  height: 1rem;
}

.text-muted.small {
  font-size: 0.8rem;
  font-style: italic;
}

/* Animation for count changes */
.btn {
  position: relative;
  overflow: hidden;
}

.btn::after {
  content: "";
  position: absolute;
  top: 50%;
  left: 50%;
  width: 0;
  height: 0;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.3);
  transform: translate(-50%, -50%);
  transition:
    width 0.3s,
    height 0.3s;
}

.btn:active::after {
  width: 120px;
  height: 120px;
}

@media (max-width: 768px) {
  .like-dislike-container {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .btn-sm {
    min-width: 50px;
    padding: 0.2rem 0.5rem;
    font-size: 0.8rem;
  }
}

.dropdown-toggle i {
  font-family: "Font Awesome 6 Free" !important;
  font-weight: 900 !important;
  font-style: normal !important;
}

</style>
