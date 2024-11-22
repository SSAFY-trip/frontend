<template>
  <div>
    <h1>메인 페이지</h1>
    <h2>여행 좋아요 관리</h2>
    <ul>
      <li v-for="trip in trips" :key="trip.id">
        {{ trip.name }}
        <button @click="removeTrip(trip.id)">좋아요 취소</button>
      </li>
    </ul>
    <div>
      <h3>좋아요 추가하기</h3>
      <input v-model="newTripId" placeholder="추가할 여행 ID" />
      <button @click="addTrip">좋아요 추가</button>
    </div>
    <button @click="fetchLikedTrips">좋아요한 여행 목록 새로고침</button>
  </div>
</template>

<script>
import axiosInstance from '@/utils/axios'

export default {
  name: 'MainPage',
  data() {
    return {
      trips: [], // 좋아요한 여행 목록
      newTripId: '', // 추가할 여행 ID
    }
  },
  async created() {
    await this.fetchLikedTrips() // 페이지 로드 시 좋아요 목록 가져오기
  },
  methods: {
    async fetchLikedTrips() {
      try {
        const response = await axiosInstance.get('/user-like-trip/user')
        this.trips = response.data
      } catch (error) {
        console.error('좋아요한 여행 조회 중 오류 발생:', error)
      }
    },
    async addTrip() {
      if (!this.newTripId) {
        alert('추가할 여행 ID를 입력하세요.')
        return
      }
      try {
        await axiosInstance.post(`/user-like-trip/${this.newTripId}`)
        await this.fetchLikedTrips()
        this.newTripId = ''
      } catch (error) {
        console.error('좋아요 추가 중 오류 발생:', error)
      }
    },
    async removeTrip(tripId) {
      try {
        await axiosInstance.post(`/user-like-trip/${tripId}`)
        await this.fetchLikedTrips()
      } catch (error) {
        console.error('좋아요 취소 중 오류 발생:', error)
      }
    },
  },
}
</script>
