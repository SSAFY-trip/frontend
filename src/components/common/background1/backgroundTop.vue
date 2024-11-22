<template>
  <div class="backgroundWrapper">
    <div class="background-top"><LeftNavigationBar theme="dark" /></div>
    <div class="temp">
      <router-link to="/" class="logo">Trippy</router-link>
    </div>
    <div class="temp">
      <RightNavigationBar mode="dark" />
    </div>
  </div>
</template>

<script>
import LeftNavigationBar from '@/components/common/navigation/leftNavigationBar.vue'
import RightNavigationBar from '@/components/common/navigation/rightNavigationBar.vue'

export default {
  name: 'BackgroundTop',
  components: {
    LeftNavigationBar,
    RightNavigationBar,
  },
}
</script>

<style scoped>
.backgroundWrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.background-top {
  background: url('/background1Top.svg') no-repeat left top;
  background-size: contain;
  width: 100%;
  height: 10vh;
  display: flex;
  align-items: center;
}

.backgroundContent {
  padding: 10px 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 24px;

  height: 30px;
  transition:
    background-color 0.3s,
    color 0.3s;
  background-color: black;
  color: white;
}

.arrow-icon {
  width: 24px;
  height: 24px;
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: #000;
  text-decoration: none;
}

.temp {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
