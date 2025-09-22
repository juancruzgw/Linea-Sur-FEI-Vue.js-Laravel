<template>
  <div class="main-content">
    <div id="map" class="map"></div>
  </div>
</template>

<script>
import { onMounted } from "vue";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "AppHome",
  setup() {
    onMounted(() => {
      const map = L.map("map").setView([-38.939672, -68.053575], 13);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }).addTo(map);

      L.marker([-38.939672, -68.053575])
        .addTo(map)
        .bindPopup("UNCO - FAI")
        .openPopup();
    });
  },
};
</script>
