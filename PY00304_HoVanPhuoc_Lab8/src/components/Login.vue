<template>
  <div class="container mt-5" style="max-width: 400px;">
    <div class="card shadow">
      <div class="card-body">
        <h3 class="mb-4 text-center text-primary">Đăng nhập</h3>
        <form @submit.prevent="login">
          <div class="mb-3">
            <label class="form-label">Tên đăng nhập</label>
            <input type="text" class="form-control" placeholder="Nhập tên" v-model="username" />
          </div>
          <div class="mb-3">
            <label class="form-label">Mật khẩu</label>
            <input type="password" class="form-control" v-model="password" />
          </div>
          <button class="btn btn-primary w-100">Đăng nhập</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const username = ref('');
const password = ref('');
const router = useRouter();

function login() {
  if (username.value === 'admin' && password.value === '123') {
    localStorage.setItem('authToken', username.value);
    router.push('/dashboard');
  } else {
    alert('Sai tên đăng nhập hoặc mật khẩu!');
  }
}
</script>

<style>
</style>