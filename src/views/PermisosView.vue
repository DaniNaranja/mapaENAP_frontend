<template>
  <div class="home p-6">
    <h1 class="text-2xl font-bold mb-6">Permisos</h1>

    <div class="space-y-4">
      <!-- Encabezado de la tabla -->
      <div class="p-2 rounded-lg">
        <div class="grid grid-cols-6 gap-4 font-bold text-black text-lg">
          <div>ID</div>
          <div>Tipo</div>
          <div>Solicitante</div>
          <div>Motivo</div>
          <div>Fecha</div>
          <div>Estado</div>
        </div>
      </div>

      <!-- Filas de datos -->
      <div v-for="permiso in permisos" :key="permiso.id" @click="openModal(permiso)"
        class="bg-slate-200 p-4 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 cursor-pointer">
        <div class="grid grid-cols-6 gap-4 mt-2">
          <div class="text-base text-gray-800">{{ permiso.id }}</div>
          <div class="text-base">
            <span :class="{
              'bg-red-500 text-white': permiso.tipo === 'Total',
              'bg-yellow-500 text-white': permiso.tipo === 'Parcial'
            }" class="inline-block px-4 py-2 rounded-full text-base font-bold capitalize">
              {{ permiso.tipo }}
            </span>
          </div>
          <div class="text-base text-gray-800">{{ permiso.solicitante }}</div>
          <div class="text-base text-gray-800 truncate max-w-[150px]">
            {{ permiso.motivo }}
          </div>
          <div class="text-base text-gray-800">{{ permiso.fecha }}</div>
          <div class="text-base">
            <span :class="{
              'bg-slate-600 text-white': permiso.estado === 'En revisión',
              'bg-green-500 text-white': permiso.estado === 'AUTORIZADO',
              'bg-red-500 text-white': permiso.estado === 'RECHAZADO',
            }" class="inline-block px-4 py-2 rounded-full text-base font-bold">
              {{ permiso.estado }}
            </span>
          </div>
        </div>
      </div>

    </div>

    <!-- Modal -->
    <div v-if="isModalVisible" class="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-3/4 flex h-[90vh] relative">

        <!-- Botón de cerrar (X) -->
        <button @click="closeModal" class="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <!-- Contenedor de texto -->
        <div class="w-2/3 pr-4 mb-3 overflow-y-scroll">
          <h2 class="text-2xl font-bold mb-4">Detalle del Permiso</h2>
          <p class="mb-2"><strong>ID:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.id }}
          </div>
          <p class="mb-2"><strong>Tipo:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.tipo }}
          </div>
          <p class="mb-2"><strong>Solicitante:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.solicitante }}
          </div>
          <p class="mb-2"><strong>Motivo:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.motivo }}
          </div>
          <p class="mb-2"><strong>Fecha:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.fecha }}
          </div>
          <p class="mb-2"><strong>Inicio:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.inicio }}
          </div>
          <p class="mb-2"><strong>Termino:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.termino }}
          </div>
          <p class="mb-2"><strong>Calle:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.calle }}
          </div>
          <p class="mb-2"><strong>Observación:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.observacion }}
          </div>
        </div>

        <!-- Contenedor del mapa -->
        <div class="w-1/2 h-full rounded-xl  flex flex-col mt-6 ml-2">
          <!-- Mapa -->
          <div id="map" class="h-5/6 w-full rounded-xl"></div>

          <!-- Botones de Autorizar y Rechazar -->
          <div class="flex justify-between mt-10">
            <button @click="autorizarPermiso"
              class="bg-green-500 text-white p-4 rounded-lg w-1/2 mr-2 hover:bg-green-600">
              Autorizar
            </button>
            <button @click="rechazarPermiso" class="bg-red-500 text-white p-4 rounded-lg w-1/2 hover:bg-red-600">
              Rechazar
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import L from 'leaflet';
import { useToast } from 'vue-toastification';

export default {
  name: "PermisosView",
  data() {
    return {
      permisos: [
        {
          id: 1,
          tipo: "Total",
          fecha: "20-01-2025",
          solicitante: "María Gómez",
          motivo: "Construcción",
          inicio: "24-01-2025 15:30",
          termino: "24-01-2025 20:00",
          calle: "Sur 3",
          latitud: -36.7780,
          longitud: -73.1240,
          observacion: "Puede extenderse por x",
          estado: "En revisión",
        },
        {
          id: 2,
          tipo: "Parcial",
          fecha: "24-01-2025",
          solicitante: "María Gómez",
          motivo: "Hay que poner un texto qlo inmenso porque los usuarios son simios y tal vez usarian la wea mal, si de hecho te enseñan a hacerlo a prueba de cavernicolas",
          inicio: "24-01-2025 15:30",
          termino: "24-01-2025 20:00",
          calle: "Sur 3",
          latitud: -36.7793,
          longitud: -73.1235,
          observacion: "hola",
          estado: "AUTORIZADO",
        },
        {
          id: 3,
          tipo: "Total",
          fecha: "23-01-2025",
          solicitante: "María Gómez",
          motivo: "Construcción",
          inicio: "25-01-2025 15:30",
          termino: "24-01-2025 20:00",
          calle: "Sur 3",
          latitud: -36.7785,
          longitud: -73.1232,
          observacion: "",
          estado: "RECHAZADO",
        },
      ],
      isModalVisible: false,
      selectedPermiso: null,
    };
  },
  methods: {
    openModal(permiso) {
      this.selectedPermiso = permiso;
      this.isModalVisible = true;
      this.$nextTick(() => {
        this.initMap(permiso.latitud, permiso.longitud, permiso.tipo);
      });
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedPermiso = null;
    },
    initMap(lat, lon, tipo) {
      const map = L.map('map').setView([lat, lon], 16);

      // Define el ícono personalizado basado en el tipo de permiso
      const iconUrl = tipo === "Total" ? "/marker_red.png" : "/marker_yellow.png";
      const customIcon = L.icon({
        iconUrl,
        iconSize: [45, 45], // Tamaño del ícono
        iconAnchor: [19, 38], // Punto donde se ancla el ícono
        popupAnchor: [0, -38], // Posición del popup en relación al ícono
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      L.marker([lat, lon], { icon: customIcon })
        .addTo(map)
        .bindPopup("Ubicación del permiso")
        .openPopup();
    },
    autorizarPermiso() {
      this.selectedPermiso.estado = "AUTORIZADO";
      this.toast.success("Permiso autorizado correctamente");
      this.closeModal();
    },
    rechazarPermiso() {
      this.selectedPermiso.estado = "RECHAZADO";
      this.toast.error("Permiso rechazado correctamente");
      this.closeModal();
    },
  },
  computed: {
    toast() {
      return useToast();
    },
  },
};
</script>

<style scoped>
/* Agrega estilos para el modal y el mapa */
#map {}
</style>
