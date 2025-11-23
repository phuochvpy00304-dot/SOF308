<template>
  <div>
    <h3>Manage Posts</h3>
    <table class="table table-bordered mt-3">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Tiêu đề</th>
          <th>Tác giả</th>
          <th>Thời gian đăng bài</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="post in posts" :key="post.id">
          <td>{{ post.id }}</td>
          <td>{{ post.title }}</td>
          <td>{{ post.author }}</td>
          <td>{{ post.created_at }}</td>
          <td>
            <button class="btn btn-sm btn-warning me-2">Edit</button>
            <button class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const posts = [
  { id: 1, title: 'Welcome to the blog', author: 'admin', created_at: '2025-06-01' },
  { id: 2, title: 'New Features', author: 'user1', created_at: '2025-06-10' },
]
</script>
