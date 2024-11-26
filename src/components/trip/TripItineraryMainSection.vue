<template>
    <div class="trip-itinerary-main-section">
        <div class="background">
            <img src="@/assets/shapes/left-shape-top.svg" class="left-shape-top-svg" alt="Top Left SVG" />
            <div class="left-shape-bottom-box" />
        </div>
        <div class="content">
            <div class="top-bar">
                <!-- Display the formatted day -->
                <div v-if="selectedDate" class="day-title">
                    <p>{{ formattedDay }}</p>
                </div>

                <!-- Dropdown for selecting the date -->
                <select v-model="selectedDate" @change="formatDate" class="dropdown">
                    <option v-for="date in dates" :key="date" :value="date" class="option">
                        {{ date }}
                    </option>
                </select>
            </div>
            <div class="section">
                <div class="left-section">
                    <div class="optimize-route">
                        <div class="header">
                            <p class="section-title">일정 최적화</p>
                            <button class="black-button" @click="optimizeRoute">
                                <p>최적화하기</p>
                                <img src="@/assets/icons/arrow-right-top.svg" alt="Arrow" class="arrow-icon" />
                            </button>
                        </div>
                        <div class="form">
                            <div class="input-field">
                                <label>출발지</label>
                                <select v-model="departure" @change="updateDestinationOptions">
                                    <option disabled value="">
                                        출발지 선택
                                    </option>
                                    <option v-for="(event, index) in dayEvents" :key="index" :value="event">
                                        {{ event.name }}
                                    </option>
                                </select>
                            </div>
                            <div class="divider">|</div>
                            <div class="input-field">
                                <label>도착지</label>
                                <select v-model="destination">
                                    <option disabled value="">
                                        도착지 선택
                                    </option>
                                    <option v-for="(
                                            event, index
                                        ) in filteredDestinations" :key="index" :value="event">
                                        {{ event.name }}
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="map">
                        <p class="section-title">지도</p>

                        <TMap v-if="averageLocation.lat !== 0 && averageLocation.lng !== 0" :lat="averageLocation.lat"
                            :lng="averageLocation.lng" :markers="this.dayEvents" :zoom="this.selectedEvent" />

                    </div>
                </div>
                <hr />
                <div v-if="!selectedEvent" class="right-section">
                    <div class="header">
                        <p class="section-title">일정</p>
                        <button class="black-plus-button" @click="openPopup">
                            <img src="@/assets/icons/plus.svg" alt="plus" />
                        </button>
                    </div>
                    <ul>
                        <li v-for="event in dayEvents" :key="event.id" @click="selectEvent(event)">
                            <div class="event-top">
                                <p class="event-name">{{ event.name }}</p>
                                <p class="event-category" :class="event.category">
                                    {{ event.category }}
                                </p>
                            </div>
                            <p class="event-memo">{{ event.memo }}</p>
                        </li>
                    </ul>
                </div>

                <!-- Details container -->
                <div v-if="selectedEvent" class="right-section-details">
                    <button @click="deselectEvent" class="back-arrow-button">
                        <img src="@/assets/icons/angle-arrow-left.svg" />
                    </button>

                    <EventDetail :event="selectedEvent" />
                </div>
            </div>
        </div>
    </div>
    <!-- Overlay and popup content -->
    <div v-if="showPopup">

        <div class="overlay">
            <EventSearch :date="selectedDate" />

            <button class="close-button" @click="closePopup">
                <img src="@/assets/icons/cross.svg" alt="Close" />
            </button>
        </div>
    </div>

</template>

<script>
import { optimizeRoutes } from "@/utils/eventAPI";
import TMap from "@/components/trip/TMap.vue";
import EventSearch from "@/components/trip/EventSearch.vue";
import EventDetail from "@/components/trip/EventDetail.vue";

