<template>
  <div class="login-container">
    <BackgroundMain />
    <main class="login-main">
      <div class="login-content">
        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="username">아이디</label>
            <input
              type="text"
              id="username"
              v-model="username"
              class="form-input"
              placeholder="아이디를 입력해주세요"
              required
            />
          </div>
          <div class="form-group">
            <label for="password">비밀번호</label>
            <input
              type="password"
              id="password"
              v-model="password"
              class="form-input"
              placeholder="비밀번호를 입력해주세요"
              required
            />
          </div>
          <button type="submit" class="login-button">
            로그인하기<img src="/public/navigation/arrow.svg" alt="arrow icon" class="arrow-icon" />
          </button>
        </form>
        <p class="signup-link">
          계정이 없으신가요?
          <router-link to="/signup" class="signup-link-btn">회원가입하러 가기</router-link>
        </p>
        <div class="social-login">
          <p>SNS 계정으로 로그인하기</p>
          <div class="social-buttons">
            <button class="social-button facebook" @click="handleSocialLogin('naver')">N</button>
            <button class="social-button google" @click="handleSocialLogin('google')">G</button>
          </div>
        </div>
      </div>
      <div class="signup-section">
        <p class="signup-text">계정이 없으신가요?</p>
        <button class="signup-button" @click="navigateToSignup">
          회원가입 하러 가기
          <img src="/public/navigation/arrow.svg" alt="arrow icon" class="signup-arrow-icon" />
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import BackgroundMain from '@/components/common/background1/main.vue'

export default {
  name: 'LoginPage',
  components: {
    BackgroundMain,
  },

  data() {
    return {
      username: '',
      password: '',
    }
  },

  methods: {
    navigateToSignup() {
      this.$router.push('/signup')
    },
    async handleLogin() {
      try {
        const response = await this.$http.post('/login', {
          username: this.username,
          password: this.password,
        })

        const accessToken = response.headers['access']
        if (!accessToken) {
          throw new Error('Access token not found in response headers')
        }
        localStorage.setItem('accessToken', accessToken)

        this.$router.push('/main')
      } catch (error) {
        alert('로그인 실패: 아이디와 비밀번호를 확인해 주세요.')
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
.login-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  margin: 20px;
}

.login-main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
}

.login-content {
  position: absolute;
  top: 50%;
  left: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  width: calc(30% + 100px);
  margin-right: -100px;
  background-color: #f8f6f6;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transform: translate(-50%, -50%);
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60%;
  gap: 20px;
}

.form-group {
  text-align: left;
  width: 100%;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  padding: 10px 5px;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #000;
  outline: none;
  background-color: transparent;
  transition: border-color 0.3s;
  width: 100%;
}

.form-input:focus {
  border-color: #007bff;
}

.login-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 60%;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: black;
  border: none;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}
.arrow-icon {
  width: 16px;
  height: 16px;
  filter: invert(0);
}
.login-button:hover {
  background-color: #007bff;
  color: white;
}

.signup-link {
  margin-top: 20px;
  font-size: 14px;
  color: #555;
}

.signup-link-btn {
  color: #007bff;
  text-decoration: none;
  font-weight: bold;
}

.signup-link-btn:hover {
  text-decoration: underline;
}

.social-login {
  margin-top: 20px;
  border-top: 1px solid #b9b9b9;

  width: 80%;
}

.social-login p {
  margin-top: 30px;
  font-size: 14px;
  color: #555;
  margin-bottom: 15px;
}

.social-buttons {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-button {
  width: 50px;
  height: 50px;
  font-size: 24px;
  font-weight: bold;
  border-radius: 50%;
  border: none;
  cursor: pointer;
  transition: opacity 0.3s;
}

.social-button.facebook {
  background-color: rgb(32, 232, 82);
  color: white;
}

.social-button.apple {
  background-color: black;
  color: white;
}

.social-button.google {
  background-color: black;
  color: white;
}

.social-button:hover {
  opacity: 0.8;
}
.signup-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 80px;
  margin-top: -100px;
}

.signup-text {
  font-size: 40px;
  font-weight: 700;
  color: black;
  text-align: center;
}

.signup-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}

.signup-button:hover {
  background-color: black;
  color: white;
}

.signup-arrow-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0);
  transition: filter 0.3s;
}

.signup-button:hover .signup-arrow-icon {
  filter: invert(0);
  transition: filter 0.3s;
}
</style>
