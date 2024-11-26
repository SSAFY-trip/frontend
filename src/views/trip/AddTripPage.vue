<template>
  <div class="login-container">
    <div class="background-container">
      <BackgroundTop />
      <AddTrip />
    </div>
    <main class="login-main">
      <div class="login-content">
        <form @submit.prevent="submitTripData" class="login-form">
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
            <label>여행 공개 여부</label>
            <div class="toggle-buttons">
              <button
                class="toggle-button"
                :class="{ active: isPublic }"
                @click.prevent="togglePublic(true)"
              >
                공개
              </button>
              <button
                class="toggle-button"
                :class="{ active: !isPublic }"
                @click.prevent="togglePublic(false)"
              >
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

          <button type="submit" class="login-button" @click="submitTripData">
            여행 추가하기
            <img src="/public/navigation/arrow.svg" alt="arrow icon" class="arrow-icon" />
          </button>
        </form>
      </div>
      <div class="signup-section">
        <p class="signup-text">다른 사람의</p>
        <p class="signup-text">여행 기록을 보시겠어요?</p>
        <button class="signup-button" @click="navigateToSignup">
          추천 여행 보기
          <img src="/public/navigation/arrow.svg" alt="arrow icon" class="signup-arrow-icon" />
        </button>
      </div>
    </main>
  </div>
</template>

<script>
import BackgroundTop from '@/components/common/background1/backgroundTop.vue'
import axiosInstance from '@/utils/axios'
import AddTrip from '@/components/trip/AddTrip.vue'
export default {
  name: 'AddTripPage',
  components: {
    BackgroundTop,
    AddTrip,
  },

  data() {
    return {
      sidos: [],
      guguns: [],
      selectedSido: '',
      selectedGugun: '',
      isPublic: true,
      previewImage: null,
      selectedFile: null,
      tripName: '',
      startDate: '',
      endDate: '',
      tripOverview: '',
    }
  },
  async mounted() {
    const response = await axiosInstance.get('/locations/sidos/guguns')
    this.sidos = response.data
  },

  methods: {
    navigateToSignup() {
      this.$router.push('/recommended')
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
      this.guguns = selectedSidoData ? selectedSidoData.guguns : []
      this.selectedGugun = ''
    },
    handleGugunChange() {
      const selectedGugunData = this.guguns.find((gugun) => gugun.gugunCode === this.selectedGugun)
      this.gugunNo = selectedGugunData ? selectedGugunData.no : ''
    },
    async submitTripData() {
      try {
        const formData = new FormData()
        formData.append('name', this.tripName)
        formData.append('startDate', this.startDate)
        formData.append('endDate', this.endDate)
        formData.append('tripOverview', this.tripOverview)
        formData.append('isPublic', this.isPublic)
        formData.append('no', this.gugunNo)
        formData.append('image', this.selectedFile)

        await axiosInstance.post('/trips', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })

        alert('여행이 추가되었습니다!')
      } catch (error) {
        console.error(error)
        alert('여행 추가에 실패했습니다.')
      }
    },
  },
}
</script>

<style scoped>
.background-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  position: relative;
}
.login-container {
  max-width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: 'Arial', sans-serif;
  margin-left: 15px;
  margin-right: 15px;
  transform: translateY(10px);
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
.login-main {
  display: flex;
  justify-content: center;
  align-items: center;
}
.date-inputs {
  display: flex;
  align-items: center;
  gap: 10px;
}
.divider {
  font-size: 18px;
  font-weight: bold;
  color: #666;
  margin: 0 10px;
}
.login-content {
  position: absolute;
  top: 55%;
  left: 70%;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 40px;
  width: calc(30% + 100px);
  margin-right: -100px;
  background-color: #f8f6f6;
  border-radius: 15px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  text-align: center;
  transform: translate(-50%, -50%);
  height: 600px;
  overflow: scroll;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.login-content::-webkit-scrollbar {
  display: none;
}
.login-form {
  width: 80%;
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

.form-group {
  text-align: left;
  width: 100%;
  margin-bottom: 20px;
}

label {
  font-size: 14px;
  font-weight: bold;
  margin-bottom: 5px;
  display: block;
}

.form-input {
  padding: 10px 5px;
  font-size: 14px;
  border: none;
  border-bottom: 1px solid #000;
  background-color: transparent;
  outline: none;
  width: 100%;
}

.form-input:focus {
  border-color: #007bff;
}

.photo-upload {
  width: 100%;
  height: 150px;
  background-color: #ebebeb;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
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
  object-fit: cover;
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

.login-button {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: 500;
  border: 2px solid black;
  border-radius: 24px;
  cursor: pointer;
  transition:
    background-color 0.3s,
    color 0.3s,
    border-color 0.3s,
    filter 0.3s;
  background-color: black;
  color: white;
  width: 100%;
  justify-content: center;
}
.login-button:hover {
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
.arrow-icon {
  width: 16px;
  height: 16px;
  margin-left: 10px;
}

.login-button:hover .arrow-icon {
  filter: invert(1);
}
.signup-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: absolute;
  left: 80px;
  margin-top: 100px;
}

.signup-text {
  font-size: 40px;
  font-weight: 700;
  color: black;
  text-align: center;
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
</style>