export default {
    name: "TripItineraryMainSection",
    components: {
        TMap,
        EventSearch,
        EventDetail,
    },
    data() {
        return {
            selectedDate: null, // Holds the selected datㄷ
            formattedDay: "",
            dates: this.$store.getters.getTripDatesList,
            events: this.$store.getters.getEvents,
            selectedDateEvents: null,
            departure: {},
            destination: {},
            filteredDestinations: null,
            selectedEvent: null,
            showPopup: false,
            popupKey: 0,
        };
    },
    mounted() {
        this.selectedDate = this.dates[0];
        this.selectedDateEvents = this.events[this.selectedDate];
        console.log(this.selectedDate);
        console.log(this.selectedDateEvents);
        this.formatDate();
    },
    computed: {
        dayEvents() {
            if (this.selectedDate && this.events[this.selectedDate]) {
                return this.events[this.selectedDate];
            }
            return [];
        },
        averageLocation() {
            if (!this.dayEvents || this.dayEvents.length === 0) {
                return { lat: 0, lng: 0 }; // Default value for no events
            }

            if (this.selectedEvent) {
                return {
                    lat: this.selectedEvent.latitude,
                    lng: this.selectedEvent.longitude,
                };
            }

            const total = this.dayEvents.reduce(
                (acc, event) => {
                    acc.lat += event.latitude;
                    acc.lng += event.longitude;
                    return acc;
                },
                { lat: 0, lng: 0 } // Initialize accumulator
            );

            const count = this.dayEvents.length;
            console.log("calculate average location: " + total.lat / count + " " + total.lng / count);

            return {
                lat: total.lat / count, // Average latitude
                lng: total.lng / count, // Average longitude
            };
        },
    },
    methods: {
        closePopup() {
            this.showPopup = false; // Hide the popup
        },
        openPopup() {
            this.showPopup = true;
        },
        formatDate() {
            if (this.selectedDate) {
                // Get the index of the selected date in the dates list
                const index = this.dates.indexOf(this.selectedDate);

                // Update the formattedDay with the index (add 1 to make it 1-based)
                this.formattedDay = `DAY ${index + 1}`; // Index starts at 0, so we add 1
            }
        },
        updateDestinationOptions() {
            if (this.departure) {
                this.filteredDestinations = this.dayEvents.filter((event) => {
                    return event.id !== this.departure.id;
                });
            } else {
                this.filteredDestinations = [...this.dayEvents];
            }
        },
        selectEvent(event) {
            this.selectedEvent = event;
        },
        deselectEvent() {
            this.selectedEvent = null;
        },

        async optimizeRoute() {
            if (this.departure && this.destination) {
                // Log the selected departure and destination ids for debugging
                console.log("Departure ID: ", this.departure.id);
                console.log("Destination ID: ", this.destination.id);

                try {
                    const tripId = this.$route.params.tripId;

                    // Send the request to optimize routes
                    await optimizeRoutes(
                        tripId,
                        this.selectedDate,
                        this.departure.id,
                        this.departure.longitude,
                        this.departure.latitude,
                        this.destination.id,
                        this.destination.longitude,
                        this.destination.latitude
                    ).then((response) => {
                        const { optimizedOrderOfEventIds, mapInfo } =
                            response.data;

                        // Commit the mutation to reorder the events based on the optimized order
                        this.$store.commit("reorderEventsOfDate", {
                            date: this.selectedDate,
                            newOrderOfEventIds: optimizedOrderOfEventIds,
                        });
                    });

                    alert("일정 최적화가 성공적으로 이루어졌습니다.");
                } catch (error) {
                    console.error("Error fetching trip data:", error);
                    alert(
                        "일정 최적화를 할 수 없는 경우이거나 최적화 도중 에러가 발생했습니다."
                    );
                }
            } else {
                // If either departure or destination is not selected, show an error
                console.log("Please select both departure and destination.");
            }
        },
    },
};
</script>

<style scoped>
.background {
    width: 100%;
    height: 100vh;
    padding: 35px 50px;
    background-color: #f8f6f6;
    position: absolute;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
}

.left-shape-top-svg {
    position: relative;
    /* Keeps this element within the normal flow of the flexbox */
    width: 20%;
    /* Adjust based on your requirements */
    height: auto;
    /* Adjust based on your requirements */
}

.left-shape-bottom-box {
    width: 100%;
    height: auto;
    /* Ensures it maintains aspect ratio */
    flex-grow: 1;
    background-color: white;
    border-radius: 0 30px 30px 30px;
}

