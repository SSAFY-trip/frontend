<template>
  <div class="trip-container">
    <div class="trip-list">
      <div class="trip-card" v-for="trip in trips" :key="trip.id" @click="goToTrip(trip.id)">
        <div class="trip-header">
          <div class="trip-name">{{ trip.name }}</div>
          <img v-if="trip.imgUrl" :src="trip.imgUrl" alt="Trip Image" class="trip-image" />
          <div v-else class="placeholder-image">No Image</div>
        </div>
        <div class="trip-details">
          <div class="trip-meta">
            <div className="trip-duration">
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
export default {
  name: 'TripList',
  props: {
    trips: {
      type: Array,
      required: true,
    },
  },
  methods: {
    formatTripDuration(startDate, endDate) {
      const start = new Date(startDate)
      const end = new Date(endDate)

      // 날짜 차이 계산
      const differenceInMs = end - start
      const days = differenceInMs / (1000 * 60 * 60 * 24) + 1 // 하루 차이 포함

      if (days === 1) {
        return '당일치기'
      }

      const nights = days - 1 // 숙박일수 계산
      return `${nights}박 ${days}일`
    },
    goToTrip(tripId) {
      // Navigate to the trip's page.
      this.$router.push(`/visit/trip/${tripId}/main`);
    },
  },
}
</script>

<style scoped>
.trip-container {
  overflow-x: auto;
  white-space: nowrap;
  padding: 16px;
  height: 100%;
  scroll-behavior: smooth;
  /* 부드러운 스크롤 */
}

.trip-container::-webkit-scrollbar {
  height: 4px;
}

.trip-container::-webkit-scrollbar-track {
  background: #f0f0f0;
  border-radius: 8px;
}

.trip-container::-webkit-scrollbar-thumb {
  background: #c0c0c0;
  border-radius: 8px;
  transition: background-color 0.3s;
}

.trip-container::-webkit-scrollbar-thumb:hover {
  background: #888888;
}

.trip-container::-webkit-scrollbar-thumb:active {
  background: #555555;
}

.trip-list {
  display: flex;
  gap: 36px;
  height: 100%;
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
  height: 171px;
  color: #999;
  object-fit: cover;
  border-radius: 16px;
  margin-top: 16px;
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
  padding-bottom: 4px;
  padding-right: 4px;
  padding-left: 4px;
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

  /* 멀티라인 줄임표 처리 */
  display: -webkit-box;
  overflow: hidden;
  text-overflow: ellipsis;

  /* 2줄 제한 및 왼쪽 정렬 */
  -webkit-line-clamp: 2;
  /* 최대 2줄로 제한 */
  -webkit-box-orient: vertical;
  white-space: normal;
  /* 줄바꿈 허용 */
  text-align: left;
  /* 텍스트 왼쪽 정렬 */

  /* 줄 높이와 높이 제한 */
  line-height: 1.5em;
  /* 줄 높이 */
  max-height: calc(1.5em * 2);
  /* 최대 2줄 높이 */
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
