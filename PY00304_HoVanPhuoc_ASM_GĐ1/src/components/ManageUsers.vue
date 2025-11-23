<template>
  <div>
    <h3>Manage Users</h3>
    <table class="table table-bordered mt-3">
      <thead class="table-dark">
        <tr>
          <th>#</th>
          <th>Tên tài khoản</th>
          <th>Email</th>
          <th>Vai trò</th>
          <th>Hành động</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="user in users" :key="user.id">
          <td>{{ user.id }}</td>
          <td>{{ user.username }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.role }}</td>
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
const users = [
  { id: 1, username: 'admin', email: 'admin@example.com', role: 'Admin' },
  { id: 2, username: 'user1', email: 'user1@example.com', role: 'User' },
]
</script>
