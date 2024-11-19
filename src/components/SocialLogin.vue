<template>
  <div>
    <h2>소셜 로그인</h2>
    <button @click="loginWithGoogle">구글 로그인</button>
    <button @click="loginWithNaver">네이버 로그인</button>
  </div>
</template>

<script>
export default {
  methods: {
    loginWithGoogle() {
      window.location.href = "/oauth2/authorization/google";
    },
    loginWithNaver() {
      window.location.href = "/oauth2/authorization/naver";
    },
  },
};
</script>
