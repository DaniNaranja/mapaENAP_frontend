<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
  >
    <div class="bg-white rounded-lg p-6 w-2/3 h-4/5 flex flex-col relative">
      <h2 class="text-xl font-bold mb-4">Detalles</h2>

      <!-- Contenedor de texto y mapa -->
      <div class="flex flex-1 mb-16">
        <!-- Columna de texto -->
        <div class="flex-1 pr-6 overflow-auto">
          <p class="mb-2">
            <strong>Tipo:</strong>
          </p>
          <!-- Contenedor que cambia de color según el tipo de corte -->
          <div
            :class="[
              'w-full p-2 border rounded mb-2',
              corte.tipo === 'total' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'
            ]"
          >
            {{ corte.tipo === 'total' ? 'Corte Total' : 'Corte Parcial' }}
          </div>
          <p class="mb-2">
            <strong>Calle:</strong>
          </p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ corte.calle }}
          </div>
          <div class="mb-4">
            <div class="flex space-x-4">
              <!-- Latitud -->
              <div class="flex-1">
                <label class="block text-sm font-semibold mb-1">Latitud</label>
                <div class="p-2 border rounded bg-gray-200 mb-2">
                  {{ corte.latitud }}
                </div>
              </div>
              <!-- Longitud -->
              <div class="flex-1">
                <label class="block text-sm font-semibold mb-1">Longitud</label>
                <div class="p-2 border rounded bg-gray-200 mb-2">
                  {{ corte.longitud }}
                </div>
              </div>
            </div>
          </div>
          <p class="mb-2">
            <strong>Inicio:</strong>
          </p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ corte.inicio }}
          </div>
          <p class="mb-2">
            <strong>Termino:</strong>
          </p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ corte.termino }}
          </div>
          <p class="mb-2">
            <strong>Motivo:</strong>
          </p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ corte.motivo }}
          </div>
        </div>

        <!-- Columna del mapa -->
        <div class="w-1/2 h-full rounded-xl border">
          <div id="details-map" class="h-full w-full"></div>
        </div>
      </div>

      <!-- Botón para cerrar -->
      <button
        @click="close"
        class="absolute bottom-4 right-4 px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
      >
        Cerrar
      </button>
    </div>
  </div>
</template>

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "ModalDetalles",
  data() {
    return {
      isVisible: false,
      corte: {
        tipo: "",
        descripcion: "",
        latitud: null,
        longitud: null,
      },
      map: null,
      marker: null,
    };
  },
  methods: {
    open(corte) {
      this.corte = corte;
      this.isVisible = true;
      this.$nextTick(() => {
        this.initializeMap();
      });
    },
    close() {
      this.isVisible = false;
      if (this.map) {
        this.map.remove(); // Limpia el mapa al cerrar
        this.map = null;
      }
    },
    initializeMap() {
    if (this.map) {
      this.map.remove(); // Elimina el mapa anterior si existe
    }

    this.map = L.map("details-map").setView(
      [this.corte.latitud, this.corte.longitud],
      16
    );

    // Modificar el prototipo para evitar el error de zoom
    L.Marker.prototype._animateZoom = function (opt) {
      if (!this._map) return;
      const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();
      this._setPos(pos);
    };

    // Capa base de OpenStreetMap
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.map);

    const customIcon = L.icon({
      iconUrl: this.corte.tipo === "total" ? "/marker_red.png" : "/marker_yellow.png",
      iconSize: [40, 40], // Tamaño del ícono
      iconAnchor: [20, 40], // Punto de anclaje
      popupAnchor: [0, -40], // Posición del popup respecto al marcador
    });

    // Añadir el marcador
    this.marker = L.marker([this.corte.latitud, this.corte.longitud], {
      icon: customIcon,
    }).addTo(this.map);

    // Manejar zoom y movimiento para actualizar el marcador
    this.map.on("zoomend", () => this.updateMarker());
    this.map.on("moveend", () => this.updateMarker());
  },
  updateMarker() {
    if (this.marker) {
      this.marker.setLatLng([this.corte.latitud, this.corte.longitud]);
    }
  },
  },
};
</script>

<style scoped>
#details-map {
  height: 100%; /* El mapa ocupará todo el alto disponible de su contenedor */
  width: 100%;
}
</style>
