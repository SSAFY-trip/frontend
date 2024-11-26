import LoginPage from '@/views/login/LoginPage.vue'
import MainPage from '@/views/MainPage.vue'
import SignUpPage from '@/views/login/SignUpPage.vue'
import TripMainPage from '@/views/trip/TripMainPage.vue'
import { createRouter, createWebHistory } from 'vue-router'
import OAuthRedirectPage from '@/views/login/OAuthRedirectPage.vue'
import TripItineraryPage from '@/views/trip/TripItineraryPage.vue'
import TripNavigationPage from '@/views/trip/TripNavigationPage.vue'
import TripSettingsPage from '@/views/trip/TripSettingsPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignUpPage },
  { path: '/main', component: MainPage, meta: { requiresAuth: true } },
  { path: '/oauth2/redirect', component: OAuthRedirectPage }, // 리다이렉트 처리
  { path: '/trip/:tripId/main', name: 'trip-main', component: TripMainPage},
  { path: '/trip/:tripId/itinerary', name: 'trip-itinerary', component: TripItineraryPage},
  { path: '/trip/:tripId/navigation', name: 'trip-navigation', component: TripNavigationPage},
  { path: '/trip/:tripId/settings', name: 'trip-settings', component: TripSettingsPage},
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