// api.js
import axios from 'axios'

const BASE_URL = 'https://sof308-json-server-production.up.railway.app'
const api = axios.create({ baseURL: BASE_URL })

export default api

const User_URL = `${BASE_URL}/users`
const Blog_URL = `${BASE_URL}/blogs`
const Comment_URL = `${BASE_URL}/comment`

// ---------- 🔐 USER / LOGIN ----------
export async function Login(emailOrUsername, password) {
  const res = await api.get('/users', {
    params: { q: emailOrUsername }
  });

  // Kiểm tra nếu không có dữ liệu trả về hoặc không phải mảng
  const users = Array.isArray(res.data) ? res.data : [];

  const user = res.data.find(
    u =>
      (u.username === emailOrUsername || u.email === emailOrUsername) &&
      u.password === password
  );

  if (!user) return null;

  // Lấy role name từ bảng roles
  const roleRes = await api.get(`/roles/${user.roleId}`);
  const roleName = roleRes.data?.name || 'user';

  return {
    ...user,
    role: roleName
  };
}

// Đăng ký tài khoản mới
export async function Register({ username, email, password }) {
  // Kiểm tra xem username hoặc email đã tồn tại chưa
  const existing = await api.get(User_URL, {
    params: { email }
  })

  if (existing.data.length > 0) {
    throw new Error('Tài khoản đã tồn tại')
  }

  // Nếu chưa tồn tại, thêm mới
  const res = await api.post(User_URL, {
    username,
    email,
    password,
    roleId: 2
  })

  return res.data
}

export function getAllUsers() {
  return api.get(User_URL)
}

export function getUserByUsername(username) {
  return api.get(User_URL, {
    params: { username }
  })
}

export function createUser(data) {
  return api.post(User_URL, data)
}

export function updateUser(id, data) {
  return api.put(`${User_URL}/${id}`, data)
}

export function deleteUser(id) {
  return api.delete(`${User_URL}/${id}`)
}

// ---------- 📝 BLOGS ----------
export function getAllBlogs() {
  return api.get(Blog_URL)
}

export function getBlogById(id) {
  return api.get(`${Blog_URL}/${id}`)
}

export function createBlog(data) {
  return api.post(Blog_URL, data)
}

export function updateBlog(id, data) {
  return api.put(`${Blog_URL}/${id}`, data)
}

export function deleteBlog(id) {
  return api.delete(`${Blog_URL}/${id}`)
}

// ---------- 💬 COMMENTS ----------
export function getAllComments() {
  return api.get(Comment_URL)
}

export function getCommentById(id) {
  return api.get(`${Comment_URL}/${id}`)
}

export function getCommentsByBlogId(blogId) {
  return api.get(Comment_URL, {
    params: { blogId }
  })
}

export function createComment(data) {
  return api.post(Comment_URL, data)
}

export function updateComment(id, data) {
  return api.put(`${Comment_URL}/${id}`, data)
}

export function deleteComment(id) {
  return api.delete(`${Comment_URL}/${id}`)
}
