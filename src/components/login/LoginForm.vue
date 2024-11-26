<template>
  <div>
    <h1>로그인</h1>
    <form @submit.prevent="handleLogin">
      <label for="username">아이디</label>
      <input type="text" id="username" v-model="username" required />

      <label for="password">비밀번호</label>
      <input type="password" id="password" v-model="password" required />

      <button type="submit">로그인</button>
    </form>

    <p>아직 회원이 아니신가요? <router-link to="/signup">회원가입</router-link></p>

    <SocialLogin />
  </div>
</template>

<script>
import SocialLogin from '@/components/login/SocialLogin.vue'

export default {
  components: { SocialLogin },
  data() {
    return {
      username: '',
      password: '',
    }
  },
  methods: {
    async handleLogin() {
      try {
        const response = await this.$http.post('/login', {
          username: this.username,
          password: this.password,
        })
        const accessToken = response.headers['authorization']
        const refreshToken = response.headers['set-cookie']
        this.$store.commit('auth/setTokens', { accessToken, refreshToken })
        this.$router.push('/')
      } catch (error) {
        alert('로그인 실패: ' + error.response.data.message)
      }
    },
  },
}
</script>
