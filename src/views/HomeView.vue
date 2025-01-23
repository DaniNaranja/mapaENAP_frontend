<template>
  <div class="home flex">
    <!-- Contenedor izquierdo: Título, mapa y botón -->
    <div class="flex-1 flex flex-col relative w-4/5 mr-5">
      <h1 class="ml-6 mt-2 font-bold text-2xl">Cortes de calles</h1>
      <h2 class="ml-6 mt-2 text-lg">Estos son los cortes de calles autorizados hasta ahora.</h2>

      <!-- Botón sobre el mapa -->
      <button
        @click="openModal"
        class="absolute top-6 right-0 p-3 rounded-full bg-green-500 text-white shadow-md hover:bg-green-700"
      >
        <i class="fa-solid fa-plus mx-2"></i>
        <span class="font-semibold" style="font-size: 18px;">Solicitar permiso</span>
      </button>

      <map-viewer
        class="ml-6 mt-2 mb-2 flex-1"
        @map-click="handleMapClick"
      ></map-viewer>
    </div>

    <!-- Contenedor derecho: Notificaciones -->
    <div class="bg-white border-l shadow-lg overflow-y-auto" style=" width: 30%;height: calc(100vh - 5rem);">
      <!-- Título de Notificaciones fijo -->
      <div class="sticky top-0 bg-white z-10 p-4 shadow-sm">
        <h2 class="text-xl font-bold">Cortes registrados para hoy</h2>
      </div>

      <!-- Ejemplo de notificaciones -->
      <NotificationCard tipo="total" descripcion="Corte total en calle Principal" />
      <NotificationCard tipo="parcial" descripcion="Corte parcial en calle Secundaria" />
    </div>

    <!-- Modal -->
    <Modal ref="modal" />
  </div>
</template>

<script>
import Modal from "@/components/ModalSolicitud.vue";
import NotificationCard from "@/components/NotificationCard.vue";
import MapViewer from "@/components/MapViewer.vue";

export default {
  name: "HomeView",
  components: {
    Modal,
    NotificationCard,
    MapViewer,
  },
  methods: {
    openModal() {
      this.$refs.modal.open(); // Abre el modal cuando el botón es clickeado
    },
    handleMapClick(lat, lng) {
      // Llama al método setCoordinates del modal para establecer la latitud y longitud
      this.$refs.modal.setCoordinates(lat, lng);
    },
  },
};
</script>

<style scoped>
/* Ajustes de estilos si es necesario */
</style>
