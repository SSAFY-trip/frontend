<template>
     <div class="popup">
          <div class="search-section">
               <form @submit.prevent="onSearch">
                    <input v-model="searchQuery" type="text" placeholder="Search..." @keydown.enter="onSearch"
                         class="search-input" />
                    <button type="submit" class="search-button">Search</button>
               </form>

               <div v-if="loading">Loading...</div>
               <div v-if="error" class="error-message">{{ error }}</div>
               <div v-if="results.length > 0">
                    <ul>
                         <li v-for="(item, index) in results" :key="index">
                              {{ item.name }}
                         </li>
                    </ul>
               </div>
          </div>
          <div class="map-section">
               <TMap />
          </div>
          
     </div>
</template>

<script>
import TMap from "@/components/trip/TMap.vue";
import { searchKeyword } from "@/utils/eventAPI";

export default {
     name: "EventSearch",
     components: {
          TMap,
     },
     data() {
          return {
               searchQuery: "",
               results: [],
               loading: false,
               error: null,
          };
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

                    const response = await searchKeyword(tripId, this.searchQuery)
                    this.results = response.data;
                    console.log("Response:")
                    console.log(response)
               } catch (error) {
                    console.log(error)
                    this.error = "An error occurred while fetching data."; // Handle error message
               } finally {
                    this.loading = false; // Set loading to false once request is complete
               }
          },
     },
}
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
     width: 40%;
     height: 100%;
     display: flex;
     flex-direction: column;
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
</style>