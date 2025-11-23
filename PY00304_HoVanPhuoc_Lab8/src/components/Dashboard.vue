<template>
  <div class="container mt-4">
    <h2 class="text-info mb-3">Dashboard</h2>
    <div class="card shadow mb-4">
      <div class="card-body">
        <form @submit.prevent="addBlog">
          <div class="mb-3">
            <label class="form-label">Tiêu đề blog</label>
            <input type="text" class="form-control" v-model="title" required>
          </div>
          <div class="mb-3">
            <label class="form-label">Nội dung blog</label>
            <textarea class="form-control" v-model="content" required></textarea>
          </div>
          <button class="btn btn-success" type="submit">Thêm mới</button>
        </form>
      </div>
    </div>
    <div class="card shadow">
      <div class="card-body">
        <h4>Danh sách blog đã thêm</h4>
        <ul class="list-group">
          <li v-for="(blog, idx) in blogs" :key="idx" class="list-group-item">
            <strong>{{ blog.title }}</strong><br>
            <span>{{ blog.content }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const title = ref('')
const content = ref('')
const blogs = ref([])

function addBlog() {
  const newBlog = { title: title.value, content: content.value }
  blogs.value.push(newBlog)

  localStorage.setItem('blogs', JSON.stringify(blogs.value))
  title.value = ''
  content.value = ''
}

onMounted(() => {
  const saved = localStorage.getItem('blogs')
  blogs.value = saved ? JSON.parse(saved) : []
})
</script>

<style>

</style>