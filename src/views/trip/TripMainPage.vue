<template>
     <div class="trip-main">
          <TripNavigation :active-route="currentRoute" @navigate="handleNavigation" />
          <TripMainPageMainSection />
     </div>



</template>

<script>
import TripNavigation from "@/components/trip/TripNavigation.vue";
import TripMainPageMainSection from "@/components/trip/TripMainPageMainSection.vue";

export default {
     name: "TripMainPage",
     components: {
          TripNavigation,
          TripMainPageMainSection
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
.trip-main{
     display: flex;
     align-items: center;
}
</style>
