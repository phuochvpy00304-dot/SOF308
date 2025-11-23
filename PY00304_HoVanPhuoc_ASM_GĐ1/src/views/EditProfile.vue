<template>
  <div class="card mb-4">
    <div class="card-body">
      <!-- Avatar Upload -->
      <div class="text-center mb-4">
        <img :src="form.avatar" alt="Avatar Preview" class="rounded-circle img-thumbnail"
          style="width: 120px; height: 120px; object-fit: cover" />
        <div class="mt-2">
          <input type="file" accept="image/*" @change="onAvatarChange" />
        </div>
      </div>

      <!-- Full Name -->
      <div class="row mb-3">
        <div class="col-sm-3"><label class="form-label">Full Name</label></div>
        <div class="col-sm-9">
          <input v-model="form.fullName" type="text" class="form-control" required />
        </div>
      </div>

      <!-- Date of Birth -->
      <div class="row mb-3">
        <div class="col-sm-3"><label class="form-label">Date of Birth</label></div>
        <div class="col-sm-9">
          <input v-model="form.dob" type="date" class="form-control" />
        </div>
      </div>

      <!-- Gender -->
      <div class="row mb-3">
        <div class="col-sm-3"><label class="form-label">Gender</label></div>
        <div class="col-sm-9">
          <select v-model="form.gender" class="form-select">
            <option value="">Select gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <!-- Email -->
      <div class="row mb-3">
        <div class="col-sm-3"><label class="form-label">Email</label></div>
        <div class="col-sm-9">
          <input v-model="form.email" type="email" class="form-control" />
        </div>
      </div>

      <!-- Phone -->
      <div class="row mb-3">
        <div class="col-sm-3"><label class="form-label">Phone</label></div>
        <div class="col-sm-9">
          <input v-model="form.phone" type="text" class="form-control" />
        </div>
      </div>

      <!-- Address -->
      <div class="row mb-3">
        <div class="col-sm-3"><label class="form-label">Address</label></div>
        <div class="col-sm-9">
          <input v-model="form.address" type="text" class="form-control" />
        </div>
      </div>

      <!-- Buttons -->
      <div class="text-end">
        <button class="btn btn-secondary me-2" @click="goBackToProfile">Cancel</button>
        <button class="btn btn-primary" @click="saveProfile">Save</button>
      </div>
    </div>
  </div>
</template>

// 👇 script setup đầy đủ
<script setup>
import { defineEmits, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../composables/api'

const router = useRouter()

function goBackToProfile() {
  router.push('/profile')
}

const form = reactive({
  avatar: '',
  fullName: '',
  dob: '',
  gender: '',
  email: '',
  phone: '',
  address: '',
})
const emit = defineEmits(['save'])

const savedUser = JSON.parse(localStorage.getItem('user'));
const userId = savedUser?.id;

onMounted(async () => {
  try {

    const userRes = await api.get(`/users/${userId}`)
    Object.assign(form, userRes.data)
  } catch (err) {
    console.error('Lỗi tải thông tin:', err)
    alert('Không thể tải thông tin người dùng')
  }
})

function onAvatarChange(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      form.avatar = reader.result
    }
    reader.readAsDataURL(file)
  }
}

async function saveProfile() {
  try {
    await api.put(`/users/${userId}`, { ...form })
    alert('Lưu thành công')
    router.push('/profile')
  } catch (err) {
    console.error('Lỗi lưu thông tin:', err)
    alert('Lưu thất bại')
  }
}
</script>
