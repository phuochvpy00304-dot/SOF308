<template>
  <div class="modal fade show d-block" tabindex="-1" style="background: rgba(0,0,0,0.5)">
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Đăng nhập</h5>
          <button type="button" class="btn-close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="handleLogin">
            <div class="mb-3">
              <label class="form-label">Tên đăng nhập</label>
              <input v-model="emailOrUsername" type="text" class="form-control" placeholder="Nhập username hoặc email"
                required>
            </div>
            <div class="mb-3">
              <label class="form-label">Mật khẩu</label>
              <input v-model="password" type="password" class="form-control" placeholder="Nhập mật khẩu" required>
            </div>
            <div class="text-muted small mb-3">
              <strong>Demo accounts:</strong><br>
              Admin: username="admin", password="admin"<br>
              User: username="user", password="user"
            </div>
            <button type="submit" class="btn btn-primary w-100" :disabled="loading">
              <span v-if="loading" class="spinner-border spinner-border-sm me-2"></span>
              Đăng nhập
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useAuth } from '@/composables/auth';

const emit = defineEmits(['close', 'login-success']);

const { login } = useAuth();

const emailOrUsername = ref('');
const password = ref('');
const loading = ref(false);

async function handleLogin() {
  loading.value = true;
  try {
    await login({ emailOrUsername: emailOrUsername.value, password: password.value });
    emit('login-success');
  } catch (error) {
    alert('Đăng nhập thất bại!');
  }
  loading.value = false;
}
</script>
