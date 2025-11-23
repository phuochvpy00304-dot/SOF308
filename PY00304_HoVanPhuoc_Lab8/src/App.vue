<script setup>

</script>

<template>
  <div>
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
    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped></style>
