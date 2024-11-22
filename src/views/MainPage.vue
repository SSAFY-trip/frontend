<template>
  <div>
    <h1>메인 페이지</h1>
    <p>환영합니다, {{ username }}님!</p>
    <a href="/login" class="nav-link">로그인</a>
    <button @click="logout">로그아웃</button>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
    }
  },
  async created() {
    try {
      // 유저 정보 요청 (예: /user/me)
      const response = await this.$http.get('/user/me', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
        },
      })
      this.username = response.data.username
    } catch (error) {
      alert('인증이 만료되었습니다. 다시 로그인해주세요.')
      this.$router.push('/login')
    }
  },
  methods: {
    async logout() {
      try {
        // 백엔드 로그아웃 요청
        await this.$http.post(
          '/logout',
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('accessToken')}`,
            },
            withCredentials: true, // 쿠키 포함
          },
        )

        // 로그아웃 성공 시 로컬 스토리지와 쿠키 정리
        localStorage.removeItem('accessToken')
        document.cookie = 'refresh=; Max-Age=0; Path=/;'

        // 로그인 페이지로 이동
        this.$router.push('/login')
        alert('로그아웃 되었습니다.')
      } catch (error) {
        console.error('로그아웃 실패:', error)
        alert('로그아웃 중 문제가 발생했습니다. 다시 시도해주세요.')
      }
    },
  },
}
</script>
