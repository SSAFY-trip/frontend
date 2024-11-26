<template>
     <div class="trip-main">
          <TripNavigation :active-route="currentRoute" @navigate="handleNavigation" />
          <TripItineraryMainSection />
     </div>



</template>

<script>
import TripNavigation from "@/components/trip/TripNavigation.vue";
import TripItineraryMainSection from "@/components/trip/TripItineraryMainSection.vue";

export default {
     name: "TripMainPage",
     components: {
          TripNavigation,
          TripItineraryMainSection
     },
     data() {
          return {
               currentRoute: "trip-main",
          };
     },
     methods: {
          handleNavigation(route) {
               this.currentRoute = route;
          },
     },
};
</script>

<style>
.trip-main {
     display: flex;
     align-items: center;
     height: 100%;
     overflow-y: auto;
}
</style>
