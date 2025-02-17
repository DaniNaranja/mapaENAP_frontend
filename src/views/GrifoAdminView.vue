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
  import moment from 'moment-timezone';
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
  
      convertirATemporal(fecha) {
      if (!fecha) return null;
      // Usar el formato DD-MM-YYYY para la fecha
      return moment(fecha).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
    },
  
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
  
      mostrarModal(coordenadas) {
        this.coordenadas = coordenadas;
        this.mostrarModalRegistro = true;
      },
      cerrarModal() {
        this.mostrarModalRegistro = false;
        this.coordenadas = null;
      },
      async registrarCorte(nuevoCorte) {
    const token = localStorage.getItem("authToken");
  
    axios
      .post("http://localhost:3002/cortes", nuevoCorte, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log("Corte creado:", response.data);
  
        let nuevoCorte = response.data;
  
        // Formatear las fechas antes de agregarlo a la lista
        nuevoCorte.inicio = moment(nuevoCorte.inicio)
          .tz("America/Santiago")
          .format("DD-MM-YYYY HH:mm:ss");
        nuevoCorte.termino = nuevoCorte.termino
          ? moment(nuevoCorte.termino).tz("America/Santiago").format("DD-MM-YYYY HH:mm:ss")
          : null;
  
        // Añadir el nuevo corte a la lista
        this.cortes.push(nuevoCorte);
      })
      .catch((error) => {
        if (error.response) {
          console.error("Error al crear el corte:", error.response.data);
        } else if (error.request) {
          console.error("No se recibió respuesta del servidor:", error.request);
        } else {
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
  