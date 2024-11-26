<template>
     <div class="container">
          <header class="header">
               <p class="section-title">{{ event.name }}</p>
               <span v-if="nonEmptyFields.category" class="category">{{ nonEmptyFields.category }}</span>
          </header>

          <div class="detail-content">
               <div v-if="nonEmptyFields.imageUrls" class="image-slider">
                    <div class="image-slider-wrapper">
                         <div class="image-slider-content">
                              <div v-for="(url, index) in nonEmptyFields.imageUrls" :key="index" class="image-slide">
                                   <img :src="url" :alt="'이미지 ' + (index + 1)" @error="handleImageError" />
                              </div>
                         </div>
                    </div>
               </div>

               <div class="fields-container">
                    <div v-for="(value, key) in filteredFields" :key="key" class="detail-field"
                         :class="{ 'horizontal': isHorizontalField(key) }">
                         <strong class="detail-key">{{ formatKey(key) }}</strong>
                         <div v-if="Array.isArray(value)" class="array-value">
                              <ul>
                                   <li v-for="(item, index) in value" :key="index">
                                        {{ item }}
                                   </li>
                              </ul>
                         </div>
                         <a v-else-if="isUrl(value)" :href="value" target="_blank" rel="noopener noreferrer">{{ value
                              }}</a>
                         <span v-else class="detail-value">{{ formatValue(value) }}</span>
                    </div>
               </div>
          </div>
     </div>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'

const props = defineProps({
     event: {
          type: Object,
          required: true,
          default: () => ({}),
     }
})

const store = useStore()

const nonEmptyFields = computed(() => {
     const excludedKeys = ["placeId", "latitude", "longitude", "name"]
     const eventDetails = store.getters.getEventDetails[props.event.placeId] || {}

     return Object.fromEntries(
          Object.entries(eventDetails)
               .filter(([key, value]) => isValid(value) && !excludedKeys.includes(key))
     )
})

const filteredFields = computed(() => {
     const { category, imageUrls, ...rest } = nonEmptyFields.value
     return rest
})

function isValid(value) {
     return (
          value !== null &&
          value !== undefined &&
          value !== "" &&
          !(Array.isArray(value) && !value.length)
     )
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
     }
     return labels[key] || key
}

function formatValue(value) {
     return typeof value === "boolean" ? (value ? "예" : "아니요") : value
}

function isUrl(value) {
     return typeof value === "string" && value.startsWith("http")
}

function handleImageError(event) {
     const parentDiv = event.target.parentNode
     parentDiv.parentNode.removeChild(parentDiv)
}

function isHorizontalField(key) {
     return ['zipCode', 'telephone', 'canParkFlag', 'runsTwentyFourSevenFlag', 'runsYearLongFlag'].includes(key)
}
</script>

<style scoped>
.container {
     width: 100%;
     height: 100%;
     font-family: Arial, sans-serif;
     position: relative;
     top: 0;
}

.header {
     display: flex;
     justify-content: space-between;
     align-items: center;
     margin-bottom: 20px;
}

.section-title {
     font-size: 22px;
     font-weight: bold;
     margin: 0;
}

.category {
     font-size: 16px;
     color: #666;
}

.detail-content {
     width: 100%;
}

.image-slider {
     width: 100%;
     overflow-x: auto;
     display: flex;
     gap: 10px;
     scroll-snap-type: x mandatory;
     margin-bottom: 20px;
}

.image-slider-wrapper {
     display: flex;
     flex-wrap: nowrap;
}

.image-slider-content {
     display: flex;
     height: auto;
}

.image-slide {
     flex-shrink: 0;
     width: 100%;
     max-width: 300px;
     height: auto;
     display: inline-block;
}

.image-slide img {
     width: 100%;
     height: 300px;
     object-fit: cover;
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

.detail-key {
     font-weight: bold;
     margin-right: 10px;
}

.horizontal .detail-key {
     flex: 0 0 auto;
     width: 120px;
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