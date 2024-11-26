<template>
     <div ref="tmap" class="map"></div>
</template>

<script>
export default {
     name: "TMap",
     props: {
          lat: {
               type: Number,
               required: false,
               default: 36.5,
          },
          lng: {
               type: Number,
               required: false,
               default: 127.5,
          },
          markers: {
               type: Array,
               required: false,
               default: () => [],
          },
          zoom: {
               type: Boolean,
               required: false,
               default: false,
          },
          isItinerary: {
               type: Boolean,
               required: false,
               default: true,
          },
          mapCenter: {
               type: Object,
               required: false,
          },
     },
     data() {
          return {
               pushedMarkers: [],
               icons: import.meta.glob('@/assets/icons/markers/*.png'),
               path: [],
               map: null,
          };
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
               if (this.isItinerary) {
                    this.addMarkersAndPolyline(bounds);
                    if (bounds.length > 0) this.map.fitBounds(bounds);
               }
          },
          addMarkersAndPolyline(bounds) {
               // Clear existing markers before adding new ones
               this.removeMarkers();

               // Create markers
               this.markers.forEach((marker, index) => {
                    const position = new Tmapv2.LatLng(marker.latitude, marker.longitude);
                    bounds.extend(position);
                    this.path.push(position);

                    const iconPath = this.isItinerary ? `/src/assets/icons/markers/${marker.category}/${index + 1}.png` : `/src/assets/icons/markers/${marker.category}/default.png`;
                    new Tmapv2.Marker({
                         position: position,
                         map: this.map,
                         title: marker.name,
                         icon: iconPath,
                         iconSize: new Tmapv2.Size(25, 32),
                    });
               });

               if (this.markers.length > 0) {
                    this.map.fitBounds(bounds); // Automatically adjust zoom and center to fit all markers
               }

               if (this.path.length > 1) {
                    new Tmapv2.Polyline({
                         path: this.path, // Use the collected path
                         strokeColor: "#808080", // Dark grey color for the polyline
                         strokeWeight: 4, // Thickness of the polyline
                         // strokeStyle: "dot", // Dotted line style
                         map: this.map, // Attach to the map
                    });
               }
          },
          addMarkers(markers) {
               this.removeMarkers();
               const bounds = new Tmapv2.LatLngBounds();

               markers.forEach((marker, index) => {
                    const position = new Tmapv2.LatLng(marker.latitude, marker.longitude);
                    bounds.extend(position);
                    new Tmapv2.Marker({
                         position: position,
                         map: this.map,
                         title: marker.name,
                         icon: `/src/assets/icons/markers/${marker.category}/default.png`,
                         iconSize: new Tmapv2.Size(25, 32),
                    });
               });

               if (markers.length > 0) {
                    this.map.fitBounds(bounds); // Automatically adjust zoom and center to fit all markers
               }
          },
          removeMarkers() {
               this.pushedMarkers.forEach((marker) => {
                    marker.setMap(null);
               });
               this.pushedMarkers = [];
          },
     },
     watch: {
          lat(newLat) {
               if (this.map) {
                    const newCenter = new Tmapv2.LatLng(newLat, this.lng);
                    this.map.setCenter(newCenter);
               }
          },
          lng(newLng) {
               if (this.map) {
                    const newCenter = new Tmapv2.LatLng(this.lat, newLng);
                    this.map.setCenter(newCenter);
               }
          },
          mapCenter(newCenter) {
               if (this.map && newCenter) {
                    const newLatLng = new Tmapv2.LatLng(newCenter.lat, newCenter.lng);
                    this.map.setCenter(newLatLng);
               }
          },
          zoom(newZoom) {
               if (this.map) {
                    const currentZoom = this.map.getZoom();
                    this.map.setZoom(newZoom ? currentZoom + 3 : currentZoom - 3);
               }
          },
     },
};
</script>


<style scoped>
.map {
     margin: 0;
     padding: 0;
     height: 100%;
     overflow: hidden;
}
</style>