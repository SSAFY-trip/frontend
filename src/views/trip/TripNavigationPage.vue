<template>
     <div>
          <h1>TripNavigationPage</h1>
          <TripNavigation :active-route="currentRoute" @navigate="handleNavigation" />
     </div>
</template>

<script>
import TripNavigation from "@/components/trip/TripNavigation.vue";

export default {
     name: "TripNavigationPage",
     components: {
          TripNavigation,
     },
     data() {
          return {
               currentRoute: "home",
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
/* Add any additional styling specific to this page */
</style>
