<template>
  <div class="home flex">
    <!-- Contenedor izquierdo: Título, mapa y botón -->
    <div class="flex-1 flex flex-col relative w-4/5 mr-5">
      <h1 class="ml-6 mt-2 font-bold text-2xl">Uso de grifos</h1>
      <h2 class="ml-6 mt-2 text-lg">Estos son los grifos en uso durante el día.</h2>

      <!-- Botón sobre el mapa -->
      <button @click="openModal"
        class="soliButton absolute top-6 right-0 p-3 rounded-full bg-green-500 text-white shadow-md hover:bg-green-700">
        <i class="fa-solid fa-plus mx-2"></i>
        <span class="font-semibold" style="font-size: 18px;">Solicitar uso</span>
      </button>

      <map-viewer-grifo class="ml-6 mt-2 mb-2 flex-1" :usosGrifos="usosGrifos"></map-viewer-grifo>
    </div>

    <!-- Contenedor derecho: Notificaciones -->
    <div class="bg-white border-l shadow-lg overflow-y-auto" style=" width: 30%;height: calc(100vh - 5rem);">
      <!-- Título de Notificaciones fijo -->
      <div class="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center justify-between">
        <h2 class="text-xl font-bold">Uso de grifos de hoy</h2>
        <RouterLink to="/">
          <button class="bg-blue-500 text-white px-4 py-3 rounded-md hover:bg-blue-700">
            Mapa corte de calles
          </button>
        </RouterLink>
      </div>

      <!-- Ejemplo de notificaciones -->
      <NotificationCardGrifo v-for="(usoGrifo, index) in usosGrifos" :key="index" :tipo="usoGrifo.tipo" :numero_grifo="usoGrifo.numero_grifo"
        @click="openDetallesModal(usoGrifo)" />

    </div>

    <!-- Modal -->
    <Modal ref="modal" @submit="createPermiso" @close="$refs.modal.close()" />

    <!-- Modal de detalles -->
    <ModalDetalles ref="modalDetalles" />
  </div>
</template>

<script>
import axios from "@/plugins/axios";
import Modal from "@/components/ModalSolicitudGrifo.vue";
import ModalDetalles from "@/components/ModalDetalleGrifo.vue"
import NotificationCardGrifo from "@/components/NotificationCardGrifo.vue";
import MapViewerGrifo from "@/components/MapViewerGrifo.vue";
import moment from 'moment-timezone'

export default {
  name: "HomeView",
  components: {
    Modal,
    ModalDetalles,
    NotificationCardGrifo,
    MapViewerGrifo,
  },
  data() {
    return {
      usosGrifos: [],
    };
  },
  methods: {

    async fetchUsosGrifos() {
  try {
    const response = await axios.get("http://localhost:3002/usosGrifos");
    const usosGrifos = response.data;

    // Obtener la fecha de hoy en el formato correcto (zona horaria incluida)
    const hoy = moment().tz('America/Santiago').startOf('day'); 
    const finDelDia = moment().tz('America/Santiago').endOf('day');

    // Filtrar los usos de grifos que ocurren hoy
    const usosFiltrados = usosGrifos.filter(usoGrifo => {
      const inicioFecha = moment(usoGrifo.inicio).tz('America/Santiago');
      const terminoFecha = usoGrifo.termino ? moment(usoGrifo.termino).tz('America/Santiago') : null;

      return (
        inicioFecha.isBetween(hoy, finDelDia, null, '[]') || 
        (terminoFecha && terminoFecha.isBetween(hoy, finDelDia, null, '[]'))
      );
    });

    // Formatear fechas antes de guardar en el estado
    this.usosGrifos = usosFiltrados.map(usoGrifo => ({
      ...usoGrifo,
      inicio: moment(usoGrifo.inicio).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss'),
      termino: usoGrifo.termino ? moment(usoGrifo.termino).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss') : null
    }));

    console.log("Datos filtrados para hoy:", this.usosGrifos);
  } catch (error) {
    console.error("Error al obtener usos de grifos:", error);
  }
},


    async createPermisoGrifo(nuevoPermiso) {
      try {
        const response = await axios.post("/permisosGrifos", nuevoPermiso);
        // Agregar el nuevo permiso al estado
        this.usosGrifos.push(response.data);
        this.$refs.modal.close(); // Cerrar el modal
      } catch (error) {
        console.error("Error al registrar el permiso:", error);
        alert("Hubo un error al registrar el permiso.");
      }
    },
    openModal() {
      this.$refs.modal.open(); // Abre el modal cuando el botón es clickeado
    },
    openDetallesModal(usoGrifo) {
      this.$refs.modalDetalles.open(usoGrifo); // Abre el modal de detalles con datos
    },
  },
  mounted() {
    this.fetchUsosGrifos();
  }
};
</script>

<style scoped>
/* Ajustes de estilos si es necesario */
.soliButton {
  transition: background-color 0.2s ease, box-shadow 0.2s ease;
}
</style>