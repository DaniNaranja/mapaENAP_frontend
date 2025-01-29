<template>
  <div class="home flex">
    <!-- Contenedor izquierdo: Título, mapa y botón -->
    <div class="flex-1 flex flex-col relative w-4/5 mr-5">
      <h1 class="ml-6 mt-2 font-bold text-2xl">Cortes de calles</h1>
      <h2 class="ml-6 mt-2 text-lg">Estos son los cortes de calles autorizados hasta ahora.</h2>

      <!-- Botón sobre el mapa -->
      <button @click="openModal"
        class="soliButton absolute top-6 right-0 p-3 rounded-full bg-green-500 text-white shadow-md hover:bg-green-700">
        <i class="fa-solid fa-plus mx-2"></i>
        <span class="font-semibold" style="font-size: 18px;">Solicitar permiso</span>
      </button>

      <map-viewer class="ml-6 mt-2 mb-2 flex-1" :cortes="cortes"></map-viewer>
    </div>

    <!-- Contenedor derecho: Notificaciones -->
    <div class="bg-white border-l shadow-lg overflow-y-auto" style=" width: 30%;height: calc(100vh - 5rem);">
      <!-- Título de Notificaciones fijo -->
      <div class="sticky top-0 bg-white z-10 p-4 shadow-sm">
        <h2 class="text-xl font-bold">Cortes registrados para hoy</h2>
      </div>

      <!-- Ejemplo de notificaciones -->
      <NotificationCard v-for="(corte, index) in cortes" :key="index" :tipo="corte.tipo" :calle="corte.calle"
        @click="openDetallesModal(corte)" />

    </div>

    <!-- Modal -->
    <Modal ref="modal" @submit="createPermiso" @close="$refs.modal.close()" />

    <!-- Modal de detalles -->
    <ModalDetalles ref="modalDetalles" />
  </div>
</template>

<script>
import axios from "@/plugins/axios";
import Modal from "@/components/ModalSolicitud.vue";
import ModalDetalles from "@/components/ModalDetalle.vue"
import NotificationCard from "@/components/NotificationCard.vue";
import MapViewer from "@/components/MapViewer.vue";
import moment from 'moment-timezone'

export default {
  name: "HomeView",
  components: {
    Modal,
    ModalDetalles,
    NotificationCard,
    MapViewer,
  },
  data() {
    return {
      cortes: [],
    };
  },
  methods: {

    async fetchCortes() {
      try {
        const response = await axios.get("http://localhost:3002/cortes");
        const cortes = response.data;

        // Filtrar los cortes por el día de hoy
        const hoy = moment().tz('America/Santiago').startOf('day'); // Comienza desde las 00:00 del día de hoy
        const finDelDia = moment().tz('America/Santiago').endOf('day'); // Finaliza a las 23:59:59 del día de hoy

        // Filtrar los cortes para solo mostrar los de hoy
        const cortesFiltrados = cortes.filter(corte => {
          // Convertir las fechas de corte a objetos moment
          const inicioFecha = moment(corte.inicio).tz('America/Santiago');
          const terminoFecha = corte.termino ? moment(corte.termino).tz('America/Santiago') : null;

          // Comprobar si la fecha de inicio o de término está dentro del rango de hoy
          return (inicioFecha.isBetween(hoy, finDelDia, null, '[]')) ||
            (terminoFecha && terminoFecha.isBetween(hoy, finDelDia, null, '[]'));
        });

        // Asignar los cortes filtrados
        this.cortes = cortesFiltrados.map(corte => {
          // Formatear las fechas a DD-MM-YYYY
          corte.inicio = moment(corte.inicio).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
          corte.termino = corte.termino ? moment(corte.termino).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss') : null;
          return corte;
        });
      } catch (error) {
        console.error("Error al obtener los cortes:", error);
      }
    },

    async createPermiso(nuevoPermiso) {
      try {
        const response = await axios.post("/permisos", nuevoPermiso);
        // Agregar el nuevo permiso al estado
        this.cortes.push(response.data);
        this.$refs.modal.close(); // Cerrar el modal
      } catch (error) {
        console.error("Error al registrar el permiso:", error);
        alert("Hubo un error al registrar el permiso.");
      }
    },
    openModal() {
      this.$refs.modal.open(); // Abre el modal cuando el botón es clickeado
    },
    openDetallesModal(corte) {
      this.$refs.modalDetalles.open(corte); // Abre el modal de detalles con datos
    },
  },
  mounted() {
    this.fetchCortes();
  }
};
</script>

<style scoped>
/* Ajustes de estilos si es necesario */
.soliButton {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
</style>
