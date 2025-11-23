<template>
  <section class="bg-light py-1">
    <div class="container">
      <h2 class="mb-4">💬 Q&A Forum</h2>

      <!-- Question Card -->
      <div v-for="(question, index) in questions" :key="index" class="card mb-4 shadow-sm">
        <div class="card-body">
          <div class="d-flex align-items-start mb-3">
            <img
              :src="question.avatar"
              alt="avatar"
              class="rounded-circle me-3"
              width="50"
              height="50"
            />
            <div>
              <h5 class="mb-1">{{ question.name }}</h5>
              <small class="text-muted">{{ question.time }}</small>
            </div>
          </div>

          <h5>{{ question.title }}</h5>
          <p>{{ question.content }}</p>

          <!-- Tags -->
          <div class="mb-2">
            <span v-for="(tag, i) in question.tags" :key="i" class="badge bg-info text-dark me-1"
              >#{{ tag }}</span
            >
          </div>

          <!-- Actions -->
          <div class="d-flex justify-content-between align-items-center mt-3">
            <button class="btn btn-outline-primary btn-sm">Answer</button>
            <span class="text-muted small">{{ question.answers }} Answers</span>
            <router-link :to="'/qna/' + index" class="btn btn-outline-primary btn-sm"
              >Xem chi tiết</router-link
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'

const questions = ref([
  {
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    name: 'Ngọc Trâm',
    time: '2 hours ago',
    title: 'Cách kết nối API REST trong Vue là gì?',
    content: 'Mình đang học Vue 3 và muốn gọi API từ backend. Nên dùng fetch hay axios?',
    tags: ['vue3', 'axios', 'restapi'],
    answers: 3,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/12.jpg',
    name: 'Minh Quân',
    time: '5 hours ago',
    title: 'Bootstrap có xài được với Vue không?',
    content:
      'Mình thấy Bootstrap là thư viện CSS, nhưng khi dùng với Vue thì không rõ có bị xung đột không?',
    tags: ['bootstrap', 'vue'],
    answers: 1,
  },
  {
    avatar: 'https://randomuser.me/api/portraits/men/25.jpg',
    name: 'Thế Anh',
    time: '1 day ago',
    title: 'Làm sao để reactive object trong Vue không bị mất dữ liệu?',
    content: 'Khi reload component, dữ liệu reactive mất hết, có cách nào giữ lại không?',
    tags: ['vue', 'reactive', 'lifecycle'],
    answers: 5,
  },
])
</script>
