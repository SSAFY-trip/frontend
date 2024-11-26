<template>
     <div class="popup">
          <div class="search-section">
               <form @submit.prevent="onSearch" class="search">
                    <input v-model="searchQuery" type="text" placeholder="키워드, 지역 이름" class="search-input">
                         <button type="submit" class="search-button"></button>
                    </input>
               </form>

               <div v-if="loading">...</div>
               <div v-if="error" class="error-message">{{ error }}</div>
               <div v-if="results.length > 0">
                    <ul>
                         <li v-for="(item, index) in results" :key="item.id" @click="selectPlace(item)" class="item">
                              <div class="item-text">
                                   <div class="item-text-left">
                                        <p class="item-name">{{ item.name }}</p>
                                        <p class="item-address">{{ item.address }}</p>
                                   </div>

                                   <p :class="item.category">{{ item.category }}</p>
                              </div>

                              <hr v-if="index < results.length - 1" class="item-divider" />
                         </li>
                    </ul>
               </div>
          </div>

          <div v-if="selectedPlace" class="place-detail-section">
               <PlaceDetail :place="selectedPlace" :key="selectedPlace.placeId" :date="date" />
          </div>

          <div class="map-section">
               <!-- Pass mapCenter and zoom based on place selection -->
               <TMap ref="tmap" :isItinerary="false" :mapCenter="mapCenter" :zoom="zoom" />
          </div>
     </div>
</template>

<script>
import TMap from "@/components/trip/TMap.vue";
import { searchKeyword } from "@/utils/eventAPI";
import PlaceDetail from "@/components/trip/PlaceDetail.vue";

export default {
     name: "EventSearch",
     components: {
          TMap,
          PlaceDetail,
     },
     data() {
          return {
               searchQuery: "",
               results: [],
               loading: false,
               error: null,
               selectedPlace: null,
               zoom: false, // This will control zoom in/out
               mapCenter: {
                    lat: 36.5,  // Default latitude
                    lng: 127.5, // Default longitude
               },
          };
     },
     props: {
          date: {
               type: String,
               required: true,
          },
     },
     methods: {
          async onSearch() {
               if (!this.searchQuery) {
                    return; // Don't send request if the search query is empty
               }

               this.loading = true;
               this.error = null;
               try {
                    const tripId = this.$route.params.tripId;

                    const response = await searchKeyword(tripId, this.searchQuery);
                    this.results = response.data;
                    console.log("Response:");
                    console.log(response);

                    // insert markers
                    if (this.$refs.tmap && typeof this.$refs.tmap.addMarkers === "function") {
                         this.$refs.tmap.addMarkers(this.results);
                    } else {
                         console.error("TMap ref or addMarkers method not available.");
                    }
               } catch (error) {
                    console.log(error);
                    this.error = "An error occurred while fetching data."; // Handle error message
               } finally {
                    this.loading = false; // Set loading to false once request is complete
               }
          },

          selectPlace(place) {
               console.log("place select");
               console.log(place);
               if (this.selectedPlace !== place) {
                    this.selectedPlace = place;

                    // Set the map center to the selected place's location and zoom in
                    this.mapCenter = {
                         lat: place.latitude,
                         lng: place.longitude,
                    };
                    this.zoom = true; // Zoom in when a place is selected
               }
          },

          deselectPlace() {
               this.selectedPlace = null;

               // Reset map center to default and zoom out
               this.mapCenter = {
                    lat: 36.5, // Default center latitude
                    lng: 127.5, // Default center longitude
               };
               this.zoom = false; // Zoom out when no place is selected
          },
     },
};
</script>

<style scoped>
.popup {
     background-color: #fff;
     box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
     text-align: center;
     width: 90%;
     height: 90%;

     display: flex;
     border-radius: 20px;
     overflow: hidden;
}

/* popup */
.popup .search-section {
     width: 30%;
     height: 100%;
     display: flex;
     flex-direction: column;
     padding: 20px 25px;
}

.popup .map-section {
     width: 100%;
     height: 100%;
     padding: 0px;
}

.popup .close-button {
     position: absolute;
     top: 6%;
     right: 6%;
     padding: 5px 5px;
     height: fit-content;
     background-color: black;
     color: white;
     border-radius: 30px;
     display: flex;
     align-items: center;
}

.place-detail-section {
     position: absolute;
     top: 6%;
     left: 26.2%;
     background-color: white;
     width: 25%;
     max-height: 88%;
     min-height: 88%;
     z-index: 5;
     border-radius: 30px;
     overflow: auto;
}

.item {
     display: flex;
     flex-direction: column;
}

.item hr {
     margin: 15px 0;
}

.item-text {
     display: flex;
     justify-content: space-between;
}

.item-text-left {
     display: flex;
     flex-direction: column;
}

.item-address {
     color: grey;
     text-align: left;
     font-size: 13px;

}

.item-name {
     font-weight: bold;
     font-size: 17px;
     text-align: left;
}

.교통 {
     color: #0c2a6d;
}

.음식 {
     color: #756cf0;
}

.관광 {
     color: #517edc;
}

.숙박 {
     color: #517edc;
}

.search {
     margin: 10px 0;
}

.search-input {
     width: 70%;
     height: 30px;
     border-radius: 30px;
     border: 1px solid black;
     padding: 0 10px;
}

.search-button{
     display: hidden;
}
</style>