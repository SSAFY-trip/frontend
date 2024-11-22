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
    methods: {
      navigateToMain() {
        this.$router.push('/login')
      },
      navigateToUser() {
        this.$router.push('/login')
      },
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

.backgroundContent {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: black;
  border: 2px solid black;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s;
}

.backgroundContent:hover {
  background-color: white;
  color: black;
  border-color: black;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  filter: invert(0);
  transition: filter 0.3s;
}

.backgroundContent:hover .arrow-icon {
  filter: invert(1);
}

.circle-icon {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background-color: black;
  border: 2px solid black;
  cursor: pointer;
  transition: background-color 0.3s;
}

.circle-icon:hover {
  background-color: white;
  color: black;
  border-color: black;
}
.user-icon {
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
  transition: filter 0.3s;
}

.circle-icon:hover .user-icon {
  filter: brightness(0) invert(0);
}

.light-mode .user-icon {
  filter: brightness(0);
}
</style>
