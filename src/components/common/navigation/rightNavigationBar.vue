<template>
  <div class="RightNavigationWrapper" :class="modeClass">
    <div class="backgroundContent main-link" @click="navigateToMain">
      <span class="nav-link">내 여행</span>
      <img src="/public/navigation/arrow.svg" alt="arrow icon" class="arrow-icon" />
    </div>
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
      default: 'dark',
      validator: (value) => ['dark', 'light'].includes(value),
    },
  },
  methods: {
    navigateToMain() {
      this.$router.push('/my-trip')
    },
    navigateToUser() {
      this.$router.push('/login')
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
/* 공통 스타일 */
.RightNavigationWrapper {
  display: flex;
  align-items: center;
  gap: 15px;
}

.backgroundContent {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border-radius: 24px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  transition: filter 0.3s ease;
}

.circle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 46px;
  height: 46px;
  border-radius: 50%;
  cursor: pointer;
  transition: all 0.3s ease;
}

.user-icon {
  width: 20px;
  height: 20px;
  transition: filter 0.3s ease;
}

/* 다크 모드 */
.dark-mode .backgroundContent {
  background-color: black;
  color: white;
  border: 2px solid black;
}

.dark-mode .backgroundContent:hover {
  background-color: white;
  color: black;
  border-color: black;
}

.dark-mode .arrow-icon {
  filter: invert(0);
}

.dark-mode .backgroundContent:hover .arrow-icon {
  filter: invert(1);
}

.dark-mode .circle-icon {
  background-color: black;
  border: 2px solid black;
}

.dark-mode .circle-icon:hover {
  background-color: white;
  border-color: black;
}

.dark-mode .user-icon {
  filter: brightness(0) invert(1);
}

.dark-mode .circle-icon:hover .user-icon {
  filter: brightness(0);
}

/* 라이트 모드 */
.light-mode .backgroundContent {
  background-color: white;
  color: black;
  border: 2px solid white;
}

.light-mode .backgroundContent:hover {
  background-color: blueviolet;
  color: white;
  border-color: white;
}

.light-mode .arrow-icon {
  filter: brightness(0);
}

.light-mode .backgroundContent:hover .arrow-icon {
  filter: brightness(0) invert(1);
}

.light-mode .circle-icon {
  background-color: white;
  border: 2px solid white;
}

.light-mode .circle-icon:hover {
  background-color: blueviolet;
  border-color: white;
}

.light-mode .user-icon {
  filter: brightness(0);
}

.light-mode .circle-icon:hover .user-icon {
  filter: brightness(0) invert(1);
}
</style>
