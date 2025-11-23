import { ref, computed } from 'vue';
import { Login as apiLogin } from '@/composables/api.js';

const currentUser = ref(null);
const isAuthenticated = ref(false);
const isGuest = ref(true);

const ROLES = {
  ADMIN: 'admin',
  USER: 'user',
  GUEST: 'guest'
};

const PERMISSIONS = {
  VIEW_POSTS: 'view_posts',
  LIKE_POSTS: 'like_posts',
  COMMENT_POSTS: 'comment_posts',
  CREATE_POSTS: 'create_posts',
  EDIT_OWN_POSTS: 'edit_own_posts',
  DELETE_OWN_POSTS: 'delete_own_posts',
  DELETE_ANY_POSTS: 'delete_any_posts',
  DELETE_ANY_COMMENTS: 'delete_any_comments',
  MANAGE_USERS: 'manage_users'
};

const rolePermissions = {
  [ROLES.GUEST]: [
    PERMISSIONS.VIEW_POSTS
  ],
  [ROLES.USER]: [
    PERMISSIONS.VIEW_POSTS,
    PERMISSIONS.LIKE_POSTS,
    PERMISSIONS.COMMENT_POSTS,
    PERMISSIONS.CREATE_POSTS,
    PERMISSIONS.EDIT_OWN_POSTS,
    PERMISSIONS.DELETE_OWN_POSTS
  ],
  [ROLES.ADMIN]: [
    PERMISSIONS.VIEW_POSTS,
    PERMISSIONS.LIKE_POSTS,
    PERMISSIONS.COMMENT_POSTS,
    PERMISSIONS.CREATE_POSTS,
    PERMISSIONS.EDIT_OWN_POSTS,
    PERMISSIONS.DELETE_OWN_POSTS,
    PERMISSIONS.DELETE_ANY_POSTS,
    PERMISSIONS.DELETE_ANY_COMMENTS,
    PERMISSIONS.MANAGE_USERS
  ]
};

export function useAuth() {
  const userRole = computed(() => {
    if (!isAuthenticated.value) return ROLES.GUEST;
    return currentUser.value?.role || ROLES.USER;
  });

  const userPermissions = computed(() => {
    return rolePermissions[userRole.value] || [];
  });

  function hasPermission(permission) {
    return userPermissions.value.includes(permission);
  }

  function hasRole(role) {
    return userRole.value === role;
  }

  function isAdmin() {
    return hasRole(ROLES.ADMIN);
  }

  function canEditPost(post) {
    if (hasPermission(PERMISSIONS.DELETE_ANY_POSTS)) return true;
    if (hasPermission(PERMISSIONS.EDIT_OWN_POSTS) && post.authorId === currentUser.value?.id) return true;
    return false;
  }

  function canDeletePost(post) {
    if (hasPermission(PERMISSIONS.DELETE_ANY_POSTS)) return true;
    if (hasPermission(PERMISSIONS.DELETE_OWN_POSTS) && post.authorId === currentUser.value?.id) return true;
    return false;
  }

  function canDeleteComment(comment) {
    if (hasPermission(PERMISSIONS.DELETE_ANY_COMMENTS)) return true;
    if (comment.authorId === currentUser.value?.id) return true;
    return false;
  }

  async function login(credentials) {
    try {
      const userData = await apiLogin(credentials.emailOrUsername, credentials.password);

      if (!userData) {
        throw new Error('Sai tài khoản hoặc mật khẩu');
      }

      currentUser.value = userData;
      isAuthenticated.value = true;
      isGuest.value = false;

      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', 'demo-token-' + Date.now());

      return { success: true, user: userData };
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  function logout() {
    currentUser.value = null;
    isAuthenticated.value = false;
    isGuest.value = true;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }

  function initializeAuth() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');

    if (token && user) {
      try {
        currentUser.value = JSON.parse(user);
        isAuthenticated.value = true;
        isGuest.value = false;
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        logout();
      }
    } else {
      // Guest mode
      isGuest.value = true;
      isAuthenticated.value = false;
      currentUser.value = null;
    }
  }

  return {
    currentUser,
    isAuthenticated,
    isGuest,
    userRole,
    userPermissions,
    hasPermission,
    hasRole,
    isAdmin,
    canEditPost,
    canDeletePost,
    canDeleteComment,
    login,
    logout,
    initializeAuth,
    ROLES,
    PERMISSIONS
  };
}
