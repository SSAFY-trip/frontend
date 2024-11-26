<template>
     <div class="container">
          <header class="header">
               <button @click="deselectEvent" class="back-arrow-button">
                    <img src="@/assets/icons/angle-arrow-left.svg" alt="Back" />
               </button>
               <div class="header-center">
                    <h1 class="section-title">{{ place.name }}</h1>
                    <span v-if="nonEmptyFields.category" class="category">{{ nonEmptyFields.category }}</span>
               </div>
               <div class="header-right">

                    <button class="add-button" @click="addPlaceToItinerary">
                         <img src="@/assets/icons/plus.svg" alt="Add" />
                    </button>
               </div>
          </header>

          <div class="detail-content">
               <div v-if="place.imageUrls && place.imageUrls.length" class="image-slider">
                    <div class="image-slider-content">
                         <img v-for="(url, index) in place.imageUrls" :key="index" :src="url"
                              :alt="`Image ${index + 1}`" @error="handleImageError($event, index)"
                              class="image-slide" />
                    </div>
               </div>

               <div class="fields-container">
                    <div v-for="(value, key) in filteredFields" :key="key" class="detail-field"
                         :class="{ 'horizontal': isHorizontalField(key) }">
                         <p class="field">{{ formatKey(key) }}</p>
                         <div v-if="Array.isArray(value)" class="array-value">
                              <ul>
                                   <li v-for="(item, index) in value" :key="index">{{ item }}</li>
                              </ul>
                         </div>
                         <a v-else-if="isUrl(value)" :href="value" target="_blank" rel="noopener noreferrer">
                              {{ value }}
                         </a>
                         <span v-else class="detail-value">{{ formatValue(value) }}</span>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import { createEvent } from "@/utils/eventAPI";

const props = defineProps({
     place: {
          type: Object,
          required: true,
          default: () => ({}),
     },
     date: {
          type: String,
          required: true,
     }
});

const route = useRoute();
const store = useStore();

onMounted(() => {
     console.log(props.place);
});

const nonEmptyFields = computed(() => {
     const excludedKeys = ["placeId", "latitude", "longitude", "name"];
     return Object.fromEntries(
          Object.entries(props.place)
               .filter(([key, value]) => isValid(value) && !excludedKeys.includes(key))
     );
});

const filteredFields = computed(() => {
     const { category, imageUrls, ...rest } = nonEmptyFields.value;
     return rest;
});

function isValid(value) {
     return value !== null && value !== undefined && value !== "" && !(Array.isArray(value) && !value.length);
}

function formatKey(key) {
     const labels = {
          address: "주소",
          roadAddress: "도로명 주소",
          zipCode: "우편번호",
          telephone: "전화번호",
          menus: "메뉴",
          canParkFlag: "주차 가능 여부",
          runsTwentyFourSevenFlag: "24시간 운영 여부",
          runsYearLongFlag: "연중무휴 여부",
          homepageUrl: "홈페이지 URL",
          description: "설명",
          additionalInfo: "추가 정보",
     };
     return labels[key] || key;
}

function formatValue(value) {
     return typeof value === "boolean" ? (value ? "예" : "아니요") : value;
}

function isUrl(value) {
     return typeof value === "string" && value.startsWith("http");
}

function handleImageError(event, index) {
     props.place.imageUrls.splice(index, 1);
}

function isHorizontalField(key) {
     return ['zipCode', 'telephone', 'canParkFlag', 'runsTwentyFourSevenFlag', 'runsYearLongFlag'].includes(key);
}

async function addPlaceToItinerary() {
     try {
          const tripId = route.params.tripId;
          const response = await createEvent(
               tripId,
               props.place.name,
               props.date,
               props.place.latitude,
               props.place.longitude,
               props.place.category,
               props.place.placeId
          );

          store.commit("addEvent", {
               date: props.date,
               newEvent: response.data,
               newEventDetails: props.place,
          });

          alert("일정 추가가 성공적으로 이루어졌습니다.");
     } catch (error) {
          console.error("Error creating event:", error);
          alert("일정 추가 도중 에러가 발생했습니다.");
     }
}

function deselectEvent() {
     // Implement the logic to go back or deselect the event
}
</script>

<style scoped>
.container {
     max-width: 100%;
     margin: 0 auto;
     padding: 20px;
     font-family: Arial, sans-serif;
}

.header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 20px;
}

.section-title {
     font-size: 20px;
     font-weight: bold;
     margin: 0;
     flex-grow: 1;
     text-align: center;
}

.header-right {
     display: flex;
     align-items: center;
}
.header-center{
     display: flex;
     flex-direction: column;
}

.category {
     font-size: 13px;
     color: #666;
     margin-right: 10px;
}

.back-arrow-button,
.add-button {
     background: none;
     border: none;
     cursor: pointer;
}

.add-button {
     /* background-color: #000; */
     border-radius: 50%;
     width: 50px;
     height: 50px;
     display: flex;
     justify-content: center;
     align-items: center;
     color: white;
}

.add-button img {
     filter: invert(1);
}

.detail-content {
     background-color: #f8f8f8;
     border-radius: 10px;
     padding: 20px;
}

.image-slider {
     margin-bottom: 20px;
     overflow-x: auto;
     white-space: nowrap;
     -webkit-overflow-scrolling: touch;
     scrollbar-width: none;
     -ms-overflow-style: none;
}

.image-slider::-webkit-scrollbar {
     display: none;
}

.image-slider-content {
     display: inline-flex;
     gap: 10px;
}

.image-slide {
     width: 300px;
     height: 200px;
     object-fit: cover;
     border-radius: 5px;
}

.fields-container {
     display: flex;
     flex-wrap: wrap;
     gap: 15px;
}

.detail-field {
     flex-basis: 100%;
}

.detail-field.horizontal {
     flex-basis: calc(50% - 7.5px);
     display: flex;
     align-items: center;
}

.field {
     font-weight: bold;
     margin-bottom: 5px;
}

.horizontal .field {
     flex: 0 0 auto;
     width: 120px;
     margin-bottom: 0;
     margin-right: 10px;
}

.horizontal .detail-value {
     flex: 1;
}

.array-value ul {
     margin: 0;
     padding-left: 20px;
}

a {
     color: #0066cc;
     text-decoration: none;
}

a:hover {
     text-decoration: underline;
}
</style>