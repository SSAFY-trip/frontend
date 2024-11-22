import LoginPage from '@/views/login/LoginPage.vue'
import OAuthRedirectPage from '@/views/login/OAuthRedirectPage.vue'
import SignUpPage from '@/views/login/SignUpPage.vue'
import MainPage from '@/views/MainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
const routes = [
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignUpPage },
  { path: '/', component: MainPage, meta: { requiresAuth: true } },
  { path: '/oauth2/redirect', component: OAuthRedirectPage },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// 네비게이션 가드
router.beforeEach((to, from, next) => {
  const accessToken = localStorage.getItem('accessToken')

  // 인증이 필요한 페이지 접근 시
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!accessToken) {
      alert('인증이 필요합니다. 로그인 페이지로 이동합니다.')
      return next('/login') // Access Token이 없으면 로그인 페이지로 리다이렉트
    }
  }

  next() // 인증이 필요 없거나 인증된 경우 이동 허용
})

export default router
