<template>
  <div class="home p-6 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
    <h1 class="text-2xl font-bold mb-6">Historial uso de grifos</h1>

    <div class="flex justify-end space-x-4 mb-4">

      <!-- Campo de búsqueda -->
      <input v-model="searchQuery" type="text" placeholder="Buscar uso de grifos por motivo, tipo o numero de grifo"
        class="p-2 border rounded w-1/3">

      <!-- Ordenar por -->
      <select v-model="sortBy" class="p-2 border rounded">
        <option value="id">ID</option>
      </select>

      <!-- Orden Ascendente/Descendente -->
      <button @click="toggleSortOrder" class="py-2 px-4 border rounded bg-gray-200 flex items-center gap-2 w-40">
        <i v-if="sortOrder === 'asc'" class=" fa-solid fa-arrow-up h-5 w-5 text-gray-700" />
        <i v-else class="fa-solid fa-arrow-down h-5 w-5 text-gray-700"></i>
        <span>{{ sortOrder === 'asc' ? 'Ascendente' : 'Descendente' }}</span>
      </button>
    </div>

    <!-- Scrollable table section -->
    <div class="flex-1 overflow-y-auto">
      <div class="space-y-4">
        <!-- Table header -->
        <div class="p-2 rounded-lg">
          <div class="grid grid-cols-7 gap-4 font-bold text-black text-lg">
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
          <div v-for="usoGrifo in filteredAndSortedUsosGrifos" :key="usoGrifo.id" @click="openModal(usoGrifo)"
            class="bg-slate-200 p-5 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 cursor-pointer mt-3">
            <div class="grid grid-cols-7 gap-6">
              <div class="text-base text-gray-800">{{ usoGrifo.id }}</div>
              <div class="text-base text-gray-800 truncate max-w-[150px]">{{ usoGrifo.numero_grifo }}</div>
              <div class="text-base text-gray-800 truncate">{{ usoGrifo.motivo }}</div>
              <div class="text-base text-gray-800">{{ usoGrifo.inicio }}</div>
              <div class="text-base text-gray-800">{{ usoGrifo.termino }}</div>
              <div class="text-base">
                <span :class="{
                  'bg-blue-500 text-white': usoGrifo.tipo === 'Con bomba',
                  'bg-green-500 text-white': usoGrifo.tipo === 'Sin bomba',
                }" class="inline-block px-8 py-2 rounded-full text-base font-bold">
                  {{ usoGrifo.tipo }}
                </span>
              </div>
              <div class="flex bg-gray-400 justify-center items-center p-2 w-20 rounded-md">
                <button @click.stop="eliminarUsoGrifo(usoGrifo.id)"
                  class="text-slate-800 hover:text-red-800 transition-all duration-300 p-2 rounded-full flex justify-center items-center">
                  <i class="fa-solid fa-trash-can text-2xl"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 w-2/3 h-4/5 flex flex-col relative">
        <button @click="closeModal" class="absolute top-4 right-4 text-2xl font-bold text-gray-600 hover:text-gray-800">
          <i class="fa-solid fa-xmark"></i>
        </button>

        <h2 class="text-xl font-bold mb-4">Detalles</h2>

        <!-- Contenedor de texto y mapa -->
        <div class="flex flex-1 mb-16">
          <!-- Columna de texto -->
          <div class="flex-1 pr-6 overflow-auto">
            <p class="mb-2">
              <strong>Tipo:</strong>
            </p>
            <!-- Dropdown para editar el tipo -->
            <select v-if="isEditing" v-model="selectedUsoGrifo.tipo" class="w-full p-2 border rounded mb-2">
              <option value="Con bomba">Con bomba</option>
              <option value="Sin bomba">Sin bomba</option>
            </select>
            <div v-else class="w-full p-2 border rounded mb-2" :class="[
              selectedUsoGrifo.tipo === 'Con bomba' ? 'bg-blue-100 border-blue-500' : 'bg-green-100 border-green-500'
            ]">
              {{ selectedUsoGrifo.tipo === 'Con bomba' ? 'Con bomba' : 'Sin bomba' }}
            </div>

            <p class="mb-2">
              <strong>Numero de grifo (ubicación):</strong>
            </p>
            <!-- Campo de texto para editar calle -->
            <input v-if="isEditing" v-model="selectedUsoGrifo.numero_grifo" class="w-full p-2 border rounded mb-2" />
            <div v-else class="w-full p-2 border rounded bg-gray-200 mb-2">
              {{ selectedUsoGrifo.numero_grifo }}
            </div>

            <div class="mb-4">
              <div class="flex space-x-4">
                <!-- Latitud -->
                <div class="flex-1">
                  <label class="block text-sm font-semibold mb-1">Latitud</label>
                  <div class="p-2 border rounded bg-gray-200 mb-2">
                    {{ selectedUsoGrifo.latitud }}
                  </div>
                </div>
                <!-- Longitud -->
                <div class="flex-1">
                  <label class="block text-sm font-semibold mb-1">Longitud</label>
                  <div class="p-2 border rounded bg-gray-200 mb-2">
                    {{ selectedUsoGrifo.longitud }}
                  </div>
                </div>
              </div>
            </div>

            <p class="mb-2">
              <strong>Inicio:</strong>
            </p>
            <!-- Campo de texto para editar inicio -->
            <input v-if="isEditing" v-model="selectedUsoGrifo.inicio" type="datetime-local"
              class="w-full p-2 border rounded mb-2" />
            <div v-else class="w-full p-2 border rounded bg-gray-200 mb-2">
              {{ selectedUsoGrifo.inicio }}
            </div>

            <p class="mb-2">
              <strong>Termino:</strong>
            </p>
            <!-- Campo de texto para editar término -->
            <input v-if="isEditing" v-model="selectedUsoGrifo.termino" type="datetime-local"
              class="w-full p-2 border rounded mb-2" />
            <div v-else class="w-full p-2 border rounded bg-gray-200 mb-2">
              {{ selectedUsoGrifo.termino }}
            </div>

            <p class="mb-2">
              <strong>Motivo:</strong>
            </p>
            <!-- Campo de texto para editar motivo -->
            <textarea v-if="isEditing" v-model="selectedUsoGrifo.motivo" class="w-full p-2 border rounded mb-2"></textarea>
            <div v-else class="w-full p-2 border rounded bg-gray-200 mb-2">
              {{ selectedUsoGrifo.motivo }}
            </div>
          </div>

          <!-- Columna del mapa -->
          <div class="w-1/2 h-full rounded-xl border">
            <div id="map" class="h-full w-full"></div>
          </div>
        </div>

        <!-- Botones de Edición y Guardado -->
        <button v-if="!isEditing" @click="startEditing"
          class="absolute bottom-4 right-4 px-6 py-3 bg-blue-500 text-white rounded-lg text-lg hover:bg-blue-400">
          Editar
        </button>

        <!-- Botón para guardar -->
        <button v-if="isEditing" @click="saveChanges"
          class="absolute bottom-4 right-4 px-6 py-3 bg-green-500 text-white rounded-lg text-lg hover:bg-green-700">
          Guardar
        </button>

      </div>
    </div>

  </div>
