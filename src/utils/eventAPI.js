import axiosInstance from "@/utils/axios";

// get all trip events by date
export const getTripEventsByDate = async (tripId) => {
     return await axiosInstance.get(`/trips/${tripId}/events`);
};

// get all trip data
export const getAllInfoOfTripAndEvents = async (tripId) => {
     return await axiosInstance.get(`/trips/${tripId}/events/all`);
};

// optimize routes
export const optimizeRoutes = async (
     tripId,
     date,
     departureId,
     departureLongitude,
     departureLatitude,
     destinationId,
     destinationLongitude,
     destinationLatitude
) => {
     const requestBody = {
          startEventId: departureId,
          startEventLongitude: departureLongitude,
          startEventLatitude: departureLatitude,
          endEventId: destinationId,
          endEventLongitude: destinationLongitude,
          endEventLatitude: destinationLatitude,
     };
     return await axiosInstance.post(
          `/trips/${tripId}/events/by-date/${date}/optimize`,
          requestBody
     );
};

// search keyword
export const searchKeyword = async (
     tripId, 
     query,
     areaLLCode,
     areaLMCode,
     radius,
     centerLon,
     centerLat,
     page
) => {
     const requestBody = {
          query,
          areaLLCode,
          areaLMCode,
          radius,
          centerLon,
          centerLat,
          page
     };
     return await axiosInstance.post(
          `/trips/${tripId}/events/search`,
          requestBody
     );
}