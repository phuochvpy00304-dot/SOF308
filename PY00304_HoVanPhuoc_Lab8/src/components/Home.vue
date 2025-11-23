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
    <div class="row justify-content-center">
      <div class="col-md-8">
        <div class="card shadow-lg border-0">
          <div class="card-body text-center">
            <h1 class="text-primary mb-4">Trang chủ</h1>
            <p class="lead">Chào mừng bạn đến với blog! Khám phá các bài viết mới nhất và chia sẻ cảm nhận của bạn.</p>
            <router-link to="/blogs" class="btn btn-success btn-lg mt-3">Khám phá Blogs</router-link>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
.card {
  background: linear-gradient(to right, #ffffff, #f8f9fa);
}

.navbar {
  transition: background-color 0.3s ease;
}

.navbar.scrolled {
  background-color: #343a40 !important;
}

.btn-success {
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}
</style>