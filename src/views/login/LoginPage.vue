<template>
  <div class="login-container">
    <h1 class="login-title">로그인</h1>
    <form @submit.prevent="handleLogin" class="login-form">
      <div class="form-group">
        <label for="username">아이디</label>
        <input type="text" id="username" v-model="username" class="form-input" required />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" class="form-input" required />
      </div>

      <button type="submit" class="login-button">로그인</button>
    </form>

    <p class="signup-link">
      아직 회원이 아니신가요?
      <router-link to="/signup">회원가입</router-link>
    </p>

    <div class="social-login">
      <p>또는 소셜 계정으로 로그인</p>
      <button class="social-button naver" @click="handleSocialLogin('naver')">네이버 로그인</button>
      <button class="social-button google" @click="handleSocialLogin('google')">구글 로그인</button>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utils/axios'
export default {
  data() {
    return {
      username: '',
      password: '',
    }
  },
  // async mounted() {
  //   const currentUrl = window.location.href
  //   console.log('111111')
  //   if (currentUrl.includes('/oauth2/redirect')) {
  //     console.log('22222222')
  //     try {
  //       // Access Token을 HTTP 헤더에서 추출
  //       const response = await axiosInstance.get('http://localhost:8080/oauth2/redirect', {
  //         withCredentials: true,
  //       })
  //       const accessToken = response.headers['access']
  //       if (!accessToken) throw new Error('Access token not found')

  //       localStorage.setItem('accessToken', accessToken)
  //       this.$router.push('/main')
  //     } catch (error) {
  //       console.error('토큰 획득 중 문제가 발생했습니다.', error)
  //       alert('소셜 로그인 중 문제가 발생했습니다. 다시 시도해주세요.')
  //     }
  //   }
  // },

  methods: {
    async handleLogin() {
      try {
        const response = await this.$http.post('/login', {
          username: this.username,
          password: this.password,
        })

        // Access Token과 Refresh Token 저장
        const accessToken = response.headers['access']
        if (!accessToken) {
          throw new Error('Access token not found in response headers')
        }
        localStorage.setItem('accessToken', accessToken)

        // 메인 페이지로 이동
        this.$router.push('/main')
      } catch (error) {
        alert(
          '로그인 실패: ' + error.response?.data?.message || '아이디와 비밀번호를 확인하여 주세요',
        )
      }
    },
    handleSocialLogin(provider) {
      const redirectUrl = {
        naver: 'http://localhost:8080/oauth2/authorization/naver',
        google: 'http://localhost:8080/oauth2/authorization/google',
      }
      window.location.href = redirectUrl[provider]
    },
  },
}
</script>

<style scoped>
/* 전체 컨테이너 스타일 */
.login-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
}

/* 타이틀 스타일 */
.login-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* 폼 스타일 */
.login-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  text-align: left;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.form-input {
  width: 100%;
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
}

.form-input:focus {
  border-color: #007bff;
}

/* 버튼 스타일 */
.login-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.login-button:hover {
  background-color: #0056b3;
}

/* 회원가입 링크 */
.signup-link {
  margin-top: 15px;
  font-size: 14px;
}

.signup-link a {
  color: #007bff;
  text-decoration: none;
}

.signup-link a:hover {
  text-decoration: underline;
}

/* 소셜 로그인 버튼 */
.social-login {
  margin-top: 20px;
}

.social-login p {
  font-size: 14px;
  color: #555;
  margin-bottom: 10px;
}

.social-button {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: opacity 0.3s;
  margin-bottom: 10px;
}

.social-button.naver {
  background-color: #03c75a;
  color: white;
}

.social-button.naver:hover {
  opacity: 0.8;
}

.social-button.google {
  background-color: #db4437;
  color: white;
}

.social-button.google:hover {
  opacity: 0.8;
}
</style>
