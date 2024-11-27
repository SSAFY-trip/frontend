<template>
  <div class="Wrapper">
    <div class="navigation-container">
      <TripNavigation :active-route="currentRoute" @navigate="handleNavigation" />
    </div>
    <div class="content-container">
      <div class="trip-wrapper">
        <div class="plan-container">
          <!-- <div class="title">여행 계획 수정하기</div> -->
          <div class="form-container">
            <!-- 왼쪽 섹션 -->
            <div class="left-section">
              <div class="form-group">
                <label for="trip-name">여행 이름</label>
                <input
                  type="text"
                  id="trip-name"
                  placeholder="Ex. 동기들과 가는 강릉 여행"
                  class="form-input"
                  v-model="tripName"
                  required
                />
              </div>

              <div class="form-group">
                <label>여행 사진</label>
                <div class="photo-upload" @click="triggerFileInput">
                  <img
                    v-if="previewImage"
                    :src="previewImage"
                    alt="Selected Image"
                    class="preview-image"
                  />
                  <img v-else src="/public/camera.svg" alt="Upload Icon" class="camera-icon" />
                  <input
                    type="file"
                    ref="photoInput"
                    @change="handleFileChange"
                    accept="image/*"
                    hidden
                  />
                </div>
              </div>
            </div>

            <!-- 오른쪽 섹션 -->
            <div class="right-section">
              <div class="form-group">
                <label>여행 기간</label>
                <div class="date-inputs">
                  <input type="date" placeholder="출발일" v-model="startDate" />
                  <span class="divider">|</span>
                  <input type="date" placeholder="도착일" v-model="endDate" />
                </div>
              </div>
              <div class="form-group">
                <label>여행 설명</label>
                <input
                  type="text"
                  placeholder="Ex. #경주여행 #야경명소 #동궁과월지 #첨성대"
                  class="form-input"
                  v-model="tripOverview"
                  required
                />
              </div>
              <div class="form-group">
                <label>여행 공개 여부</label>
                <div class="toggle-buttons">
                  <button
                    class="toggle-button"
                    :class="{ active: isPublic }"
                    @click="togglePublic(true)"
                  >
                    <img src="/public/lock1.svg" alt="공개" class="toggle-icon" />
                    공개
                  </button>
                  <button
                    class="toggle-button"
                    :class="{ active: !isPublic }"
                    @click="togglePublic(false)"
                  >
                    <img src="/public/lock2.svg" alt="비공개" class="toggle-icon" />
                    비공개
                  </button>
                </div>
              </div>
              <div class="form-group">
                <label>여행 장소</label>
                <div class="location-selectors">
                  <select v-model="selectedSido" @change="handleSidoChange">
                    <option value="" disabled selected>시 · 도</option>
                    <option v-for="sido in sidos" :key="sido.sidoCode" :value="sido.sidoCode">
                      {{ sido.sidoName }}
                    </option>
                  </select>
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
        </div>
        <div class="users-list-container">
          <h3>참여 중인 사용자</h3>
          <div class="users-grid">
            <div v-for="user in users" :key="user.id" class="trip-card">
              <p class="user-name">{{ user.name }}</p>
            </div>
          </div>
        </div>
        <button type="submit" class="upload-button" @click="updateTrip">
          여행 수정하기<img
            src="/public/navigation/arrow.svg"
            alt="arrow icon"
            class="arrow-icon"
          />
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/utils/axios'
import TripNavigation from '@/components/trip/TripNavigation.vue'
import { getUsersWhoLikedTrip } from '@/utils/userLikeTripAPI'
export default {
  name: 'TripSettingsPage',
  components: {
    TripNavigation,
  },
  data() {
    return {
      currentRoute: 'home',
      tripId: null,
      tripName: '',
      startDate: '',
      endDate: '',
      tripOverview: '',
      isPublic: true,
      previewImage: null,
      selectedFile: null,
      sidos: [],
      guguns: [],
      selectedSido: '',
      selectedGugun: '',
      gugunNo: '',
      users: [],
    }
  },
  async mounted() {
    this.tripId = this.$route.params.tripId
    await this.fetchLocations()
    await this.fetchTripDetails()
    await this.fetchGuguns()
    await this.getUsersWhoLikedTrip()
  },
  methods: {
    async getUsersWhoLikedTrip() {
      const response = await getUsersWhoLikedTrip(this.tripId)
      console.log(response, '11')
      this.users = response.data
    },

    async fetchTripDetails() {
      try {
        const response = await axiosInstance.get(`/trips/${this.tripId}`)
        const trip = response.data
        this.tripName = trip.name
        this.startDate = trip.startDate
        this.endDate = trip.endDate
        this.tripOverview = trip.tripOverview
        this.isPublic = trip.isPublic
        this.previewImage = trip.imgUrl
      } catch (error) {
        console.error('Error fetching trip details:', error)
      }
    },
    async fetchLocations() {
      try {
        const response = await axiosInstance.get('/locations/sidos/guguns')
        this.sidos = response.data
        const selectedSidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)
        this.guguns = selectedSidoData ? selectedSidoData.guguns : []
      } catch (error) {
        console.error('Error fetching locations:', error)
      }
    },
    async fetchGuguns() {
      try {
        const response = await axiosInstance.get(`/trip-gugun/${this.tripId}/guguns`)

        // API 응답 데이터 설정
        this.selectedSido = response.data.sidoCode
        this.selectedGugun = response.data.gugunCode

        console.log('Selected Sido:', this.selectedSido)
        console.log('Selected Gugun:', this.selectedGugun)

        // sidos에서 matching 되는 데이터를 찾음
        const selectedSidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)

        if (selectedSidoData) {
          this.guguns = selectedSidoData.guguns
          console.log('Updated Guguns:', this.guguns)
        } else {
          this.guguns = []
          console.warn('Sido not found for selectedSido:', this.selectedSido)
        }
      } catch (error) {
        console.error('Error fetching guguns:', error)
      }
    },
    async updateTrip() {
      try {
        const formData = new FormData()
        formData.append('name', this.tripName)
        formData.append('startDate', this.startDate)
        formData.append('endDate', this.endDate)
        formData.append('tripOverview', this.tripOverview)
        formData.append('isPublic', this.isPublic)
        formData.append('no', this.gugunNo)
        if (this.selectedFile) {
          formData.append('image', this.selectedFile)
        }
        // console.log('name', this.tripName)
        // console.log('startDate', this.startDate)
        // console.log('endDate', this.endDate)
        // console.log('tripOverview', this.tripOverview)
        // console.log('isPublic', this.isPublic)
        // console.log('no', this.gugunNo)
        // console.log('previewImage', this.previewImage)
        // console.log('image', this.selectedFile)
        await axiosInstance.patch(`/trips/${this.tripId}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        alert('여행 수정 완료!')
      } catch (error) {
        console.error('Error updating trip:', error)
      }
    },
    triggerFileInput() {
      this.$refs.photoInput.click()
    },
    handleFileChange(event) {
      const file = event.target.files[0]
      if (file) {
        this.selectedFile = file
        this.previewImage = URL.createObjectURL(file)
      }
    },
    togglePublic(value) {
      this.isPublic = value
    },
    handleSidoChange() {
      const selectedSidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)

      if (selectedSidoData) {
        this.guguns = selectedSidoData.guguns
        console.log('Guguns after Sido change:', this.guguns)
      } else {
        this.guguns = []
        console.warn('No guguns found for Sido:', this.selectedSido)
      }

      this.selectedGugun = ''
      this.gugunNo = ''
    },

    handleGugunChange() {
      const selectedGugunData = this.guguns.find((gugun) => gugun.gugunCode === this.selectedGugun)
      this.gugunNo = selectedGugunData ? selectedGugunData.no : ''
    },
  },
}
</script>

<style scoped>
.Wrapper {
  display: flex;
  background-color: #ebebeb;
}
.navigation-container {
  width: 100px;
}

.content-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.trip-wrapper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 80%;
  padding: 20px;
  min-width: 300px;
  border-radius: 16px;
  background: #ffffff;
  transition:
    box-shadow 0.3s ease,
    transform 0.3s ease;

  transform: translateY(-6px);
  box-shadow:
    4px 4px 8px rgba(0, 0, 0, 0.2),
    -4px -4px 8px rgba(255, 255, 255, 0.8);
}
.plan-container {
  padding-top: 20px;
  display: flex;
  gap: 50px;
  width: 100%;
  padding: 0px 50px;
  flex-direction: column;
  align-items: center;
}

.title {
  font-size: 50px;
  font-weight: bold;
  line-height: 60px;
}

.form-container {
  display: flex;
  gap: 100px;
  width: 100%;
}
.form-input {
  padding: 10px 5px;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #000;
  outline: none;
  background-color: transparent;
  transition: border-color 0.3s;
  width: 100%;
}

.form-input:focus {
  border-color: #007bff;
}

.left-section,
.right-section {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  margin-bottom: 20px;
}

label {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 10px;
  display: block;
}

.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}

.photo-upload {
  width: 100%;
  height: 150px;
  background-color: #ebebeb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.submit-button {
  margin-top: 20px;
  text-align: center;
}

.submit-button button {
  padding: 15px 30px;
  font-size: 16px;
  font-weight: bold;
  border: none;
  border-radius: 5px;
  background-color: black;
  color: white;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.upload-button {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 20%;
  margin-bottom: 20px;
  margin-top: 20px;
  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  color: white;
  background-color: black;
  border: none;
  border: 2px solid transparent;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.arrow-icon {
  width: 16px;
  height: 16px;
  filter: invert(0);
}

.upload-button:hover {
  background-color: white;
  border: 2px solid black;
  color: black;
}
.upload-button:hover .arrow-icon {
  filter: invert(1);
}
.location-selectors {
  display: flex;
  justify-content: flex-start;
  gap: 20px;
}
.location-selectors select {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 20%;

  padding: 12px 20px;
  font-size: 16px;
  font-weight: 500;
  color: black;
  background-color: white;
  border: 2px solid black;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.location-selectors select:focus {
  border-color: #007bff;
}

.location-selectors option {
  font-size: 14px;
  color: #000;
}
.toggle-buttons {
  display: flex;
  background-color: #f5f5f5;
  border: 2px solid #ccc;
  border-radius: 50px;
  overflow: hidden;
  transition:
    background-color 0.3s,
    border-color 0.3s;
}

.toggle-button {
  flex: 1;
  padding: 10px;
  font-size: 14px;
  font-weight: bold;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border: none;
  cursor: pointer;
  background-color: transparent;
  color: #000;
  transition:
    background-color 0.3s,
    color 0.3s;
}

.toggle-button.active {
  background-color: black;
  color: white;
}

.toggle-icon {
  width: 16px;
  height: 16px;
  transition: filter 0.3s;
}

.toggle-button.active .toggle-icon {
  filter: invert(1);
}
input[type='date'] {
  padding: 10px 5px;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #000;
  outline: none;
  background-color: transparent;
  transition: border-color 0.3s;
  width: 100%;
}

input[type='date']:focus {
  border-color: #007bff;
}

.divider {
  font-size: 18px;
  font-weight: bold;
  color: #666;
  margin: 0 10px;
}
.photo-upload {
  width: 100%;
  height: 280px;
  background-color: #ebebeb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  cursor: pointer;
}

.camera-icon {
  width: 40px;
  height: 40px;
  opacity: 0.5;
}

.preview-image {
  width: 100%;
  height: 100%;
  object-fit: cover; /* 이미지를 적절히 맞춤 */
}
.users-list-container h3 {
  text-align: center;

  font-size: 20px;
  font-weight: bold;
  color: #333;
}

.users-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.trip-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  padding: 15px;
  border-radius: 12px;
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

.user-name {
  font-size: 16px;
  font-weight: bold;
  color: #333;
}
</style>
