<template>
  <div class="home p-6 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
    <h1 class="text-2xl font-bold mb-6">Historial de cortes</h1>

    <!-- Scrollable table section -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-4">
        <!-- Table header -->
        <div class="p-2 rounded-lg">
          <div class="grid grid-cols-6 gap-4 font-bold text-black text-lg">
            <div>ID</div>
            <div>Calle</div>
            <div>Motivo</div>
            <div>Inicio</div>
            <div>Termino</div>
            <div>Tipo</div>
          </div>
        </div>

        <!-- Scrollable table body -->
        <div>
          <div
            v-for="corte in cortes"
            :key="corte.id"
            @click="openModal(corte)"
            class="bg-slate-200 p-5 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 cursor-pointer mt-3"
          >
            <div class="grid grid-cols-6 gap-6">
              <div class="text-base text-gray-800">{{ corte.id }}</div>
              <div class="text-base text-gray-800 truncate max-w-[150px]">{{ corte.calle }}</div>
              <div class="text-base text-gray-800 truncate">{{ corte.motivo }}</div>
              <div class="text-base text-gray-800">{{ corte.inicio }}</div>
              <div class="text-base text-gray-800">{{ corte.termino }}</div>
              <div class="text-base">
                <span
                  :class="{
                    'bg-red-500 text-white': corte.tipo === 'total',
                    'bg-yellow-500 text-white': corte.tipo === 'parcial',
                  }"
                  class="inline-block px-4 py-2 rounded-full text-base font-bold capitalize"
                >
                  {{ corte.tipo }}
                </span>
              </div>
            </div>
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
            selectedCorte.tipo === 'total' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'
          ]"
        >
          {{ selectedCorte.tipo === 'total' ? 'Corte Total' : 'Corte Parcial' }}
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
import moment from "moment-timezone";
import axios from "@/plugins/axios";
import L from "leaflet";

export default {
  name: "HistorialView",
  data() {
    return {
      cortes: [],
      isModalVisible: false,
      selectedCorte: null,
      mapInstance: null, // Instancia del mapa
    };
  },
  methods: {

    convertirATemporal(timestamp) {
    if (!timestamp) return null;
    // Usar el formato DD-MM-YYYY para la fecha
    return moment(timestamp).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
  },

    async fetchCortes() {
  try {
    // Retrieve the token from localStorage
    const token = localStorage.getItem('authToken');
    
    if (!token) {
      console.error("Token no encontrado. Por favor, inicie sesión.");
      return;
    }
    
    const response = await axios.get("http://localhost:3002/cortes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    this.cortes = response.data;
    this.cortes.map((corte) => {
      corte.inicio = this.convertirATemporal(corte.inicio);
      corte.termino = this.convertirATemporal(corte.termino);
    })
    this.cortes.sort((a, b) => b.id - a.id); // Descending order by ID

  } catch (error) {
    console.error("Error al obtener los cortes:", error);
    if (error.response && error.response.status === 401) {
      console.error("No autorizado. Verifique el token.");
    }
  }
},
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

      const iconUrl = tipo === "total" ? "/marker_red.png" : "/marker_yellow.png";
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
  mounted() {
    this.fetchCortes();
  }
};
</script>
