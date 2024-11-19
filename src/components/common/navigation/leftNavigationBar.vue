<template>
  <nav :class="['content', theme]">
    <a href="/" class="nav-link">홈</a>
    <span class="separator">|</span>
    <a href="/add-trip" class="nav-link">여행 추가하기</a>
    <span class="separator">|</span>
    <a href="/recommended" class="nav-link">추천 여행</a>
  </nav>
</template>

<script>
export default {
  name: 'NavigationBar',
  props: {
    theme: {
      type: String,
      default: 'dark',
    },
  },
}
</script>

<style scoped>
.content {
  padding: 10px 20px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  border-radius: 24px;
  width: 50%;
  height: 30px;
  margin-left: 25px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.content.dark {
  background-color: black;
  color: white;
}

.content.light {
  background-color: white;
  color: black;
}

.nav-link {
  text-decoration: none;
  font-size: 16px;
  font-weight: 400;
  margin: 0 10px;
  transition:
    color 0.3s,
    font-weight 0.3s;
}

.content.dark .nav-link {
  color: white; /* 검은 배경의 하얀 텍스트 */
}

.content.light .nav-link {
  color: black; /* 흰 배경의 검은 텍스트 */
}

.nav-link:hover {
  color: #007bff; /* 파란색 */
  font-weight: 700; /* 두꺼운 텍스트 */
}

.separator {
  font-size: 16px;
  margin: 0 5px;
  transition: color 0.3s;
}

.content.dark .separator {
  color: white;
}

.content.light .separator {
  color: black;
}
</style>
