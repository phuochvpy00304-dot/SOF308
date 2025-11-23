<template>
  <div>
    <h3>Manage Comments</h3>
    <table class="table table-bordered mt-3">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Bình luận</th>
          <th>Tác giả</th>
          <th>Tiêu đề bài viết</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="comment in comments" :key="comment.id">
          <td>{{ comment.id }}</td>
          <td>{{ comment.text }}</td>
          <td>{{ comment.author }}</td>
          <td>{{ comment.post_title }}</td>
          <td>
            <button class="btn btn-sm btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
const comments = [
  { id: 1, text: 'Nice post!', author: 'user2', post_title: 'Welcome to the blog' },
  { id: 2, text: 'Helpful article.', author: 'user3', post_title: 'New Features' },
]
</script>
