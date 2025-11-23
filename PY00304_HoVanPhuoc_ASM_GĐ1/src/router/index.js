import { createRouter, createWebHistory } from 'vue-router'
import MainLayout from '../layouts/MainLayout.vue'
import SideLayout from '../layouts/SideLayout.vue'
import PersonalLayout from '../layouts/PersonalLayout.vue'
import Dashboard from '@/views/Dashboard.vue'
import AdminLayout from '@/layouts/AdminLayout.vue'
import ManageUsers from '@/components/ManageUsers.vue'
import ManagePosts from '@/components/ManagePosts.vue'
import ManageComments from '@/components/ManageComments.vue'
import ManageQnA from '@/components/ManageQnA.vue'
import Home from '../views/Home.vue'

import QnA from '../views/Q&A.vue'
import QnADetail from '../views/QnADetail.vue'

import Blog from '../views/Blog.vue'
import Discussion from '../views/Discussion.vue'
import About from '../views/About.vue'
import Login from '../views/Login.vue'
import Register from '../views/Register.vue'
import Pagi from '../views/Pagination.vue'
import Post from '../views/Post.vue'
import Profile from '../views/Profile.vue'
import EditProfile from '../views/EditProfile.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      { path: '', component: Home }, // 👈 Trang mặc định là Home
    ],
  },
  {
    path: '/',
    component: SideLayout,
    children: [
      { path: 'blog', component: Blog },
      { path: 'qna', component: QnA },
      { path: '/qna/:id', component: QnADetail },
      { path: 'discussion', component: Discussion },
      { path: 'about', component: About },
      { path: 'pagi', component: Pagi },
    ],
  },
  {
    path: '/',
    component: PersonalLayout,
    children: [
      { path: 'profile', component: Profile },
      { path: 'post', component: Post },
      { path: 'editProfile', component: EditProfile },
    ],
  },
  {
    path: '/admin',
    component: AdminLayout,
    children: [
      { path: '', component: Dashboard },
      { path: '', redirect: '/admin/users' }, // nếu không có gì thì về users
      { path: 'users', component: ManageUsers },
      { path: 'posts', component: ManagePosts },
      { path: 'comments', component: ManageComments },
      { path: 'qna', component: ManageQnA },
    ],
  },

  { path: '/login', component: Login },
  { path: '/register', component: Register },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
