<template>
  <div class="home flex">
    <div class="flex-1 flex flex-col relative w-4/5 mr-5">
      <h1 class="ml-6 mt-2 font-bold text-2xl">Cortes de calles</h1>
      <h2 class="ml-6 mt-2 text-lg">Haga click en el mapa para registrar un nuevo corte autorizado.</h2>

      <map-viewer
        class="ml-6 mt-2 mb-2 flex-1"
        :cortes="cortes"
        @map-click="mostrarModal"
      ></map-viewer>
    </div>

    <div class="bg-white border-l shadow-lg overflow-y-auto" style="width: 30%; height: calc(100vh - 5rem);">
      <div class="sticky top-0 bg-white z-10 p-4 shadow-sm">
        <h2 class="text-xl font-bold">Cortes registrados para hoy</h2>
      </div>
      <NotificationCard
        v-for="(corte, index) in cortes"
        :key="index"
        :tipo="corte.tipo"
        :calle="corte.calle"
        @click="openDetallesModal(corte)"
      />
    </div>

    <modal-registro-corte
      v-if="mostrarModalRegistro"
      :visible="mostrarModalRegistro"
      :coordenadas="coordenadas"
      @close="cerrarModal"
      @registrar-corte="registrarCorte"
    />
    <ModalDetalles ref="modalDetalles" />
  </div>
</template>

<script>
import ModalRegistroCorte from "@/components/ModalRegistroCorte.vue";
import ModalDetalles from "@/components/ModalDetalle.vue";
import NotificationCard from "@/components/NotificationCard.vue";
import MapViewer from "@/components/MapViewer.vue";

export default {
  name: "HomeView",
  components: {
    ModalRegistroCorte,
    ModalDetalles,
    NotificationCard,
    MapViewer,
  },
  data() {
    return {
      cortes: [
        {
          tipo: "total",
          calle: "Corte total en calle Principal",
          latitud: -36.7793,
          longitud: -73.1237,
          inicio: "24-01-2025 15:30",
          termino: "24-01-2025 20:00",
          motivo: "Reparaciones en vía x",
        },
        {
          tipo: "parcial",
          calle: "8 Oriente, entre A y B",
          latitud: -36.7785,
          longitud: -73.1237,
          inicio: "24-01-2025 15:30",
          termino: "24-01-2025 20:00",
          motivo: "Reparaciones en vía x",
        },
      ],
      mostrarModalRegistro: false,
      coordenadas: null,
    };
  },
  methods: {
    mostrarModal(coordenadas) {
      this.coordenadas = coordenadas;
      this.mostrarModalRegistro = true;
    },
    cerrarModal() {
      this.mostrarModalRegistro = false;
      this.coordenadas = null;
    },
    registrarCorte(nuevoCorte) {
      this.cortes.push(nuevoCorte);
    },
    openDetallesModal(corte) {
      this.$refs.modalDetalles.open(corte);
    },
  },
};
</script>
