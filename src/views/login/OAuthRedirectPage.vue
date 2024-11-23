<template>
  <div class="oauth-redirect-container"></div>
</template>

<script>
import axiosInstance from '@/utils/axios'

export default {
  async mounted() {
    const currentUrl = new URL(window.location.href)
    const temporaryToken = currentUrl.searchParams.get('temporaryToken') // 임시 토큰 추출
    if (!temporaryToken) {
      alert('로그인 처리 중 문제가 발생했습니다.')
      this.$router.push('/login') // 로그인 페이지로 리다이렉트
      return
    }

    try {
      // 백엔드로 임시 토큰 검증 요청
      const response = await axiosInstance.post('/auth/verify-temporary', { temporaryToken })
      // Access Token과 Refresh Token 저장
      const accessToken = response.headers['access']
      if (!accessToken) {
        throw new Error('Access token not found in response headers')
      }
      localStorage.setItem('accessToken', accessToken)

      // 메인 페이지로 이동
      this.$router.push('/main')
    } catch (error) {
      console.error('토큰 검증 중 오류 발생:', error)
      alert('로그인 처리 중 문제가 발생했습니다.')
      this.$router.push('/login')
    }
  },
}
</script>

<style scoped>
.oauth-redirect-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  font-size: 24px;
  font-weight: bold;
  color: #555;
}
</style>
