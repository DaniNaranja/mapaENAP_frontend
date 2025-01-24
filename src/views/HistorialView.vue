<template>
  <div class="home p-6">
    <h1 class="text-2xl font-bold mb-6">Historial de cortes</h1>

    <div class="space-y-4">
      <div class="p-2 rounded-lg">
        <div class="grid grid-cols-6 gap-4 font-bold text-black text-lg">
          <div>Calle</div>
          <div>Motivo</div>
          <div>Inicio</div>
          <div>Termino</div>
          <div>Tipo</div>
        </div>
      </div>

      <!-- Filas de datos -->
      <div
        v-for="corte in cortes"
        :key="corte.id"
        @click="openModal(corte)"
        class="bg-slate-200 p-4 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 cursor-pointer"
      >
        <div class="grid grid-cols-6 gap-4 mt-2">
          <div class="text-base text-gray-800">{{ corte.calle }}</div>
          <div class="text-base text-gray-800 truncate">{{ corte.motivo }}</div>
          <div class="text-base text-gray-800">{{ corte.inicio }}</div>
          <div class="text-base text-gray-800">{{ corte.termino }}</div>
          <div class="text-base">
            <span
              :class="{
                'bg-red-500 text-white': corte.tipo === 'Total',
                'bg-yellow-500 text-white': corte.tipo === 'Parcial',
              }"
              class="inline-block px-4 py-2 rounded-full text-base font-bold capitalize"
            >
              {{ corte.tipo }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="isModalVisible"
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
            selectedCorte.tipo === 'Total' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'
          ]"
        >
          {{ selectedCorte.tipo === 'Total' ? 'Corte Total' : 'Corte Parcial' }}
        </div>
        <p class="mb-2">
          <strong>Calle:</strong>
        </p>
        <div class="w-full p-2 border rounded bg-gray-200 mb-2">
          {{ selectedCorte.calle }}
        </div>
        <div class="mb-4">
          <div class="flex space-x-4">
            <!-- Latitud -->
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-1">Latitud</label>
              <div class="p-2 border rounded bg-gray-200 mb-2">
                {{ selectedCorte.latitud }}
              </div>
            </div>
            <!-- Longitud -->
            <div class="flex-1">
              <label class="block text-sm font-semibold mb-1">Longitud</label>
              <div class="p-2 border rounded bg-gray-200 mb-2">
                {{ selectedCorte.longitud }}
              </div>
            </div>
          </div>
        </div>
        <p class="mb-2">
          <strong>Inicio:</strong>
        </p>
        <div class="w-full p-2 border rounded bg-gray-200 mb-2">
          {{ selectedCorte.inicio }}
        </div>
        <p class="mb-2">
          <strong>Termino:</strong>
        </p>
        <div class="w-full p-2 border rounded bg-gray-200 mb-2">
          {{ selectedCorte.termino }}
        </div>
        <p class="mb-2">
          <strong>Motivo:</strong>
        </p>
        <div class="w-full p-2 border rounded bg-gray-200 mb-2">
          {{ selectedCorte.motivo }}
        </div>
      </div>

      <!-- Columna del mapa -->
      <div class="w-1/2 h-full rounded-xl border">
        <div id="map" class="h-full w-full"></div>
      </div>
    </div>

    <!-- Botón para cerrar -->
    <button
      @click="closeModal"
      class="absolute bottom-4 right-4 px-5 py-2 bg-gray-500 text-white rounded hover:bg-gray-700"
    >
      Cerrar
    </button>
      </div>
    </div>
  </div>
</template>

<script>
import L from "leaflet";

export default {
  name: "HistorialView",
  data() {
    return {
      cortes: [
        {
          id: 1,
          tipo: "Total",
          calle: "Corte total en calle Principal",
          latitud: -36.7793,
          longitud: -73.1237,
          inicio: "24-01-2025 15:30",
          termino: "24-01-2025 20:00",
          motivo: "Reparaciones en via x",
        },
        {
          id: 2,
          tipo: "Parcial",
          calle: "Corte parcial en calle Secundaria",
          latitud: -36.7800,
          longitud: -73.1200,
          inicio: "24-01-2025 15:00",
          termino: "24-01-2025 20:00",
          motivo: "Remoción de materiales",
        },
      ],
      isModalVisible: false,
      selectedCorte: null,
      mapInstance: null, // Instancia del mapa
    };
  },
  methods: {
    openModal(corte) {
      this.selectedCorte = corte;
      this.isModalVisible = true;

      this.$nextTick(() => {
        if (!this.mapInstance) {
          this.initMap(corte.latitud, corte.longitud, corte.tipo);
        }
      });
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedCorte = null;

      if (this.mapInstance) {
        this.mapInstance.remove(); // Destruye el mapa para evitar conflictos
        this.mapInstance = null;
      }
    },
    initMap(lat, lon, tipo) {
      this.mapInstance = L.map("map").setView([lat, lon], 16);

      const iconUrl = tipo === "Total" ? "/marker_red.png" : "/marker_yellow.png";
      const customIcon = L.icon({
        iconUrl,
        iconSize: [45, 45],
        iconAnchor: [19, 38],
        popupAnchor: [0, -38],
      });

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.mapInstance);

      L.marker([lat, lon], { icon: customIcon })
        .addTo(this.mapInstance)
        .bindPopup("Ubicación del corte")
        .openPopup();
    },
  },
};
</script>
