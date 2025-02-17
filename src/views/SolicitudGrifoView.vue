<template>
  <div class="home p-6 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
    <h1 class="text-2xl font-bold mb-6">Permisos</h1>
    <div class="flex justify-end space-x-4 mb-4">

      <!-- Campo de búsqueda -->
      <input v-model="searchQuery" type="text" placeholder="Buscar permisos por solicitante, motivo, tipo o fecha..."
        class="p-2 border rounded w-1/3">

      <!-- Ordenar por -->
      <select v-model="sortBy" class="p-2 border rounded">
        <option value="id">ID</option>
        <option value="fecha">Fecha</option>
        <option value="estado">Estado</option>
      </select>

      <!-- Orden Ascendente/Descendente -->
      <button @click="toggleSortOrder" class="py-2 px-4 border rounded bg-gray-200 flex items-center gap-2 w-40">
        <i v-if="sortOrder === 'asc'" class=" fa-solid fa-arrow-up h-5 w-5 text-gray-700" />
        <i v-else class="fa-solid fa-arrow-down h-5 w-5 text-gray-700"></i>
        <span>{{ sortOrder === 'asc' ? 'Ascendente' : 'Descendente' }}</span>
      </button>
    </div>

    <div class="flex-1 overflow-y-auto">
      <div class="space-y-4">
      <!-- Encabezado de la tabla -->
      <div class="p-2 rounded-lg">
        <div class="grid grid-cols-7 gap-5 font-bold text-black text-lg">
          <div>ID</div>
          <div>Tipo</div>
          <div>Solicitante</div>
          <div>Motivo</div>
          <div>Fecha</div>
          <div>Estado</div>
        </div>
      </div>

      <!-- Mostrar mensaje si no hay permisos -->
      <div v-if="permisos.length === 0" class="text-center text-gray-500 p-4">
        No hay permisos registrados.
      </div>

      <!-- Filas de datos -->
      <div v-else v-for="permiso in filteredAndSortedPermisos" :key="permiso.id" @click="openModal(permiso)"
        class="bg-slate-200 p-4 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 cursor-pointer">
        <div class="grid grid-cols-7 gap-5 mt-2">
          <div class="text-base text-gray-800">{{ permiso.id }}</div>
          <div class="text-base">
            <span :class="{
              'bg-red-500 text-white': permiso.tipo === 'total',
              'bg-yellow-500 text-white': permiso.tipo === 'parcial'
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
              'bg-slate-600 text-white': permiso.estado === 'En revision',
              'bg-green-500 text-white': permiso.estado === 'AUTORIZADO',
              'bg-red-500 text-white': permiso.estado === 'RECHAZADO',
            }" class="inline-block px-4 py-2 rounded-full text-base font-bold">
              {{ permiso.estado }}
            </span>
          </div>
          <div class="flex justify-center items-center bg-gray-400 p-2 w-20 rounded-md">
            <button @click.stop="eliminarPermiso(permiso.id)"
              class="text-slate-800 hover:text-red-800 transition-all duration-300 p-2 rounded-full flex justify-center items-center">
              <i class="fa-solid fa-trash-can text-2xl"></i>
            </button>
          </div>


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
          <div class="flex justify-between items-center mb-4">
            <!-- Título -->
            <h2 class="text-2xl font-bold">Detalle del Permiso</h2>

            <!-- Botones de edición -->
            <div class="flex space-x-4">
              <button v-if="!isEditing" @click="startEditing"
                class="px-5 py-2 bg-slate-500 text-white rounded hover:bg-blue-700">
                Editar
              </button>
              <button v-if="isEditing" @click="saveChanges"
                class="px-5 py-2 bg-slate-500 text-white rounded hover:bg-blue-700">
                Guardar
              </button>
              <button v-if="isEditing" @click="cancelEditing"
                class="px-5 py-2 bg-red-500 text-white rounded hover:bg-red-700">
                Cancelar
              </button>

            </div>
          </div>

          <!-- Campo editable -->
          <p class="mb-2"><strong>ID:</strong></p>
          <div class="w-full p-2 border rounded bg-gray-200 mb-2">
            {{ selectedPermiso.id }}
          </div>

          <p class="mb-2"><strong>Tipo:</strong></p>
          <select v-model="selectedPermiso.tipo" :disabled="!isEditing" class="w-full p-2 border rounded mb-2"
            :class="selectedPermiso.tipo === 'total' ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-500'">
            <option value="total">Corte Total</option>
            <option value="parcial">Corte Parcial</option>
          </select>

          <p class="mb-2"><strong>Solicitante:</strong></p>
          <input v-model="selectedPermiso.solicitante" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Correo electrónico:</strong></p>
          <input v-model="selectedPermiso.email" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Motivo:</strong></p>
          <input v-model="selectedPermiso.motivo" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Fecha:</strong></p>
          <p  v-if="!isEditing" class="w-full p-2 border rounded  mb-2"> {{ selectedPermiso.fecha }}</p>
          <input v-else v-model="selectedPermiso.fecha" type="date" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Inicio:</strong></p>
          <p  v-if="!isEditing" class="w-full p-2 border rounded mb-2"> {{ selectedPermiso.inicio }}</p>
          <input v-else v-model="selectedPermiso.inicio" type="datetime-local" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Término:</strong></p>
          <p  v-if="!isEditing" class="w-full p-2 border rounded mb-2"> {{ selectedPermiso.termino }}</p>

          <input v-else v-model="selectedPermiso.termino" type="datetime-local" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Calle:</strong></p>
          <input v-model="selectedPermiso.calle" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Observación:</strong></p>
          <textarea v-model="selectedPermiso.observacion" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2"></textarea>
        </div>

        <!-- Contenedor del mapa -->
        <div class="w-1/2 h-full rounded-xl flex flex-col mt-6 ml-2">
          <!-- Mapa -->
          <div id="map" class="h-5/6 w-full rounded-xl"></div>

          <!-- Botones de Autorizar y Rechazar -->
          <div v-if="selectedPermiso.estado === 'En revision' || isEditing" class="flex justify-between mt-10">
            <button @click="autorizarPermiso"
              class="bg-green-500 text-white p-4 rounded-lg w-1/2 mr-2 hover:bg-green-600">
              Autorizar
            </button>
            <button @click="rechazarPermiso" class="bg-red-500 text-white p-4 rounded-lg w-1/2 hover:bg-red-600">
              Rechazar
            </button>
          </div>

          <!-- Botones de edición -->

        </div>
      </div>
    </div>


  </div>
