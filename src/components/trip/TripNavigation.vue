<template>
  <nav class="vertical-nav">
    <router-link :to="{ name: 'main' }" class="homeIcon">
      <h3>Trippy</h3>
    </router-link>

    <hr />
    <ul>
      <li v-for="item in navItems" :key="item.route" :title="item.text" class="nav-item">
        <router-link :to="{ name: item.route }" active-class="active-link" exact-active-class="exact-active-link">
          <div v-html="item.icon" class="nav-icon"></div>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<script>
import tripMainIcon from '@/assets/icons/trip-main.svg?raw'
import tripItineraryIcon from '@/assets/icons/trip-itinerary.svg?raw'
import tripSettingsIcon from '@/assets/icons/trip-settings.svg?raw'
import tripNavigationIcon from '@/assets/icons/trip-navigation.svg?raw'

export default {
  name: 'TripNavigation',

  data() {
    return {
      navItems: [
        { icon: tripMainIcon, route: 'trip-main', text: '여행 요약' },
        { icon: tripItineraryIcon, route: 'trip-itinerary', text: '여행 일정' },
        { icon: tripSettingsIcon, route: 'trip-settings', text: '여행 정보 및 설정' },
      ],
    }
  },
  methods: {
    isActive(route) {
      return this.$route.name === route
    },
  },
}
</script>

<style scoped>
.vertical-nav {
  width: 100px;
  height: 100vh;
  background-color: white;
  padding-top: 40px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 30px;
}

.vertical-nav h3 {
  font-weight: bold;
}

.vertical-nav hr {
  width: 70%;
  border: none;
  border-top: 1px solid #434343;
}

.vertical-nav ul {
  list-style-type: none;
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.vertical-nav li {
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  justify-items: center;
}

.vertical-nav li:hover {
  background-color: #e9ecef;
}

/* active css */
.vertical-nav li .router-link {
  display: block;
  padding: 10px;
}

.vertical-nav li .router-link-active img,
.vertical-nav li .exact-active-link img {
  background-color: black;
  /* Make the image background black */
  border-radius: 50%;
  /* Round the image itself */
  padding: 10px;
  /* Add padding around the image */
  transition:
    background-color 0.3s ease,
    fill 0.3s ease;
  /* Transition for smooth effect */

  z-index: 5;
}

.vertical-nav li .router-link-active .nav-icon svg {
  fill: white;
  /* Change the SVG icon color to white */
}

.vertical-nav li img {
  display: block;
  margin: 0 auto;
  /* Center the image */
}

/* tool tip */
.nav-item {
  position: relative;
  /* Required for positioning the tooltip */
}

.nav-item:hover::after {
  content: attr(title);
  /* Show the tooltip text */
  position: absolute;
  top: 50%;
  left: 240%;
  transform: translateY(-50%);
  background-color: rgba(0, 0, 0, 0.75);
  color: white;
  padding: 5px 15px;
  border-radius: 100px;
  white-space: nowrap;
  font-size: 14px;
  z-index: 5;
}

.nav-item:hover::before {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%) translateX(100%);
  border-width: 5px;
  border-style: solid;
  border-color: transparent transparent transparent rgba(0, 0, 0, 0.75);
}

.homeIcon {
  text-decoration: none;
  color: inherit;
}
</style>
