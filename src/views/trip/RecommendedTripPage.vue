<template>
  <div class="main-container">
    <header class="header">
      <div class="background-container">
        <div class="navigation">
          <nav class="LeftNavigation">
            <button class="nav-link" @click="navigateTo('/')">홈</button>
            <span class="separator">|</span>
            <button class="nav-link" @click="navigateTo('/add-trip')">여행 추가하기</button>
            <span class="separator">|</span>
            <button class="nav-link" @click="navigateTo('/recommended')">추천 여행</button>
          </nav>
          <router-link to="/" class="logo">Trippy</router-link>
          <div class="RightNavigationWrapper" :class="modeClass">
            <div class="backgroundContent main-link" @click="navigateToMain">
              <span class="nav-link">내 여행</span>
              <img src="/public/navigation/arrow.svg" alt="arrow icon" class="arrow-icon" />
            </div>
            <div class="circle-icon" @click="navigateToUser">
              <img src="/public/navigation/user.svg" alt="user icon" class="user-icon" />
            </div>
          </div>
        </div>
        <h1 class="recommend-title">추천 여행</h1>

        <div class="location-selectors">
          <div class="location-inner">
            <div class="location-item">
              <select v-model="selectedSido" @change="handleSidoChange">
                <option value="" disabled selected>시 · 도</option>
                <option v-for="sido in sidos" :key="sido.sidoCode" :value="sido.sidoCode">
                  {{ sido.sidoName }}
                </option>
              </select>
            </div>
            <div class="location-item">
              <select
                v-model="selectedGugun"
                @change="handleGugunChange"
                :disabled="!guguns.length"
              >
                <option value="" disabled selected>시 · 군 · 구</option>
                <option v-for="gugun in guguns" :key="gugun.gugunCode" :value="gugun.gugunCode">
                  {{ gugun.gugunName }}
                </option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>

    <section class="filters">
      <div class="duration-filters">
        <button
          class="duration-filter"
          :class="{ active: selectedFilter === '전체' }"
          @click="filterTrips('전체')"
        >
          전체
        </button>
        <button
          class="duration-filter"
          :class="{ active: selectedFilter === '당일치기' }"
          @click="filterTrips('당일치기')"
        >
          당일치기
        </button>
        <button
          class="duration-filter"
          :class="{ active: selectedFilter === '1박 2일' }"
          @click="filterTrips('1박 2일')"
        >
          1박 2일
        </button>
        <button
          class="duration-filter"
          :class="{ active: selectedFilter === '2박 3일' }"
          @click="filterTrips('2박 3일')"
        >
          2박 3일
        </button>
        <button
          class="duration-filter"
          :class="{ active: selectedFilter === '3박 4일' }"
          @click="filterTrips('3박 4일')"
        >
          3박 4일
        </button>
        <button
          class="duration-filter"
          :class="{ active: selectedFilter === '그 이상' }"
          @click="filterTrips('그 이상')"
        >
          그 이상
        </button>
      </div>
    </section>

    <!-- 여행 목록 섹션 -->
    <div class="trip-list">
      <div class="trip-card" v-for="trip in filteredTrips" :key="trip.id">
        <div class="trip-header">
          <div class="trip-name">{{ trip.name }}</div>
          <img v-if="trip.imgUrl" :src="trip.imgUrl" alt="Trip Image" class="trip-image" />
          <div v-else class="placeholder-image">No Image</div>
        </div>
        <div class="trip-details">
          <div class="trip-meta">
            <div class="trip-duration">
              {{ formatTripDuration(trip.startDate, trip.endDate) }}
            </div>
            <span>{{ trip.likeCount }} Likes</span>
          </div>
          <p>{{ trip.tripOverview }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getMostLikedTrips } from '@/utils/userLikeTripAPI'
import axiosInstance from '@/utils/axios'
export default {
  name: 'RecommendTrips',
  components: {},
  data() {
    return {
      sidos: [], // 시 · 도 데이터
      guguns: [], // 선택된 시 · 도의 구 · 군 데이터
      selectedSido: '', // 선택된 시 · 도
      selectedGugun: '', // 선택된 구 · 군
      trips: [], // 추천 여행 데이터
      filteredTrips: [], // 필터링된 여행 목록
    }
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route)
    },
    navigateToMain() {
      this.$router.push('/my-trip')
    },
    navigateToUser() {
      this.$router.push('/login')
    },
    handleSidoChange() {
      const selectedSidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)
      this.guguns = selectedSidoData ? selectedSidoData.guguns : []
      this.selectedGugun = '' // 기존 선택된 구 · 군 초기화
    },
    formatTripDuration(startDate, endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      const differenceInMs = end - start
      const days = differenceInMs / (1000 * 60 * 60 * 24) + 1

      if (days === 1) {
        return '당일치기'
      }

      const nights = days - 1
      return `${nights}박 ${days}일`
    },
    filterTrips(filter) {
      this.selectedFilter = filter // 선택된 필터 업데이트
      if (filter === '전체') {
        this.filteredTrips = [...this.trips]
      } else if (filter === '그 이상') {
        this.filteredTrips = this.trips.filter((trip) => {
          const duration = this.formatTripDuration(trip.startDate, trip.endDate)
          const [nights] = duration.split('박')
          return parseInt(nights, 10) >= 4
        })
      } else {
        this.filteredTrips = this.trips.filter((trip) => {
          return this.formatTripDuration(trip.startDate, trip.endDate) === filter
        })
      }
    },
  },
  async mounted() {
    try {
      const response = await getMostLikedTrips()
      this.trips = response.data

      const response2 = await axiosInstance.get('/locations/sidos/guguns')
      this.sidos = response2.data
      this.filterTrips('전체')
      console.log(response2)
    } catch (error) {
      console.error('추천 여행 데이터를 불러오는 데 실패했습니다.', error)
    }
  },
}
</script>