</template>

<script>
import moment from 'moment-timezone';
import axios from "@/plugins/axios";
import L from 'leaflet';
import { useToast } from 'vue-toastification';

export default {
  name: "PermisosView",
  data() {
    return {
      isEditing: false,
      originalPermiso: null,
      permisos: [],
      isModalVisible: false,
      selectedPermiso: null,
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
      this.isEditing = true;
      this.originalPermiso = JSON.parse(JSON.stringify(this.selectedPermiso)); // Cambiar el estado a modo de edición
    },
    cancelEditing() {
      if (this.originalPermiso) {
        this.selectedPermiso = JSON.parse(JSON.stringify(this.originalPermiso)); // Restaura los valores originales
      }
      this.isEditing = false; // Sale del modo edición
    },


    async saveChanges() {
      if (!this.selectedPermiso || !this.selectedPermiso.id) {
        console.error("No hay un permiso seleccionado para actualizar.");
        return;
      }

      const token = localStorage.getItem("authToken");

      try {
        // Crear un objeto con solo los campos modificados
        const updatedData = {};

        // Solo agrega las propiedades modificadas
        if (this.selectedPermiso.tipo) updatedData.tipo = this.selectedPermiso.tipo;
        if (this.selectedPermiso.fecha) updatedData.fecha = this.selectedPermiso.fecha;
        if (this.selectedPermiso.solicitante) updatedData.solicitante = this.selectedPermiso.solicitante;
        if (this.selectedPermiso.email) updatedData.email = this.selectedPermiso.email;
        if (this.selectedPermiso.inicio) updatedData.inicio = this.selectedPermiso.inicio;
        if (this.selectedPermiso.termino) updatedData.termino = this.selectedPermiso.termino;
        if (this.selectedPermiso.calle) updatedData.calle = this.selectedPermiso.calle;
        if (this.selectedPermiso.latitud) updatedData.latitud = this.selectedPermiso.latitud;
        if (this.selectedPermiso.longitud) updatedData.longitud = this.selectedPermiso.longitud;
        if (this.selectedPermiso.observacion) updatedData.observacion = this.selectedPermiso.observacion;
        if (this.selectedPermiso.estado) updatedData.estado = this.selectedPermiso.estado;
        if (this.selectedPermiso.motivo) updatedData.motivo = this.selectedPermiso.motivo;

        const response = await axios.put(
          `http://localhost:3002/permisos/${this.selectedPermiso.id}`,
          updatedData, // Enviar solo los datos modificados
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Actualiza la lista de permisos en la UI
          const index = this.permisos.findIndex(c => c.id === this.selectedPermiso.id);
          if (index !== -1) {
            this.permisos[index] = { ...this.selectedPermiso };
          }

          this.toast.success("Permiso actualizado correctamente");
          this.isEditing = false; // Salir del modo edición
          this.originalPermiso = null;
        }
      } catch (error) {
        console.error("Error al actualizar el permiso:", error);
        this.toast.error("Hubo un error al actualizar el permiso");
      }
    },


    convertirAFecha(fecha) {
      if (!fecha) return null;
      return moment(fecha).format('DD-MM-YYYY');

    },

    convertirATemporal(timestamp) {
      if (!timestamp) return null;
      // Usar el formato DD-MM-YYYY para la fecha
      return moment(timestamp).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
    },


    async fetchPermisos() {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        const response = await axios.get("http://localhost:3002/permisos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Asegurarse de que la respuesta sea un array
        this.permisos = Array.isArray(response.data) ? response.data : [];

        // Si no hay permisos, establecer un mensaje
        if (this.permisos.length === 0) {
          console.log("No hay permisos disponibles.");
        } else {
          // Realizar conversiones a las fechas
          this.permisos.map((permiso) => {
            permiso.fecha = this.convertirAFecha(permiso.fecha);
            permiso.inicio = this.convertirATemporal(permiso.inicio);
            permiso.termino = this.convertirATemporal(permiso.termino);
          });
          this.permisos.sort((a, b) => b.id - a.id); // Descending order by ID
        }

      } catch (error) {
        console.error("Error al obtener los permisos:", error);
        if (error.response && error.response.status === 401) {
          console.error("No autorizado. Verifique el token.");
        }
        // Asegurarse de que permisos sea un array vacío en caso de error
        this.permisos = [];
      }
    },




    openModal(permiso) {
      this.selectedPermiso = { ...permiso };

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
      const iconUrl = tipo === "total" ? "/marker_red.png" : "/marker_yellow.png";
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
    async autorizarPermiso() {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        // Send the full data along with the modified status
        const permisoData = {
          ...this.selectedPermiso, // Spread the existing permission data
          estado: "AUTORIZADO", // Update the status
        };

        // Send the update request to the backend
        const response = await axios.put(`http://localhost:3002/permisos/${this.selectedPermiso.id}`, permisoData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check for successful response and show toast
        if (response.status === 200) {
          // Update the state of the permiso in the list directly
          const index = this.permisos.findIndex(p => p.id === this.selectedPermiso.id);
          if (index !== -1) {
            this.permisos[index].estado = "AUTORIZADO";
          }
          this.permisos.sort((a, b) => b.id - a.id); // Descending order by ID


          this.toast.success("Permiso autorizado correctamente");
          this.closeModal();
        } else {
          this.toast.error("Hubo un error al autorizar el permiso");
        }
      } catch (error) {
        console.error("Error al autorizar el permiso:", error);
        this.toast.error("Hubo un error al autorizar el permiso");
      }
    },

    async rechazarPermiso() {
      try {
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        // Send the full data along with the modified status
        const permisoData = {
          ...this.selectedPermiso, // Spread the existing permission data
          estado: "RECHAZADO", // Update the status
        };

        // Send the update request to the backend
        const response = await axios.put(`http://localhost:3002/permisos/${this.selectedPermiso.id}`, permisoData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check for successful response and show toast
        if (response.status === 200) {
          // Update the state of the permiso in the list directly
          const index = this.permisos.findIndex(p => p.id === this.selectedPermiso.id);
          if (index !== -1) {
            this.permisos[index].estado = "RECHAZADO";
          }

          this.permisos.sort((a, b) => b.id - a.id); // Descending order by ID


          this.toast.error("Permiso rechazado correctamente");
          this.closeModal();
        } else {
          this.toast.error("Hubo un error al rechazar el permiso");
        }
      } catch (error) {
        console.error("Error al rechazar el permiso:", error);
        this.toast.error("Hubo un error al rechazar el permiso");
      }
    },

    async eliminarPermiso(id) {
      const token = localStorage.getItem('authToken');

      try {
        // Realizar el DELETE en la base de datos
        const response = await axios.delete(`http://localhost:3002/permisos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Si la eliminación es exitosa, eliminar el permiso de la lista de Vue
          this.permisos = this.permisos.filter(permiso => permiso.id !== id);
          this.toast.success("Permiso eliminado correctamente");
        }
      } catch (error) {
        console.error("Error al eliminar el permiso:", error);
        this.toast.error("Hubo un error al eliminar el permiso");
      }
    }



  },
  mounted() {
    this.fetchPermisos();
  },
  computed: {
    toast() {
      return useToast();
    },
    filteredAndSortedPermisos() {
      return this.permisos
        .filter(permiso =>
          permiso.solicitante.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          permiso.motivo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          permiso.tipo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          permiso.fecha.toLowerCase().includes(this.searchQuery.toLowerCase())


        )
        .sort((a, b) => {
          let valueA = a[this.sortBy];
          let valueB = b[this.sortBy];

          // Si estamos ordenando por fecha, convertir a Date
          if (this.sortBy === "fecha") {
            valueA = new Date(a.fecha.split('-').reverse().join('-')); // Convierte "DD-MM-YYYY" a "YYYY-MM-DD"
            valueB = new Date(b.fecha.split('-').reverse().join('-'));
          }

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

<style scoped>
/* Agrega estilos para el modal y el mapa */
#map {}
</style>
