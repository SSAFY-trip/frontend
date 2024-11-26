<template>
     <div class="trip-main">
          <VisitTripNavigation :active-route="currentRoute" @navigate="handleNavigation" />
          <TripItineraryMainSection />
     </div>



</template>

<script>
import VisitTripNavigation from "@/components/trip/VisitTripNavigation.vue";
import TripItineraryMainSection from "@/components/trip/TripItineraryMainSection.vue";

export default {
     name: "TripMainPage",
     components: {
          VisitTripNavigation,
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
