<template>
  <div class="signup-container">
    <h1 class="signup-title">회원가입</h1>
    <form @submit.prevent="handleSignUp" class="signup-form">
      <div class="form-group">
        <label for="username">아이디</label>
        <input type="text" id="username" v-model="username" required />
      </div>

      <div class="form-group">
        <label for="password">비밀번호</label>
        <input type="password" id="password" v-model="password" required />
      </div>

      <div class="form-group">
        <label for="role">역할</label>
        <select id="role" v-model="role" required>
          <option value="ROLE_USER">일반 사용자</option>
          <option value="ROLE_ADMIN">관리자</option>
        </select>
      </div>

      <div class="form-group">
        <label for="nickname">닉네임</label>
        <input type="text" id="nickname" v-model="nickname" required />
      </div>

      <button type="submit" class="signup-button">회원가입</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      role: 'ROLE_USER',
      nickname: '',
    }
  },
  methods: {
    async handleSignUp() {
      try {
        await this.$http.post('/join', {
          username: this.username,
          password: this.password,
          role: this.role,
          name: this.nickname,
        })
        alert('회원가입 성공! 로그인 해주세요.')
        this.$router.push('/login')
      } catch (error) {
        alert('회원가입 실패: ' + error.response?.data?.message || '서버 오류')
        console.log('error', error)
      }
    },
  },
}
</script>

<style scoped>
/* 컨테이너 스타일 */
.signup-container {
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

/* 타이틀 스타일 */
.signup-title {
  text-align: center;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
}

/* 폼 스타일 */
.signup-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.form-group label {
  font-size: 14px;
  font-weight: bold;
  color: #555;
}

.form-group input,
.form-group select {
  padding: 10px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 5px;
  outline: none;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus {
  border-color: #007bff;
}

/* 버튼 스타일 */
.signup-button {
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

.signup-button:hover {
  background-color: #0056b3;
}
</style>
