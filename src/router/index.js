import LoginPage from '@/views/login/LoginPage.vue'
import OAuthRedirectPage from '@/views/login/OAuthRedirectPage.vue'
import SignUpPage from '@/views/login/SignUpPage.vue'
import MainPage from '@/views/MainPage.vue'
import AddTripPage from '@/views/trip/AddTripPage.vue'
import MyTripPage from '@/views/trip/MyTripPage.vue'
import RecommendedTripPage from '@/views/trip/RecommendedTripPage.vue'
import TripItineraryPage from '@/views/trip/TripItineraryPage.vue'
import TripMainPage from '@/views/trip/TripMainPage.vue'
import VisitTripMainPage from "@/views/trip/VisitTripMainPage.vue"
import VisitTripItineraryPage from "@/views/trip/VisitTripItineraryPage.vue"
import TripSettingsPage from '@/views/trip/TripSettingsPage.vue'
import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  { path: '/', name: 'main', component: MainPage, meta: { requiresAuth: true } },
  { path: '/login', component: LoginPage },
  { path: '/signup', component: SignUpPage },
  { path: '/oauth2/redirect', component: OAuthRedirectPage },
  { path: '/recommended', component: RecommendedTripPage },
  { path: '/my-trip', component: MyTripPage },
  { path: '/add-trip', component: AddTripPage },
  { path: '/trip/:tripId/main', name: 'trip-main', component: TripMainPage },
  { path: '/trip/:tripId/itinerary', name: 'trip-itinerary', component: TripItineraryPage },
  { path: '/trip/:tripId/settings', name: 'trip-settings', component: TripSettingsPage },
  { path: '/visit/trip/:tripId/main', name: 'visit-trip-main', component: VisitTripMainPage },
  { path: '/visit/trip/:tripId/itinerary', name: 'visit-trip-itinerary', component: VisitTripItineraryPage },
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
