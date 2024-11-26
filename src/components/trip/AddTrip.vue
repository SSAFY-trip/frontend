<template>
  <div class="background-Bottom">
    <div class="login-title">여행 추가</div>
    <div class="login-subtitle">새로운 여행을 계획하시나요?</div>
    <div class="login-description">
      다음 정보를 입력하시고 Trippy에서 즐거운 여행 계쇡 경험 해보세요.
    </div>
  </div>
</template>

<script>
export default {
  name: 'AddTrip',
}
</script>

<style scoped>
.background-Bottom {
  background: url('/background1Bottom.svg') no-repeat center top;
  background-size: contain;
  width: 100%;
  height: 50vh;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  text-align: center;
}

.login-title {
  padding-bottom: 30px;
  padding-left: 50px;
  font-size: 80px;
  font-weight: bold;
  color: black;
  margin-bottom: 10px;
}

.login-subtitle {
  padding-left: 50px;
  font-size: 20px;
  color: #404040;
  margin-bottom: 5px;
}

.login-description {
  padding-left: 50px;
  font-size: 18px;
  color: #404040;
}
</style>
