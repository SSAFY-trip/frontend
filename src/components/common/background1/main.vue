<template>
  <div class="background-container">
    <BackgroundTop />
    <BackgroundBottom />
  </div>
</template>

<script>
import BackgroundTop from '@/components/common/background1/backgroundTop.vue'
import BackgroundBottom from '@/components/common/background1/backgroundBottom.vue'

export default {
  name: 'BackgroundMain',
  components: {
    BackgroundTop,
    BackgroundBottom,
  },
}
console.log('main')
</script>

<style scoped>
.background-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  /* min-height: 100vh; */
  position: relative;
}
</style>
