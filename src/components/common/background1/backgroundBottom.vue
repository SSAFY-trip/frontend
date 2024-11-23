<template>
  <div class="background-Bottom">
    <div class="login-title">Login</div>
    <div class="login-subtitle">다시 오신 것을 환영합니다</div>
    <div class="login-description">Trippy에서 즐거운 여행 계획 경험 되길 바랍니다.</div>
  </div>
</template>

<script>
export default {
  name: 'BackgroundBottom',
}
</script>

<style scoped>
.background-Bottom {
  background: url('/background1Bottom.svg') no-repeat center top;
  background-size: contain;
  width: 100%;
  height: 50vh; /* 상단 배경 높이 */

  display: flex;
  flex-direction: column; /* 수직 정렬 */
  justify-content: center; /* 가운데 정렬 */
  align-items: flex-start; /* 가운데 정렬 */
  text-align: center; /* 텍스트 가운데 정렬 */
}

.login-title {
  padding-bottom: 30px;
  padding-left: 50px;
  font-size: 80px; /* Login 글자 크기 */
  font-weight: bold; /* 굵은 글씨 */
  color: black; /* 검은색 */
  margin-bottom: 10px; /* 아래 여백 */
}

.login-subtitle {
  padding-left: 50px;
  font-size: 20px; /* 부제목 크기 */
  color: #404040; /* 회색 */
  margin-bottom: 5px; /* 아래 여백 */
}

.login-description {
  padding-left: 50px;
  font-size: 18px; /* 설명 크기 */
  color: #404040; /* 회색 */
}
</style>