<style scoped>
.RightNavigationWrapper {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: flex-end;
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
.backgroundContent {
  background-color: white;
  color: black;
  border: 2px solid white;
}

.backgroundContent:hover {
  background-color: blueviolet;
  color: white;
  border-color: white;
}

.arrow-icon {
  filter: brightness(0);
}

.backgroundContent:hover .arrow-icon {
  filter: brightness(0) invert(1);
}

.circle-icon {
  background-color: white;
  border: 2px solid white;
}

.circle-icon:hover {
  background-color: blueviolet;
  border-color: white;
}

.user-icon {
  filter: brightness(0);
}

.circle-icon:hover .user-icon {
  filter: brightness(0) invert(1);
}
.main-container {
  font-family: Arial, sans-serif;
}

.header {
  background-image: url('/public/background2.svg');
  background-size: contain;
  background-position: center;
  text-align: center;
  color: white;
  padding: 20px 30px;
  height: 45vh;
  transform: translateY(10px);
  background-repeat: no-repeat;
}
.LeftNavigation {
  padding: 10px 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: nowrap;
  border-radius: 24px;
  border: 2px solid black;

  width: 100%;
  transition:
    background-color 0.3s,
    color 0.3s,
    padding 0.3s,
    gap 0.3s;
  background-color: white;
  border-color: white;
  color: black;
  width: 60%;
}
.nav-link {
  background: none;
  border: none;
  font-size: 14px;
  font-weight: 400;
  margin: 0 10px;
  color: inherit;
  cursor: pointer;
  transition:
    color 0.3s,
    font-weight 0.3s,
    margin 0.3s;
}

.nav-link:hover {
  font-weight: 800;
  color: #5580c9;
}

.separator {
  font-size: 16px;
  margin: 0 5px;
  transition: color 0.3s;
}

.background-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.navigation {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.navigation > .LeftNavigation {
  width: 350px;
}

.navigation > RightNavigationBar {
  justify-content: center; /* RightNavigationBar에 중앙 정렬 적용 */
  display: flex; /* 중앙 정렬이 동작하려면 flex 컨테이너로 설정 필요 */
}

.logo {
  font-size: 32px;
  font-weight: bold;
  color: white;
  text-decoration: none;
  margin-right: 150px;
}

.recommend-title {
  margin-top: 80px;
  font-size: 80px;
  font-weight: bold;
  line-height: 60px;
  color: black;
}

.filters {
  padding: 20px;
  text-align: center;
}

.location-filters {
  display: flex;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
}

.filter-select {
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

/* 필터 섹션 */
.duration-filters {
  display: flex;
  justify-content: center;
  gap: 10px;
  padding: 16px;
}

.duration-filter {
  background: none;
  border: 1px solid #ccc;
  padding: 10px 15px;
  border-radius: 40px;
  cursor: pointer;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
}

.duration-filter:hover {
  background-color: #f0f0f0;
}

/* 선택된 필터 스타일 */
.duration-filter.active {
  background-color: black;
  color: white;
  border: 1px solid black;
}

.location-selectors {
  margin-top: 90px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 600px;
  height: 60px;
  background-color: black;
  border-radius: 50px;
  position: relative;
}

.location-inner {
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
  align-items: center;
  gap: 10px;
}

.location-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 288px;
  height: 50px;
  background-color: black;
  border: 1px solid white;
  border-radius: 50px;
}

.location-item select {
  background: transparent;
  color: white;
  border: none;
  font-size: 14px;
  text-align: center;
  outline: none;
  appearance: none; /* 기본 브라우저 스타일 제거 */
  width: 90%; /* 텍스트 정렬 */
  height: 90%;
}

.location-item select:disabled {
  opacity: 0.5;
}
.trip-list {
  display: flex;
  gap: 36px;
  flex-wrap: wrap; /* 줄 바꿈 허용 */
  justify-content: center;
  padding: 16px;
}

.trip-card {
  display: flex;
  flex-direction: column;
  padding: 20px;
  justify-content: space-between;
  min-width: 300px;
  border-radius: 16px;
  background: #ffffff;
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.1),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;
}

/* 호버 효과 */
.trip-card:hover {
  transform: translateY(-6px);
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
}

.trip-image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.placeholder-image {
  width: 100%;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f0f0f0;
  color: #999;
}

.trip-details {
  padding: 16px;
}

.trip-name {
  font-size: 24px;
  font-weight: bold;
  line-height: 29.76px;
  text-align: left;
}

.trip-details p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.trip-duration {
  font-size: 18px;
  font-weight: 500;
  line-height: 23.76px;
  color: black;
}

.trip-meta {
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  font-size: 12px;
  color: #999;
}
</style>
