import { createApp } from 'vue'
import { createRouter, createWebHashHistory, RouterView } from 'vue-router'
import App from './App.vue'
import Admin from './Admin.vue'
import Login from './Login.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    { path: '/',            component: App },
    { path: '/admin/login', component: Login },
    { path: '/admin',       component: Admin, meta: { requiresAuth: true } },
  ]
})

// 路由守卫：未登录访问 /admin 强制跳转登录页
router.beforeEach((to) => {
  if (to.meta.requiresAuth) {
    const token = sessionStorage.getItem('kuka_admin_auth')
    if (!token || token !== btoa('kuka_admin_logged_in')) {
      return { path: '/admin/login' }
    }
  }
})

createApp(RouterView).use(router).mount('#app')
