<template>
  <div class="container py-2">
    <!-- Header -->
    <div class="text-center mb-4">
      <h2 class="fw-bold">💬 Thảo Luận</h2>
      <p class="text-muted">
        Bắt đầu một cuộc thảo luận mới hoặc tham gia một cuộc thảo luận có sẵn.
      </p>
    </div>

    <!-- Discussions List -->
    <div v-if="discussions.length">
      <div class="card mb-4" v-for="(discussion, index) in discussions" :key="index">
        <div class="card-body d-flex">
          <!-- Avatar -->
          <img :src="discussion.avatar" class="rounded-circle me-3" width="60" height="60" />

          <!-- Main Content -->
          <div class="flex-grow-1">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-0 fw-bold">{{ discussion.username }}</h6>
                <small class="text-muted"
                  >Bài Viết: <span class="text-primary">"{{ discussion.postTitle }}"</span></small
                >
              </div>
              <small class="text-muted">{{ discussion.time }}</small>
            </div>

            <p class="mt-3 mb-2">{{ discussion.content }}</p>

            <button class="btn btn-outline-primary btn-sm">Trả lời</button>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="text-center text-muted">No discussions yet. Be the first to post!</div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const discussions = ref([
  {
    avatar: 'https://i.pravatar.cc/100?img=1',
    username: 'Toan Luong',
    postTitle: 'V-TEC Mayfest 2025 | Công bố kết quả CHÍNH THỨC',
    content:
      'Đây là một cuộc chơi hết sức thú vị và bổ ích. Cảm ơn đội ngũ V-TEC đã tổ chức một sự kiện tuyệt vời như vậy.',
    time: '3 hours ago',
  },
  {
    avatar: 'https://i.pravatar.cc/100?img=5',
    username: 'Anna Nguyen',
    postTitle: 'Dark mode layout in Bootstrap?',
    content:
      'I tried switching my layout to dark mode but some components still have white background. How to fix that?',
    time: '1 day ago',
  },
  {
    avatar: 'https://i.pravatar.cc/100?img=12',
    username: 'Dat Dev',
    postTitle: 'How to deploy Vue app to Firebase?',
    content:
      'I’m getting stuck at the build step when deploying my Vue project to Firebase Hosting. Any advice?',
    time: '2 days ago',
  },
])
</script>

<style scoped>
.card {
  border-radius: 1rem;
}
</style>
