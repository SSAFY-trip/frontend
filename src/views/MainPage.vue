<template>
  <div>
    <h1>메인 페이지</h1>
    <p>환영합니다, {{ username }}님!</p>
    <a href="/login" class="nav-link">로그인</a>
    <button @click="logout">로그아웃</button>

    <h1>User Like Trip</h1>

    <div>
      <h2>여행 좋아요 업데이트</h2>
      <input v-model="tripId" type="number" placeholder="Trip ID" />
      <button @click="updateLikeTrip">좋아요 추가/삭제</button>
    </div>

    <div>
      <h2>사용자가 좋아요한 여행 목록</h2>
      <button @click="getLikedTrips">조회</button>
      <ul>
        <li v-for="trip in likedTrips" :key="trip.id">{{ trip.name }}</li>
      </ul>
    </div>

    <div>
      <h2>특정 여행을 좋아요한 사용자 목록</h2>
      <input v-model="selectedTripId" type="number" placeholder="Trip ID" />
      <button @click="getUsersWhoLikedTrip">조회</button>
      <ul>
        <li v-for="user in usersWhoLikedTrip" :key="user.id">{{ user.name }}</li>
      </ul>
    </div>
  </div>
</template>
<script>
import { updateLikeTrip, getLikedTrips, getUsersWhoLikedTrip } from '@/utils/userLikeTripAPI'

export default {
  name: 'MainPage',
  data() {
    return {
      username: '사용자',
      tripId: null,
      likedTrips: [],
      selectedTripId: null,
      usersWhoLikedTrip: [],
    }
  },
  async created() {
    await this.fetchLikedTrips()
  },
  methods: {
    async updateLikeTrip() {
      if (!this.tripId) {
        alert('Trip ID를 입력해주세요.')
        return
      }
      try {
        await updateLikeTrip(this.tripId)
        alert('좋아요 업데이트 완료!')
      } catch (error) {
        console.error('좋아요 업데이트 오류:', error)
        alert('좋아요 업데이트에 실패했습니다.')
      }
    },
    async getLikedTrips() {
      try {
        const response = await getLikedTrips()
        this.likedTrips = response.data
      } catch (error) {
        alert('목록 조회에 실패했습니다.')
      }
    },
    async getUsersWhoLikedTrip() {
      if (!this.selectedTripId) {
        alert('Trip ID를 입력해주세요.')
        return
      }
      try {
        const response = await getUsersWhoLikedTrip(this.selectedTripId)
        this.usersWhoLikedTrip = response.data
      } catch (error) {
        alert('목록 조회에 실패했습니다.')
      }
    },
  },
}
</script>

<style scoped>
h1 {
  margin-bottom: 20px;
}
h2 {
  margin: 20px 0 10px;
}
input {
  margin-right: 10px;
}
button {
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
}
li {
  margin: 5px 0;
}
</style>
