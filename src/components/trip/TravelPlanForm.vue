<template>
  <div class="plan-container">
    <div class="title">새로운 여행 계획해보세요!</div>
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
            <button class="toggle-button" :class="{ active: isPublic }" @click="togglePublic(true)">
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
            <select v-model="selectedGugun" @change="handleGugunChange" :disabled="!guguns.length">
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
  <button type="submit" class="upload-button" @click="submitTripData">
    여행 추가하기<img src="/public/navigation/arrow.svg" alt="arrow icon" class="arrow-icon" />
  </button>
</template>

<script>
import axiosInstance from '@/utils/axios'
export default {
  name: 'TravelPlanForm',
  data() {
    return {
      sidos: [], // 시 · 도 데이터
      guguns: [], // 선택된 시 · 도의 구 · 군 데이터
      selectedSido: '', // 선택된 시 · 도
      selectedGugun: '', // 선택된 구 · 군
      selectedLocations: [], // 최종 선택된 위치
      isPublic: true,
      previewImage: null, // 선택한 이미지의 미리보기 URL
      selectedFile: null, // 선택된 파일
      tripName: '', // 여행 이름
      startDate: '', // 출발일
      endDate: '', // 도착일
      tripOverview: '', // 여행 설명
      gugunNo: '',
    }
  },
  async mounted() {
    const response = await axiosInstance.get('/locations/sidos/guguns')
    this.sidos = response.data
    console.log(response)
  },
  methods: {
    async submitTripData() {
      try {
        // 선택된 파일이 없을 경우 처리
        if (!this.selectedFile) {
          alert('이미지를 선택해주세요.')
          return
        }

        // FormData 생성
        const formData = new FormData()
        formData.append('name', this.tripName)
        formData.append('startDate', this.startDate)
        formData.append('endDate', this.endDate)
        formData.append('tripOverview', this.tripOverview)
        formData.append('isPublic', this.isPublic)
        formData.append('no', this.gugunNo)
        formData.append('image', this.selectedFile)

        // 백엔드로 데이터 전송
        await axiosInstance.post('/trips', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })

        alert('여행 추가 완료!')
      } catch (error) {
        console.error('여행 데이터 전송 실패:', error)
        alert('여행 데이터 전송에 실패했습니다.')
      }
    },
    triggerFileInput() {
      this.$refs.photoInput.click() // 숨겨진 파일 입력창 열기
    },
    handleFileChange(event) {
      const file = event.target.files[0] // 선택된 파일
      if (file) {
        this.selectedFile = file
        this.previewImage = URL.createObjectURL(file) // 미리보기 이미지 URL 생성
      }
    },
    togglePublic(value) {
      this.isPublic = value // 공개 여부 업데이트
    },
    // handleSidoChange() {
    //   // 시 · 도 변경 시, 해당 시 · 도의 구 · 군 데이터를 가져옵니다.
    //   const selectedSidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)
    //   this.guguns = selectedSidoData ? selectedSidoData.guguns : []
    //   this.selectedGugun = '' // 기존 선택된 구 · 군 초기화
    // },
    handleSidoChange() {
      const selectedSidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)
      this.guguns = selectedSidoData ? selectedSidoData.guguns : []
      this.selectedGugun = '' // 기존 선택된 구 · 군 초기화
      this.gugunNo = '' // 초기화
    },
    handleGugunChange() {
      // selectedGugun이 gugunCode로 설정된 값을 기준으로 guguns 배열에서 찾습니다.
      const selectedGugunData = this.guguns.find((gugun) => gugun.gugunCode === this.selectedGugun)
      this.gugunNo = selectedGugunData ? selectedGugunData.no : ''
    },

    addSelectedLocation() {
      if (this.selectedSido && this.selectedGugun) {
        const sidoData = this.sidos.find((sido) => sido.sidoCode === this.selectedSido)
        const gugunData = this.guguns.find((gugun) => gugun.gugunCode === this.selectedGugun)

        // 이미 추가된 위치인지 확인
        const exists = this.selectedLocations.some(
          (location) => location.gugunCode === gugunData.gugunCode,
        )

        if (!exists) {
          this.selectedLocations.push({
            sidoName: sidoData.sidoName,
            gugunName: gugunData.gugunName,
            gugunCode: gugunData.gugunCode,
          })
        }
      }
    },
  },
}
</script>

<style scoped>
.plan-container {
  display: flex;
  gap: 50px;
  width: 100%;
  height: 100%;
  margin-top: 100px;
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
  margin-bottom: 50px;
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
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 20%;
  margin-bottom: 50px;
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
</style>
