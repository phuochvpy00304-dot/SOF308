import { reactive } from 'vue'

export const authStore = reactive({
  isLoggedIn: false,
  user: null,
  userRole: null, // 'admin', 'user', 'guest'
  
  login(userData) {
    this.isLoggedIn = true
    this.user = userData
    this.userRole = userData.role
    // Lưu vào localStorage
    localStorage.setItem('authData', JSON.stringify({
      isLoggedIn: true,
      user: userData,
      userRole: userData.role
    }))
  },
  
  logout() {
    this.isLoggedIn = false
    this.user = null
    this.userRole = null
    localStorage.removeItem('authData')
  },
  
  checkAuth() {
    const authData = localStorage.getItem('authData')
    if (authData) {
      const parsed = JSON.parse(authData)
      this.isLoggedIn = parsed.isLoggedIn
      this.user = parsed.user
      this.userRole = parsed.userRole
    }
  }
})
