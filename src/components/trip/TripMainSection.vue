<template>
     <div class="trip-main-section">
          <div class="section1">
               <div class="title">
                    <h1>경경주경주경주경주경주경주경주</h1>
                    <h5>24.01.22 ~ 24.01.26 (4박 5일)</h5>
                    <h5>경주 | 부산 | 울산</h5>
               </div>

               <div class="image-shape-container" />
          </div>
          <div class="section2">
               <h2>전체 일정</h2>
               <div class="simpleItinerary">
                    <div v-for="(events, date, index) in dayEvents" :key="date" class="events">
                         <p class="date">{{ formatDay(index) }} - {{ formatDate(date) }}</p>
                         <ul v-if="events.length > 0">
                              <li v-for="(eventInfo, index) in events" :key="index" class="event">
                                   <span>{{ eventInfo.name }}</span>hhjh
                                   <p>{{ eventInfo.memo }}</p>
                              </li>
                         </ul>
                         <p v-else class="no-events">아직 일정이 없습니다.</p>
                    </div>
               </div>
          </div>
          <div class="section2">
               <h2>참고할 만한 여행</h2>
          </div>
     </div>

</template>

<script>
import tripMainImgShape from '@/assets/shapes/trip-main-img.svg';
import tripMainImage from '@/assets/images/test.jpg';
import { getTripEventsByDate } from '@/utils/eventAPI';


export default {
     name: "TripMainSection",
     data() {
          return {
               loading: true, // Flag to track loading state
          };
     },
     computed: {
          tripInfo() {
               console.log("tripInfo" + this.$store.getters.getTripInfo);
               return this.$store.getters.getTripInfo || {};
          },
          events() {
               console.log(this.$store.getters.getEvents);
               return this.$store.getters.getEvents || {};
          },
          dayEvents() {
               const daysArray = this.generateDateRange(this.tripInfo.startDate, this.tripInfo.endDate);
               const events = {};
               daysArray.forEach(date => {
                    events[date] = this.events[date] || [];
               });
               return events || {};
          }
     },
     async mounted() {
          try {
               // Access tripId from the URL
               const tripId = this.$route.params.tripId;

               // Dispatch the action with tripId
               await this.$store.dispatch('fetchTripData', tripId) // Ensure data is fetched
                    .then(() => {
                         console.log("tripInfo: " + this.$store.getters.getTripInfo);
                    });
          } catch (error) {
               console.error("Error fetching trip data:", error);
               this.loading = false; // Handle error and stop loading
          }
          
     },
     methods: {
          formatDay(index) {
               return `Day ${index + 1}`;
          },
          formatDate(date) {
               const formattedDate = new Date(date);
               const year = String(formattedDate.getFullYear()).slice(-2); // Get last two digits of year
               const month = String(formattedDate.getMonth() + 1).padStart(2, '0'); // Get month with leading zero
               const day = String(formattedDate.getDate()).padStart(2, '0'); // Get day with leading zero
               return `${year}/${month}/${day}`; // Combine into YY/MM/DD format
          },
          generateDateRange(startDate, endDate) {
               const start = new Date(startDate);
               const end = new Date(endDate);
               const dates = [];

               while (start <= end) {
                    const dateStr = start.toISOString().split('T')[0]; // Format as yyyy-mm-dd
                    dates.push(dateStr);
                    start.setDate(start.getDate() + 1);
               }

               return dates;
          }
     }
}
</script>

<style scoped>
.trip-main-section{
     width: 100%;
     height: 100vh;
     padding: 35px 50px;
     background-color: #F8F6F6;

     display: flex;
     flex-direction: column;  
     gap: 10px;
}

/* section1 */
.section1{
     position: relative
}
.title,
.image-shape-container {
     position: absolute;
     top: 0;
     left: 0;
}

.section1 .title {
     width: 25vw;
     padding-left: 10px;
}
.section1 .title h1{
     font-weight: bold;
}

.section1 .title h5{
     color: #898989;
}

/* image */
.image-shape-container { 
     position: relative;
     width: 100%;
     height: auto;
     background-image: url('@/assets/images/test.jpg');
     background-position: center;
     background-size: cover;
     padding-top: 25%;

     mask-image: url('@/assets/shapes/trip-main-img.svg'); /* Use the SVG as a mask */
     mask-size: contain;
     mask-repeat: no-repeat;
}

.shape-img {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     object-fit: cover;
}

/* section 2 */
.section2 {
     width: 100%;
     height: fit-content;
     background-color: white;
     border-radius: 30px;
     padding: 35px 30px 20px;

     display: flex;
     flex-direction: column;
     align-items: left;
     gap: 15px;
}

.section2 h2{
     font-weight: bold;
}

.section2 .simpleItinerary {
     width: 100%;
     display: flex;
     gap: 40px;
     overflow-x: auto;
     scrollbar-width: thin;
     scrollbar-color: #888 #ccc;
     box-sizing: border-box;
}

.section2 .simpleItinerary .date {
     color: white;
     font-size: 15px;
     font-weight: bold;
     background-color: black;
     border-radius: 30px;
     width: fit-content;
     padding: 3px 15px;
     margin-bottom: 10px;
}

.section2 .simpleItinerary .events {
     width: 100%;
     max-width: 400px;
     flex-shrink: 0;
}

.section2 .simpleItinerary .events .no-events{
     color: grey;

}

.section2 .simpleItinerary ul {
     width: 100%;
     list-style-type: none;
     padding-left: 0;
}

.section2 .simpleItinerary .event{
     width: 100%;
     display: block;
     border-radius: 30px;
     border: 1px solid #D9D9D9;
     padding: 7px 20px;
     margin-top: 5px;
}

.section2 .simpleItinerary .event p {
     color: #5580C9;
     font-size: 12px;
}

/* .slider {
     position: absolute;
     bottom: -20px;
     left: 0;
     width: 100%;
     height: 10px;
     display: flex;
     flex-direction: column;
     gap: 5px;
} 
*/

</style>