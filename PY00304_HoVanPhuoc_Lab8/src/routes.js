import { createRouter, createWebHashHistory } from "vue-router";
import Home from "./components/Home.vue";
import BlogList from "./components/BlogList.vue";
import BlogPost from "./components/BlogPost.vue";
import UserProfile from "./components/UserProfile.vue";
import UserProfileInfo from "./components/UserProfileInfo.vue";
import UserProfileSetting from "./components/UserProfileSetting.vue";
import Login from "./components/Login.vue";
import Dashboard from "./components/Dashboard.vue";

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        { path: '/', name: 'Home', component: Home },
        { path: '/blogs', name: 'BlogList', component: BlogList },
        { path: '/blog/:id', name: 'BlogPost', component: BlogPost },
        {
            path: '/profile',
            name: 'UserProfile',
            component: UserProfile,
            alias: '/me',
            children: [
                { path: 'info', name: 'UserProfileInfo', component: UserProfileInfo },
                { path: 'settings', name: 'UserProfileSetting', component: UserProfileSetting }
            ]
        },
        { path: '/login', name: 'Login', component: Login },
        { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
    ]
});

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('authToken');

    if (to.meta.requiresAuth && !token) {
        next({ name: 'Login' });
    } 
    else if (to.name === 'Login' && token) {
        next({ name: 'Dashboard' });
    } 
    else {
        next();
    }
});

export default router;
