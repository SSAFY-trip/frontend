<template>
  <!-- first-section -->
  <div class="first-section">
    <div class="background-container" @click="scrollToSecondSection">
      <img src="/title.svg" alt="Overlay" class="overlay-image" />
      <div class="header">
        <div class="background-top">
          <LeftNavigationBar theme="light" />
        </div>
        <div class="temp">
          <router-link to="/" class="logo" :class="{ 'logo-active': isScrolled }">
            Trippy
          </router-link>
        </div>
        <div class="temp">
          <RightNavigationBar mode="light" />
        </div>
      </div>
    </div>
  </div>

  <!-- second-section-->
  <div class="second-section" ref="bottomSection">
    <div class="recommend-trip">
      <div class="bottom-header">
        <div class="bottom-header-header">추천 여행</div>
        <div class="bottom-header-content">
          <button class="signup-button" @click="navigateToSignup">
            더 보러 가기
            <img src="/public/navigation/arrow.svg" alt="arrow icon" class="signup-arrow-icon" />
          </button>
          <div class="bottom-header-text">다른 사용자들의 여행들을</div>
          <div class="bottom-header-text">보고 영감을 얻어보세요</div>
        </div>
      </div>
      <div class="bottom-content">
        <TripList :trips="trips" />
      </div>
    </div>
    <!-- 화살표 아이콘 -->
    <div class="arrow-container" @click="scrollToThirdSection">
      <img src="/public/navigation/arrow-down.svg" alt="Down Arrow" class="down-arrow-icon" />
    </div>
  </div>

  <!-- third-section -->
  <div class="third-section" ref="secondSection">
    <TravelPlanForm />
  </div>
</template>

<script>
import { getMostLikedTrips } from '@/utils/userLikeTripAPI'
import LeftNavigationBar from '@/components/common/navigation/leftNavigationBar.vue'
import RightNavigationBar from '@/components/common/navigation/rightNavigationBar.vue'
import TripList from '@/components/trip/TripList.vue'
import TravelPlanForm from '@/components/trip/TravelPlanForm.vue'
export default {
  name: 'MainPage',
  components: {
    LeftNavigationBar,
    RightNavigationBar,
    TripList,
    TravelPlanForm,
  },
  data() {
    return {
      isScrolled: false,
      trips: [],
    }
  },
  mounted() {
    this.getMostLikedTrips()
  },
  methods: {
    navigateToSignup() {
      this.$router.push('/recommended')
    },
    scrollToSecondSection() {
      const bottomSection = this.$refs.bottomSection
      bottomSection.scrollIntoView({ behavior: 'smooth' })
      this.isScrolled = true
    },
    scrollToThirdSection() {
      const secondSection = this.$refs.secondSection
      secondSection.scrollIntoView({ behavior: 'smooth' })
    },
    async getMostLikedTrips() {
      try {
        const response = await getMostLikedTrips()
        this.trips = response.data
        console.log(this.trips)
      } catch (error) {
        alert('목록 조회에 실패했습니다.')
      }
    },
  },
}
</script>

<style scoped>
.background-container {
  background-image: url('/main.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  width: 100%;
  height: 100vh;
  padding: 20px;
  overflow: hidden;
  position: relative;
  cursor: pointer;
}

.overlay-image {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 50%;
  height: auto;
  z-index: 1;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 97%;
  z-index: 10;
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}
.logo-active {
  color: black;
}

.first-section {
  height: 100vh;
}

.second-section {
  height: 100vh;
  background-color: white;
  color: black;
  text-align: center;
  position: relative;
}

.second-section h1 {
  font-size: 32px;
  font-weight: bold;
  margin-bottom: 20px;
}

.second-section input {
  margin-right: 10px;
}

.second-section button {
  margin-bottom: 20px;
}
.recommend-trip {
  height: 60vh;
  background-color: #ebebeb;
  display: flex;
  padding: 100px 20px 20px 20px;
}
.bottom-header {
  width: 20%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
}

.bottom-content {
  width: 80%;
  padding: 10px;
}
.bottom-header-header {
  font-size: 50px;
  font-weight: bold;
  line-height: 60px;
}
.signup-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s,
    filter 0.3s;
}

.signup-button:hover {
  background-color: black;
  color: white;
}

.signup-arrow-icon {
  width: 16px;
  height: 16px;
  filter: brightness(0);
}

.signup-button:hover .signup-arrow-icon {
  filter: invert(0);
}
.bottom-header-text {
  font-size: 16px;
  font-weight: 600;
  line-height: 19.8px;
}
.bottom-header-content {
  display: flex;
  flex-direction: column;
  align-items: center;
}

/* 화살표 아이콘 */
.arrow-container {
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  cursor: pointer;
}

.down-arrow-icon {
  width: 70px;
  height: 70px;
  transition: transform 0.3s ease;
}

.arrow-container:hover .down-arrow-icon {
  transform: translateY(8px);
}

.third-section {
  height: 100vh;
  background-color: #f9f9f9;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.third-section h2 {
  font-size: 32px;
  color: #333;
}

.third-section p {
  font-size: 18px;
  color: #666;
}
</style>
