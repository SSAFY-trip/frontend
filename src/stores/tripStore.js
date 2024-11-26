// store.js
import { createStore } from "vuex";
import { getAllInfoOfTripAndEvents } from "@/utils/eventAPI";

const tripStore = createStore({
    state() {
        return {
            tripInfo: null,
            events: null,
            eventDetails: null,
        };
    },
    mutations: {
        setTripinfo(state, tripInfo) {
            state.tripInfo = tripInfo;
        },
        setEvents(state, events) {
            state.events = events;
        },
        setEventDetails(state, eventDetails) {
            state.eventDetails = eventDetails;
        },
        reorderEventsOfDate(state, payload) {
            const { date, newOrderOfEventIds } = payload;

            const orderedEvents = newOrderOfEventIds.map((id) => {
                return state.events[date].find((event) => event.id === id);
            });

            state.events[date] = orderedEvents;
        },
        addEvent(state, {date, newEvent, newEventDetails}) {
            console.log(newEvent);
            console.log(newEventDetails);
            state.eventDetails[newEventDetails.placeId] = newEventDetails;
            state.events[date].push(newEvent);
        },
    },
    actions: {
        async fetchTripData({ commit }, tripId) {
            try {
                // Make the API call with the passed tripId
                const response = await getAllInfoOfTripAndEvents(tripId);

                console.log("response success:");
                console.log(response);
                // Assuming the API returns an object with startDate, endDate, and events
                const { tripInfo, events, eventDetails } = response.data;

                // Commit mutations to update the state with the fetched data
                commit("setTripinfo", tripInfo);
                commit("setEvents", events);
                commit("setEventDetails", eventDetails);
            } catch (error) {
                console.error("Error fetching trip data:", error);
            }
        },
    },
    getters: {
        getTripDatesList(state) {
            const start = new Date(state.tripInfo.startDate);
            const end = new Date(state.tripInfo.endDate);
            const dates = [];

            while (start <= end) {
                const dateStr = start.toISOString().split("T")[0]; // Format as yyyy-mm-dd
                dates.push(dateStr);
                start.setDate(start.getDate() + 1);
            }

            return dates;
        },
        getTripInfo(state) {
            return state.tripInfo;
        },
        getEvents(state) {
            return state.events;
        },
        getEventDetails(state) {
            return state.eventDetails;
        },
    },
});

export default tripStore;