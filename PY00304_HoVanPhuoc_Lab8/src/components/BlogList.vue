<template>
  <div class="container mt-4">
    <nav class="navbar navbar-expand-lg navbar-dark bg-dark rounded shadow mb-4 fixed-top">
      <div class="container-fluid">
        <a class="navbar-brand fw-bold" href="#">My Blog</a>
        <div>
          <router-link class="btn btn-outline-light me-2" to="/">Go to Home</router-link>
          <router-link class="btn btn-outline-light me-2" to="/blogs">Go to Blog</router-link>
          <router-link class="btn btn-outline-light me-2" to="/login">Login</router-link>
          <router-link class="btn btn-outline-light" to="/profile">Profile</router-link>
        </div>
      </div>
    </nav>
    <div style="height: 70px;"></div>
    <h2 class="text-success mb-3">Danh sách Blog</h2>
    <div class="row">
      <div class="col-md-6 mb-3" v-for="(blog, idx) in blogs" :key="idx">
        <div class="card h-100 shadow-sm">
          <div class="card-body">
            <h5 class="card-title">{{ blog.title }}</h5>
            <p class="card-text">{{ blog.content }}</p>
            <!-- Nếu muốn có summary, hãy thêm trường summary khi tạo blog -->
            <!-- <p class="card-text">{{ blog.summary }}</p> -->
            <router-link :to="`/blog/${idx}`" class="btn btn-primary">Xem chi tiết</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const blogs = ref([])

onMounted(() => {
  const saved = localStorage.getItem('blogs')
  blogs.value = saved ? JSON.parse(saved) : []
})
</script>

<style scoped>
.card {
  background: linear-gradient(to right, #ffffff, #f8f9fa);
}
</style>