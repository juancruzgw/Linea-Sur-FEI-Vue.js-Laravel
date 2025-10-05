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

      // Lista de puntos (coordenadas + info)
      const points = [
        {
          coords: [-38.939769, -68.053467],
          title: "Lluvia en FAI",
          date: "2025-10-04",
          amount: "25 mm",
          obs: "Lluvia persistente durante la mañana.",
        },
        {
          coords: [-38.842, -68.09],
          title: "Nieve",
          date: "2025-10-03",
          amount: "12 cm",
          obs: "Nevada leve en la madrugada.",
        },
        {
          coords: [-38.824822, -68.142178],
          title: "Lluvia",
          date: "2025-10-02",
          amount: "15 mm",
          obs: "Precipitaciones intermitentes, viento moderado.",
        },
        {
          coords: [-38.994, -68.04],
          title: "Lluvia",
          date: "2025-09-30",
          amount: "8 mm",
          obs: "Chaparrón aislado de corta duración.",
        },
        {
          coords: [-38.996, -68.05],
          title: "Nieve",
          date: "2025-09-28",
          amount: "20 cm",
          obs: "Acumulación rápida por bajas temperaturas.",
        },
        {
          coords: [-38.933386, -68.122880],
          title: "Lluvia intensa",
          date: "2025-09-25",
          amount: "30 mm",
          obs: "Tormenta intensa con truenos.",
        },
        {
          coords: [-38.935, -68.055],
          title: "Lluvia",
          date: "2025-09-20",
          amount: "5 mm",
          obs: "Precipitación leve, sin mayores consecuencias.",
        },
      ];

      // Renderizar marcadores
      points.forEach((p) => {
        L.marker(p.coords)
          .addTo(map)
          .bindPopup(
            `
            <div class="divPopup" >
              <strong>${p.title}</strong><br>
              <b>Fecha:</b> ${p.date}<br>
              <b>Cantidad:</b> ${p.amount}<br>
              <b>Observación:</b> ${p.obs}
            </div>
            `
          );
      });
    });
  },
};
</script>

<style>

</style>