</template>

<script>
import moment from "moment-timezone";
import axios from "@/plugins/axios";
import L from "leaflet";
import { useToast } from 'vue-toastification';

export default {
  name: "HistorialView",
  data() {
    return {
      isEditing: false,
      usosGrifos: [],
      isModalVisible: false,
      selectedUsoGrifo: null,
      mapInstance: null, // Instancia del mapa
      searchQuery: "",
      sortBy: "id",
      sortOrder: "desc",
    };
  },
  methods: {

    toggleSortOrder() {
      this.sortOrder = this.sortOrder === "asc" ? "desc" : "asc";
    },
    startEditing() {
      this.isEditing = true; // Cambiar el estado a modo de edición
    },

    async saveChanges() {
      if (!this.selectedUsoGrifo || !this.selectedUsoGrifo.id) {
        console.error("No hay un usoGrifo seleccionado para actualizar.");
        return;
      }

      const token = localStorage.getItem("authToken");

      try {
        const response = await axios.put(
          `http://localhost:3002/usosGrifos/${this.selectedUsoGrifo.id}`,
          {
            tipo: this.selectedUsoGrifo.tipo,
            numero_grifo: this.selectedUsoGrifo.numero_grifo,
            latitud: this.selectedUsoGrifo.latitud,
            longitud: this.selectedUsoGrifo.longitud,
            inicio: this.selectedUsoGrifo.inicio,
            termino: this.selectedUsoGrifo.termino,
            motivo: this.selectedUsoGrifo.motivo,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Actualiza la lista de usoGrifos en la UI
          const index = this.usosGrifos.findIndex(c => c.id === this.selectedUsoGrifo.id);
          if (index !== -1) {
            this.usosGrifos[index] = { ...this.selectedUsoGrifo };
          }

          this.toast.success("Uso de grifo actualizado correctamente");
          this.isEditing = false; // Salir del modo edición
        }
      } catch (error) {
        console.error("Error al actualizar el uso de grifo:", error);
        this.toast.error("Hubo un error al actualizar el uso de grifo");
      }
    },

    async eliminarUsoGrifo(id) {
      const token = localStorage.getItem('authToken');

      try {
        // Realizar el DELETE en la base de datos
        const response = await axios.delete(`http://localhost:3002/usosGrifos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Si la eliminación es exitosa, eliminar el permiso de la lista de Vue
          this.usosGrifos = this.usosGrifos.filter(usoGrifo => usoGrifo.id !== id);
          this.toast.success("Uso de grifo eliminado correctamente");
        }
      } catch (error) {
        console.error("Error al eliminar el uso de grifo:", error);
        this.toast.error("Hubo un error al eliminar el uso de grifo");
      }
    },

    convertirATemporal(timestamp) {
      if (!timestamp) return null;
      // Usar el formato DD-MM-YYYY para la fecha
      return moment(timestamp).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
    },

    async fetchUsosGrifos() {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        const response = await axios.get("http://localhost:3002/usosGrifos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        this.usosGrifos = response.data;
        this.usosGrifos.map((usoGrifo) => {
          usoGrifo.inicio = this.convertirATemporal(usoGrifo.inicio);
          usoGrifo.termino = this.convertirATemporal(usoGrifo.termino);
        })
        this.usosGrifos.sort((a, b) => b.id - a.id); // Descending order by ID

      } catch (error) {
        console.error("Error al obtener los usos de grifos:", error);
        if (error.response && error.response.status === 401) {
          console.error("No autorizado. Verifique el token.");
        }
      }
    },
    openModal(usoGrifo) {
      this.selectedUsoGrifo = usoGrifo;
      this.isModalVisible = true;

      this.$nextTick(() => {
        if (!this.mapInstance) {
          this.initMap(usoGrifo.latitud, usoGrifo.longitud, usoGrifo.tipo);
        }
      });
    },
    closeModal() {
      this.isModalVisible = false;
      this.selectedUsoGrifo = null;

      if (this.mapInstance) {
        this.mapInstance.remove(); // Destruye el mapa para evitar conflictos
        this.mapInstance = null;
      }
    },
    initMap(lat, lon, tipo) {
      this.mapInstance = L.map("map").setView([lat, lon], 16);

      const iconUrl = tipo === "Con bomba" ? "/grifo_bomba.png" : "/grifo_sinbomba.png";
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
        .bindPopup("Ubicación del grifo")
        //Revisar error leaflet tras cerrar pop up
    },
  },
  mounted() {
    this.fetchUsosGrifos();
  },
  computed: {
    toast() {
      return useToast();
    },

    filteredAndSortedUsosGrifos() {
    return this.usosGrifos
      .filter(usoGrifo => 
        
        usoGrifo.motivo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usoGrifo.tipo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        usoGrifo.numero_grifo.toLowerCase().includes(this.searchQuery.toLowerCase())


      )
      .sort((a, b) => {
      let valueA = a[this.sortBy];
      let valueB = b[this.sortBy];

      // Si estamos ordenando por "tipo", usamos una prioridad para "total" y "parcial"

      if (this.sortOrder === "asc") {
        return valueA > valueB ? 1 : -1;
      } else {
        return valueA < valueB ? 1 : -1;
      }
    });
}
  },
};
</script>
