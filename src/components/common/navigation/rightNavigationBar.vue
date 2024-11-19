<template>
  <div class="RightNavigationWrapper" :class="modeClass">
    <div class="backgroundContent">
      <!-- 텍스트와 화살표 -->
      <div class="main-link" @click="navigateToMain">
        <span class="nav-link">내 여행</span>
        <img src="/public/navigation/arrow.svg" alt="arrow icon" class="arrow-icon" />
      </div>
    </div>
    <!-- 검은색 원과 유저 아이콘 -->
    <div class="circle-icon" @click="navigateToUser">
      <img src="/public/navigation/user.svg" alt="user icon" class="user-icon" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'RightNavigationWrapper',
  props: {
    mode: {
      type: String,
      default: 'dark', // 기본값은 다크 모드
      validator: (value) => ['dark', 'light'].includes(value),
    },
  },
  methods: {
    navigateToMain() {
      // 메인 링크 클릭 시 이동
      window.location.href = '/login'
    },
    navigateToUser() {
      // 유저 아이콘 클릭 시 이동
      window.location.href = '/login'
    },
  },
  computed: {
    modeClass() {
      return this.mode === 'dark' ? 'dark-mode' : 'light-mode'
    },
  },
}
</script>

<style scoped>
.RightNavigationWrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

/* 전체 컨테이너 */
.backgroundContent {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 15px; /* 텍스트와 원 간 간격 */
  padding: 10px 20px;
  border-radius: 24px;
  transition:
    background-color 0.3s,
    color 0.3s;
}

/* 다크 모드 */
.dark-mode .backgroundContent {
  background-color: black; /* 배경색 검정 */
  color: white; /* 텍스트와 아이콘 흰색 */
}
.dark-mode .circle-icon {
  background-color: black; /* 배경색 검정 */
  color: white; /* 텍스트와 아이콘 흰색 */
}

/* 라이트 모드 */
.light-mode .backgroundContent {
  background-color: white; /* 배경색 흰색 */
  color: black; /* 텍스트와 아이콘 검정 */
}
.light-mode .circle-icon {
  background-color: white; /* 배경색 흰색 */
  color: black; /* 텍스트와 아이콘 검정 */
}

/* 텍스트와 화살표 그룹 */
.main-link {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer; /* 클릭 가능 */
}

.nav-link {
  font-size: 16px;
  font-weight: 400;
  transition: color 0.3s;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

/* 검은색 원과 유저 아이콘 */
.circle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%; /* 원형 */
  background-color: currentColor; /* 텍스트 색상과 동일 */
  cursor: pointer;
  transition: background-color 0.3s;
}

.user-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1); /* 아이콘 색상 반전 */
}

.light-mode .user-icon {
  filter: brightness(0); /* 라이트 모드에서는 검은색 */
}
</style>
