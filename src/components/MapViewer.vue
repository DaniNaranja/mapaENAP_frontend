<template>
    <div id="map" class="h-screen w-xl rounded-xl drop-shadow-lg"></div>
  </template>
  
  <script>
  import L from 'leaflet';
  import 'leaflet/dist/leaflet.css';
  
  export default {
    name: 'MapViewer',
    mounted() {
      // Crear el mapa
      const map = L.map('map').setView([-36.77933674462178, -73.12370348487816], 16); // Latitud y longitud inicial, zoom inicial
  
      // Añadir la capa base de OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);
  
      // Puedes agregar marcadores o funcionalidades extra aquí
      /*L.marker([40.7128, -74.006])
        .addTo(map)
        .bindPopup('Un marcador de ejemplo.')
        .openPopup();*/
    },
  };
  </script>
  
  <style scoped>
  #map {
    height: 80vh; /* Altura completa del viewport */
      /* Ancho completo */
  }
  </style>
  