.trip-itinerary-main-section {
    position: relative;
    z-index: 2;
    width: 100%;
    height: 100vh;
    background-color: #f8f6f6;
    position: absolute;

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    position: relative;
}

.content {
    position: absolute;
    top: 35px;
    left: 50px;
    width: calc(100% - 100px);
    height: calc(100vh - 70px);
    padding: 0 30px;
    display: flex;
    flex-direction: column;
}

.overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    /* Dark background with transparency */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000;
    /* Ensure it's above other content */
}

.close-button {
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

.back-arrow-button {
    border: none;
    background: transparent;
    /* margin-right: 5px; */
    margin-top: 6px;
}

/* top bar */
.top-bar {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding: 1% 0.5% 0 4.5%;
    /* padding-left: 5%;
  padding-right: 1%; */
    /* align-items: center; */
}

.day-title p {
    font-weight: bold;
    font-size: 25px;
}

.dropdown {
    padding: 10px 40px 10px 20px;
    /* Ensure space for the arrow */
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 30px;
    appearance: none;
    /* Remove default styling including the default arrow */
    background-color: black;
    color: white;
    cursor: pointer;
    position: relative;
    background-image: url('data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 10 6"%3E%3Cpath fill="none" stroke="%23fff" stroke-width="2" d="M1 1l4 4 4-4"%3E%3C/path%3E%3C/svg%3E');
    /* White arrow */
    background-repeat: no-repeat;
    background-position: right 15px center;
    /* Align arrow within padding */
    background-size: 10px 6px;
    /* Adjust arrow size */
    text-shadow: 0 0 10px white;
}

.dropdown .option {
    background-color: transparent;
    color: white;
    border: none;
}

/* section */
.section {
    width: 100%;
    height: 100%;
    margin-top: 30px;
    /* margin-bottom: 100px; */

    display: flex;
    gap: 30px;
}

hr {
    border-top: 1px solid #d9d9d9;
    height: 95%;
}

.section-title {
    font-weight: bold;
    font-size: 22px;
    padding-left: 10px;
    margin-bottom: 10px;
}

.header {
    display: flex;
    justify-content: space-between;
    align-content: center;
}

.black-button {
    background-color: black;
    padding: 6px 15px;
    border-radius: 30px;
    align-items: center;
    color: white;
    border: none;
    justify-content: center;
    height: fit-content;

    display: flex;
}

.black-plus-button {
    background-color: black;
    padding: 6px 6px;
    border-radius: 30px;
    align-items: center;
    color: white;
    border: none;
    justify-content: center;
    height: fit-content;

    display: flex;
}

/* left section */
.left-section {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-right: 10px;
    gap: 30px;
}

.optimize-route {
    width: 100%;
    display: flex;
    flex-direction: column;
}



.map {
    width: 100%;
    height: 90%;
    display: flex;
    flex-direction: column;
    padding-bottom: 30px;
}

/* right section */

.right-section {
    height: 100%;
    width: 50%;
    display: flex;
    flex-direction: column;
}

.right-section ul {
    display: flex;
    flex-direction: column;
    gap: 5px;
}

.right-section li {
    width: 100%;
    border-radius: 30px;
    border: 1px solid #d9d9d9;
    padding: 10px 20px;
    margin-top: 5px;

    display: flex;
    flex-direction: column;
    gap: 5px;
}

.right-section .event-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.right-section-details {
    display: flex;
    align-items: flex-start;
}

.detail-header {
    display: flex;
}

.event-top .event-name {
    font-weight: bold;
}

.event-top .event-category {
    font-weight: bold;
    padding-right: 5px;
}


.event-top .교통 {
    color: #0c2a6d;
}

.event-top .음식 {
    color: #756cf0;
}

.event-top .관광 {
    color: #517edc;
}

.event-top .숙박 {
    color: #404040;
}

.form {
    display: flex;
    justify-content: space-between;
    border: 1px solid black;
    border-radius: 30px;
    width: 100%;
    padding: 10px 30px;
}

.form .input-field {
    width: 40%;
    display: flex;
    justify-content: center;
    gap: 30px
}

.input-field label {
    color: grey;
}

.form .input-field select {
    width: 30%;
    border: none;

}
</style>
