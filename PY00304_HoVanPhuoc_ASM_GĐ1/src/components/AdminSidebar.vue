<template>
  <div>
    <router-link to="/admin" class="mb-4 text-decoration-none text-white fs-5 fw-block d-block"
      >HỆ THỐNG QUẢN LÝ V-TEC</router-link
    >
    <ul class="nav flex-column">
      <li class="nav-item" v-for="item in menu" :key="item.path">
        <router-link
          :to="item.path"
          class="btn btn-outline-light w-100 text-start mb-2"
          exact-active-class="active"
        >
          {{ item.name }}
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script setup>
const menu = [
  { name: 'Quản lý tài khoản', path: '/admin/users' },
  { name: 'Quản lý bài viết', path: '/admin/posts' },
  { name: 'Quản lý bình luận', path: '/admin/comments' },
  { name: 'Quản lý câu hỏi', path: '/admin/qna' },
]
</script>
