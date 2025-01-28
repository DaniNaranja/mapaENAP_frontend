<template>
  <div class="home flex">
    <div class="flex-1 flex flex-col relative w-4/5 mr-5">
      <h1 class="ml-6 mt-2 font-bold text-2xl">Cortes de calles</h1>
      <h2 class="ml-6 mt-2 text-lg">Haga click en el mapa para registrar un nuevo corte autorizado.</h2>

      <map-viewer class="ml-6 mt-2 mb-2 flex-1" :cortes="cortes" @map-click="mostrarModal"></map-viewer>
    </div>

    <div class="bg-white border-l shadow-lg overflow-y-auto" style="width: 30%; height: calc(100vh - 5rem);">
      <div class="sticky top-0 bg-white z-10 p-4 shadow-sm">
        <h2 class="text-xl font-bold">Cortes registrados para hoy</h2>
      </div>
      <NotificationCard v-for="(corte, index) in cortes" :key="index" :tipo="corte.tipo" :calle="corte.calle"
        @click="openDetallesModal(corte)" />
    </div>

    <modal-registro-corte v-if="mostrarModalRegistro" :visible="mostrarModalRegistro" :coordenadas="coordenadas"
      @close="cerrarModal" @registrar-corte="registrarCorte" />
    <ModalDetalles ref="modalDetalles" />
  </div>
</template>

<script>
import axios from "@/plugins/axios";
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
      cortes: [],
      mostrarModalRegistro: false,
      coordenadas: null,
    };
  },
  methods: {

    async fetchCortes() {
      try {
        const response = await axios.get("http://localhost:3002/cortes");
        this.cortes = response.data;
      } catch (error) {
        console.error("Error al obtener los cortes:", error);
      }
    },
    mostrarModal(coordenadas) {
      this.coordenadas = coordenadas;
      this.mostrarModalRegistro = true;
    },
    cerrarModal() {
      this.mostrarModalRegistro = false;
      this.coordenadas = null;
    },
    async registrarCorte(nuevoCorte) {
      const token = localStorage.getItem('authToken');
      axios.post('http://localhost:3002/cortes', nuevoCorte, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
        .then(response => {
          console.log("Corte creado:", response.data);
          this.cortes.push(response.data); // Añadir el nuevo corte a la lista
        })
        .catch(error => {
          if (error.response) {
            // Si la respuesta existe, accedemos a error.response.data
            console.error("Error al crear el corte:", error.response.data);
            // Aquí puedes agregar lógica para mostrar un mensaje de error amigable
          } else if (error.request) {
            // Si no hubo respuesta, significa que la solicitud fue enviada pero no se obtuvo respuesta
            console.error("No se recibió respuesta del servidor:", error.request);
          } else {
            // Otros errores que no sean de la solicitud
            console.error("Error en la configuración de la solicitud:", error.message);
          }
        });
    },

    openDetallesModal(corte) {
      this.$refs.modalDetalles.open(corte);
    },
  },
  mounted() {
    this.fetchCortes();
  }
};
</script>
