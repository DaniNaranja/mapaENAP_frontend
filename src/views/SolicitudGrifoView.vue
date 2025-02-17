<template>
  <div class="home p-6 h-[calc(100vh-5rem)] overflow-hidden flex flex-col">
    <h1 class="text-2xl font-bold mb-6">Permisos de uso de grifos</h1>
    <div class="flex justify-end space-x-4 mb-4">

      <!-- Campo de búsqueda -->
      <input v-model="searchQuery" type="text" placeholder="Buscar permisosGrifos por solicitante, motivo, tipo o fecha..."
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

      <!-- Mostrar mensaje si no hay permisosGrifos -->
      <div v-if="permisosGrifos.length === 0" class="text-center text-gray-500 p-4">
        No hay permisos de uso de grifo registrados.
      </div>

      <!-- Filas de datos -->
      <div v-else v-for="permisoGrifo in filteredAndSortedPermisosGrifos" :key="permisoGrifo.id" @click="openModal(permisoGrifo)"
        class="bg-slate-200 p-4 rounded-lg shadow-sm hover:bg-slate-300 transition-all duration-300 cursor-pointer">
        <div class="grid grid-cols-7 gap-5 mt-2">
          <div class="text-base text-gray-800">{{ permisoGrifo.id }}</div>
          <div class="text-base">
            <span :class="{
              'bg-blue-500 text-white': permisoGrifo.tipo === 'Con bomba',
              'bg-green-500 text-white': permisoGrifo.tipo === 'Sin bomba'
            }" class="inline-block px-4 py-2 rounded-full text-base font-bold capitalize">
              {{ permisoGrifo.tipo }}
            </span>
          </div>
          <div class="text-base text-gray-800">{{ permisoGrifo.solicitante }}</div>
          <div class="text-base text-gray-800 truncate max-w-[150px]">
            {{ permisoGrifo.motivo }}
          </div>
          <div class="text-base text-gray-800">{{ permisoGrifo.fecha }}</div>
          <div class="text-base">
            <span :class="{
              'bg-slate-600 text-white': permisoGrifo.estado === 'En revision',
              'bg-green-500 text-white': permisoGrifo.estado === 'AUTORIZADO',
              'bg-red-500 text-white': permisoGrifo.estado === 'RECHAZADO',
            }" class="inline-block px-4 py-2 rounded-full text-base font-bold">
              {{ permisoGrifo.estado }}
            </span>
          </div>
          <div class="flex justify-center items-center bg-gray-400 p-2 w-20 rounded-md">
            <button @click.stop="eliminarPermiso(permisoGrifo.id)"
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
            {{ selectedPermisoGrifo.id }}
          </div>

          <p class="mb-2"><strong>Tipo:</strong></p>
          <select v-model="selectedPermisoGrifo.tipo" :disabled="!isEditing" class="w-full p-2 border rounded mb-2"
            :class="selectedPermisoGrifo.tipo === 'Con bomba' ? 'bg-blue-100 border-blue-500' : 'bg-green-100 border-green-500'">
            <option value="Con bomba">Con bomba</option>
            <option value="Sin bomba">Sin bomba</option>
          </select>

          <p class="mb-2"><strong>Solicitante:</strong></p>
          <input v-model="selectedPermisoGrifo.solicitante" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Correo electrónico:</strong></p>
          <input v-model="selectedPermisoGrifo.email" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Motivo:</strong></p>
          <input v-model="selectedPermisoGrifo.motivo" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Fecha:</strong></p>
          <p  v-if="!isEditing" class="w-full p-2 border rounded  mb-2"> {{ selectedPermisoGrifo.fecha }}</p>
          <input v-else v-model="selectedPermisoGrifo.fecha" type="date" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Inicio:</strong></p>
          <p  v-if="!isEditing" class="w-full p-2 border rounded mb-2"> {{ selectedPermisoGrifo.inicio }}</p>
          <input v-else v-model="selectedPermisoGrifo.inicio" type="datetime-local" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Término:</strong></p>
          <p  v-if="!isEditing" class="w-full p-2 border rounded mb-2"> {{ selectedPermisoGrifo.termino }}</p>

          <input v-else v-model="selectedPermisoGrifo.termino" type="datetime-local" :disabled="!isEditing"
            class="w-full p-2 border rounded mb-2" />

          <p class="mb-2"><strong>Numero grifo (Ubicacion):</strong></p>
          <input v-model="selectedPermisoGrifo.numero_grifo" :disabled="!isEditing" class="w-full p-2 border rounded mb-2" />

        </div>

        <!-- Contenedor del mapa -->
        <div class="w-1/2 h-full rounded-xl flex flex-col mt-6 ml-2">
          <!-- Mapa -->
          <div id="map" class="h-5/6 w-full rounded-xl"></div>

          <!-- Botones de Autorizar y Rechazar -->
          <div v-if="selectedPermisoGrifo.estado === 'En revision' || isEditing" class="flex justify-between mt-10">
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
      originalPermisoGrifo: null,
      permisosGrifos: [],
      isModalVisible: false,
      selectedPermisoGrifo: null,
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
      this.originalPermisoGrifo = JSON.parse(JSON.stringify(this.selectedPermisoGrifo)); // Cambiar el estado a modo de edición
    },
    cancelEditing() {
      if (this.originalPermisoGrifo) {
        this.selectedPermisoGrifo = JSON.parse(JSON.stringify(this.originalPermisoGrifo)); // Restaura los valores originales
      }
      this.isEditing = false; // Sale del modo edición
    },


    async saveChanges() {
      if (!this.selectedPermisoGrifo || !this.selectedPermisoGrifo.id) {
        console.error("No hay un permiso seleccionado para actualizar.");
        return;
      }

      const token = localStorage.getItem("authToken");

      try {
        // Crear un objeto con solo los campos modificados
        const updatedData = {};

        // Solo agrega las propiedades modificadas
        if (this.selectedPermisoGrifo.tipo) updatedData.tipo = this.selectedPermisoGrifo.tipo;
        if (this.selectedPermisoGrifo.fecha) updatedData.fecha = this.selectedPermisoGrifo.fecha;
        if (this.selectedPermisoGrifo.solicitante) updatedData.solicitante = this.selectedPermisoGrifo.solicitante;
        if (this.selectedPermisoGrifo.email) updatedData.email = this.selectedPermisoGrifo.email;
        if (this.selectedPermisoGrifo.inicio) updatedData.inicio = this.selectedPermisoGrifo.inicio;
        if (this.selectedPermisoGrifo.termino) updatedData.termino = this.selectedPermisoGrifo.termino;
        if (this.selectedPermisoGrifo.numero_grifo) updatedData.numero_grifo = this.selectedPermisoGrifo.numero_grifo;
        if (this.selectedPermisoGrifo.latitud) updatedData.latitud = this.selectedPermisoGrifo.latitud;
        if (this.selectedPermisoGrifo.longitud) updatedData.longitud = this.selectedPermisoGrifo.longitud;
        if (this.selectedPermisoGrifo.estado) updatedData.estado = this.selectedPermisoGrifo.estado;
        if (this.selectedPermisoGrifo.motivo) updatedData.motivo = this.selectedPermisoGrifo.motivo;

        const response = await axios.put(
          `http://localhost:3002/permisosGrifos/${this.selectedPermisoGrifo.id}`,
          updatedData, // Enviar solo los datos modificados
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (response.status === 200) {
          // Actualiza la lista de permisosGrifos en la UI
          const index = this.permisosGrifos.findIndex(c => c.id === this.selectedPermisoGrifo.id);
          if (index !== -1) {
            this.permisosGrifos[index] = { ...this.selectedPermisoGrifo };
          }

          this.toast.success("Permiso actualizado correctamente");
          this.isEditing = false; // Salir del modo edición
          this.originalPermisoGrifo = null;
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


    async fetchPermisosGrifos() {
      try {
        // Retrieve the token from localStorage
        const token = localStorage.getItem('authToken');

        if (!token) {
          console.error("Token no encontrado. Por favor, inicie sesión.");
          return;
        }

        const response = await axios.get("http://localhost:3002/permisosGrifos", {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Asegurarse de que la respuesta sea un array
        this.permisosGrifos = Array.isArray(response.data) ? response.data : [];

        // Si no hay permisosGrifos, establecer un mensaje
        if (this.permisosGrifos.length === 0) {
          console.log("No hay permisos de uso de grifos disponibles.");
        } else {
          // Realizar conversiones a las fechas
          this.permisosGrifos.map((permisoGrifo) => {
            permisoGrifo.fecha = this.convertirAFecha(permisoGrifo.fecha);
            permisoGrifo.inicio = this.convertirATemporal(permisoGrifo.inicio);
            permisoGrifo.termino = this.convertirATemporal(permisoGrifo.termino);
          });
          this.permisosGrifos.sort((a, b) => b.id - a.id); // Descending order by ID
        }

      } catch (error) {
        console.error("Error al obtener los permisos de uso de grifos:", error);
        if (error.response && error.response.status === 401) {
          console.error("No autorizado. Verifique el token.");
        }
        // Asegurarse de que permisosGrifos sea un array vacío en caso de error
        this.permisosGrifos = [];
      }
    },




    openModal(permisoGrifo) {
      this.selectedPermisoGrifo = { ...permisoGrifo };

      this.isModalVisible = true;

      this.$nextTick(() => {
        this.initMap(permisoGrifo.latitud, permisoGrifo.longitud, permisoGrifo.tipo);
      });
    },


    closeModal() {
      this.isModalVisible = false;
      this.selectedPermisoGrifo = null;
    },
    initMap(lat, lon, tipo) {
      const map = L.map('map').setView([lat, lon], 16);

      // Define el ícono personalizado basado en el tipo de permiso
      const iconUrl = tipo === "Con bomba" ? "/grifo_bomba.png" : "/grifo_sinbomba.png";
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
          ...this.selectedPermisoGrifo, // Spread the existing permission data
          estado: "AUTORIZADO", // Update the status
        };

        // Send the update request to the backend
        const response = await axios.put(`http://localhost:3002/permisosGrifos/${this.selectedPermisoGrifo.id}`, permisoData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check for successful response and show toast
        if (response.status === 200) {
          // Update the state of the permiso in the list directly
          const index = this.permisosGrifos.findIndex(p => p.id === this.selectedPermisoGrifo.id);
          if (index !== -1) {
            this.permisosGrifos[index].estado = "AUTORIZADO";
          }
          this.permisosGrifos.sort((a, b) => b.id - a.id); // Descending order by ID


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
          ...this.selectedPermisoGrifo, // Spread the existing permission data
          estado: "RECHAZADO", // Update the status
        };

        // Send the update request to the backend
        const response = await axios.put(`http://localhost:3002/permisosGrifos/${this.selectedPermisoGrifo.id}`, permisoData, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Check for successful response and show toast
        if (response.status === 200) {
          // Update the state of the permiso in the list directly
          const index = this.permisosGrifos.findIndex(p => p.id === this.selectedPermisoGrifo.id);
          if (index !== -1) {
            this.permisosGrifos[index].estado = "RECHAZADO";
          }

          this.permisosGrifos.sort((a, b) => b.id - a.id); // Descending order by ID


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
        const response = await axios.delete(`http://localhost:3002/permisosGrifos/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          // Si la eliminación es exitosa, eliminar el permiso de la lista de Vue
          this.permisosGrifos = this.permisosGrifos.filter(permisoGrifo => permisoGrifo.id !== id);
          this.toast.success("Permiso eliminado correctamente");
        }
      } catch (error) {
        console.error("Error al eliminar el permiso:", error);
        this.toast.error("Hubo un error al eliminar el permiso");
      }
    }



  },
  mounted() {
    this.fetchPermisosGrifos();
  },
  computed: {
    toast() {
      return useToast();
    },
    filteredAndSortedPermisosGrifos() {
      return this.permisosGrifos
        .filter(permisoGrifo =>
          permisoGrifo.solicitante.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          permisoGrifo.motivo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          permisoGrifo.tipo.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          permisoGrifo.fecha.toLowerCase().includes(this.searchQuery.toLowerCase())


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
