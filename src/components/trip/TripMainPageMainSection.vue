<template>
     <div class="trip-main-section">
          <div class="title">
               <h1>경경주경주경주경주경주경주경주</h1>
               <h5>24.01.22 ~ 24.01.26 (4박 5일)</h5>
               <h5>경주 | 부산 | 울산</h5>
          </div>
          <!-- <img :src="shapeSrc" alt="Trip Main Shape" /> -->
          <!-- SVG 1 -->
          <svg viewBox="0 0 200 200" class="svg-shape" v-html="shapeTop">

          </svg>

          <!-- SVG 2 -->
          <svg viewBox="0 0 200 200" class="svg-shape" v-html="shapeBottom">

          </svg>
     </div>

</template>

<script>
import axios from 'axios';
import tripMainImgShape from '@/assets/shapes/trip-main-img.svg';
import shapeTopSvg from "@/assets/shapes/trip-img-shape-top.svg";
import shapeBottomSvg from "@/assets/shapes/trip-img-shape-bottom.svg";

export default {
     name: "TripMainPageMainSection",
     data() {
          return {
               data: null,
               loading: true,
               error: null,
               shapeSrc: tripMainImgShape,
               shapeTop: shapeTopSvg,
               shapeBottom: shapeBottomSvg,
          }
     },
     mounted() {
          axios
               .get("http://localhost:8080/api/info")
               .then((response) => {
                    this.data = response.data;
               })
               .catch((error) => {
                    this.error = "Failed to fetch data: " + error.message;
               })
               .finally(() => {
                    this.loading = false;
               });
     },
}
</script>

<style scoped>
.trip-main-section{
     width: 100%;
     height: 100vh;
     padding: 35px 50px;
     background-color: #F8F6F6;
}

.trip-main-section img{
     width: 100%;
}
.trip-main-section .title {
     width: 35%;
}
.trip-main-section .title h1{
     font-weight: bold;
}

.trip-main-section .title h5{
     color: #898989;
}
</style>