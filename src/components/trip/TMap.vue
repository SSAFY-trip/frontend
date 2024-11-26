<template>
     <div ref="tmap" class="map">
     </div>
</template>

<script>
export default {
     name: "TMap",
     props: {
          lat: {
               type: Number, // Latitude value
               required: false,
               default: 36.5,
          },
          lng: {
               type: Number, // Longitude value
               required: false,
               default: 127.5,
          },
          markers: {
               type: Array,
               required: false,
               default: () => []
          },
          zoom: {
               type: Boolean,
               required: false,
               default: false,
          }
     },
     data() {
          return {
               pushedMarkers: [],
               icons: import.meta.glob('@/assets/icons/markers/*.png'),
               path: [],
               map: null,
          }
     },
     mounted() {
          this.initializeMap();
     },
     methods: {
          initializeMap() {
               const option = {
                    center: new Tmapv2.LatLng(this.lat, this.lng),
                    width: "100%",
                    height: "100%",
                    zoom: 10,
               };

               // Initialize the map and store the map instance
               this.map = new Tmapv2.Map(this.$refs.tmap, option);

               const bounds = new Tmapv2.LatLngBounds();
               this.path = []; // Reset path when initializing

               // Add markers and polyline
               this.addMarkersAndPolyline(bounds);

               // Fit bounds to markers
               if(bounds.length > 0)
                    this.map.fitBounds(bounds);

               const currentZoom = this.map.getZoom();
               // Adjust zoom level to zoom out slightly (e.g., by 1 level)
               this.map.setZoom(currentZoom);
          },
          addMarkersAndPolyline(bounds) {
               // Clear existing markers before adding new ones
               this.removeMarkers();

               // Create markers
               this.markers.forEach((marker, index) => {
                    const position = new Tmapv2.LatLng(marker.latitude, marker.longitude);
                    bounds.extend(position);
                    this.path.push(position);

                    const markerInstance = new Tmapv2.Marker({
                         position: position,
                         map: this.map,
                         title: marker.name,
                         icon: `/src/assets/icons/markers/${marker.category}/${index + 1}.png`,
                         iconSize: new Tmapv2.Size(25, 32),
                    });

                    // Store marker instance if needed for later manipulation
                    this.pushedMarkers.push(markerInstance);
               });

               // Add polyline connecting the markers
               new Tmapv2.Polyline({
                    path: this.path, // Use the collected path
                    strokeColor: "#808080", // Dark grey color for the polyline
                    strokeWeight: 4, // Thickness of the polyline
                    strokeStyle: "dot", // Dotted line style
                    map: this.map, // Attach to the map
               });
          },
          removeMarkers() {
               this.pushedMarkers.forEach((marker, index) => {
                    marker.setMap(null);
               })
               this.pushedMarkers = [];
          }
     },
     watch: {
          lat(newLat) {
               if (this.map) {
                    console.log(this.zoom)
                    const newCenter = new Tmapv2.LatLng(newLat, this.lng);
                    this.map.setCenter(newCenter);
               }
               const currentZoom = this.map.getZoom();
               if (this.zoom) {
                    this.map.setZoom(currentZoom + 3);
               }
               else {
                    this.map.setZoom(currentZoom - 3);
               }
          },
          lng(newLng) {
               if (this.map) {
                    const newCenter = new Tmapv2.LatLng(this.lat, newLng);
                    this.map.setCenter(newCenter); // Update map center when lng changes
               }
          }
     },

}
</script>

<style scoped>
.map{
     margin: 0;
     padding: 0;
}
</style>