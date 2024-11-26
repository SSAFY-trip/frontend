<template>
     <div class="trip-main">
          <VisitTripNavigation :active-route="currentRoute" @navigate="handleNavigation" />
          <VisitTripMainSection />
     </div>
</template>

<script>
import VisitTripMainSection from "@/components/trip/VisitTripMainSection.vue";
import VisitTripNavigation from "@/components/trip/VisitTripNavigation.vue";

export default {
     name: "VisitTripMainPage",
     components: {
          VisitTripNavigation,
          VisitTripMainSection
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
