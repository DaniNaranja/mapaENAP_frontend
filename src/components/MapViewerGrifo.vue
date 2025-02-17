<template>
  <div id="map" class="h-screen w-xl rounded-xl drop-shadow-lg"></div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapViewerGrifo",
  props: {
    usosGrifos: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      map: null,
      markers: [], // Lista para almacenar los marcadores
    };
  },
  watch: {
    usosGrifos: {
      deep: true,
      handler(newUsosGrifos) {
        this.actualizarMarcadores(newUsosGrifos);
      },
    },
  },
  mounted() {
  // Crear el mapa
  this.map = L.map("map").setView([-36.77933674462178, -73.12370348487816], 16);

  // Añadir la capa base de OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(this.map);

  // Modificar el prototipo de L.Marker para solucionar el error de zoom
  L.Marker.prototype._animateZoom = function (opt) {
    if (!this._map) {
      return;
    }
    const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
    this._setPos(pos);
  };

  // Renderizar marcadores iniciales
  this.actualizarMarcadores(this.usosGrifos);

  // Manejar clics en el mapa
  this.map.on("click", (e) => {
    const { lat, lng } = e.latlng;
    this.$emit("map-click", { lat, lng }); // Emitir evento con las coordenadas
  });

  // Asegurarse de actualizar los marcadores después de mover o hacer zoom en el mapa
  this.map.on("moveend", () => {
    this.actualizarMarcadores(this.usosGrifos);
  });

  this.map.on("zoomend", () => {
    this.actualizarMarcadores(this.usosGrifos);
  });

  // Limpiar los marcadores y popups después de cerrar un popup
  this.map.on("popupclose", () => {
    // Reiniciar los marcadores cuando se cierra el popup
    this.actualizarMarcadores(this.usosGrifos);
  });
},
  methods: {
    actualizarMarcadores(usosGrifos) {
    // Limpiar los marcadores anteriores
    this.markers.forEach((marker) => {
      this.map.removeLayer(marker);
    });
    this.markers = [];

    // Añadir los nuevos marcadores
    usosGrifos.forEach((usoGrifo) => {
      const markerIcon = L.icon({
        iconUrl: usoGrifo.tipo === "Con bomba" ? "/grifo_bomba.png" : "/grifo_sinbomba.png",
        iconSize: [38, 38],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
      });

      const marker = L.marker([usoGrifo.latitud, usoGrifo.longitud], { icon: markerIcon })
        .addTo(this.map)
        .bindPopup(
          `<strong>${usoGrifo.numero_grifo}</strong><br>Tipo: ${usoGrifo.tipo}<br>Motivo: ${usoGrifo.motivo}`
        );

      this.markers.push(marker);
    });
  },

  },
};
</script>

<style scoped>
#map {
  height: 80vh;
}
</style>
