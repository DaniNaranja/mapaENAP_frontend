<template>
    <div class="home flex">
        <div class="flex-1 flex flex-col relative w-4/5 mr-5">
            <h1 class="ml-6 mt-2 font-bold text-2xl">Uso de grifos</h1>
            <h2 class="ml-6 mt-2 text-lg">Estos son los grifos en uso durante el día.</h2>


            <map-viewer-grifo class="ml-6 mt-2 mb-2 flex-1" :usosGrifos="usosGrifos"
                @map-click="mostrarModal"></map-viewer-grifo>
        </div>

        <!-- Contenedor derecho: Notificaciones -->
        <div class="bg-white border-l shadow-lg overflow-y-auto" style=" width: 30%;height: calc(100vh - 5rem);">
            <!-- Título de Notificaciones fijo -->
            <div class="sticky top-0 bg-white z-10 p-4 shadow-sm flex items-center justify-between">
                <h2 class="text-xl font-bold">Uso de grifos de hoy</h2>
            </div>

            <!-- Ejemplo de notificaciones -->
            <NotificationCardGrifo v-for="(usoGrifo, index) in usosGrifos" :key="index" :tipo="usoGrifo.tipo"
                :numero_grifo="usoGrifo.numero_grifo" @click="openDetallesModal(usoGrifo)" />

        </div>

        <modal-registro-uso-grifo v-if="mostrarModalRegistro" :visible="mostrarModalRegistro" :coordenadas="coordenadas"
            @close="cerrarModal" @registrar-usoGrifo="registrarUsoGrifo" />
        <ModalDetalles ref="modalDetalles" />
    </div>
</template>

<script>
import moment from 'moment-timezone';
import axios from "@/plugins/axios";
import ModalRegistroUsoGrifo from "@/components/ModalRegistroUsoGrifo.vue";
import ModalDetalles from "@/components/ModalDetalleGrifo.vue";
import NotificationCardGrifo from "@/components/NotificationCardGrifo.vue";
import MapViewerGrifo from "@/components/MapViewerGrifo.vue";

export default {
    name: "HomeView",
    components: {
        ModalRegistroUsoGrifo,
        ModalDetalles,
        NotificationCardGrifo,
        MapViewerGrifo,
    },
    data() {
        return {
            usosGrifos: [],
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

        async fetchUsosGrifos() {
            try {
                const response = await axios.get("http://localhost:3002/usosGrifos");
                const usosGrifos = response.data;

                // Filtrar los usosGrifos por el día de hoy
                const hoy = moment().tz('America/Santiago').startOf('day'); // Comienza desde las 00:00 del día de hoy
                const finDelDia = moment().tz('America/Santiago').endOf('day'); // Finaliza a las 23:59:59 del día de hoy

                // Filtrar los usosGrifos para solo mostrar los de hoy
                const usosGrifosFiltrados = usosGrifos.filter(usoGrifo => {
                    // Convertir las fechas de usoGrifo a objetos moment
                    const inicioFecha = moment(usoGrifo.inicio).tz('America/Santiago');
                    const terminoFecha = usoGrifo.termino ? moment(usoGrifo.termino).tz('America/Santiago') : null;

                    // Comprobar si la fecha de inicio o de término está dentro del rango de hoy
                    return (inicioFecha.isBetween(hoy, finDelDia, null, '[]')) ||
                        (terminoFecha && terminoFecha.isBetween(hoy, finDelDia, null, '[]'));
                });

                // Asignar los usosGrifos filtrados
                this.usosGrifos = usosGrifosFiltrados.map(usoGrifo => {
                    // Formatear las fechas a DD-MM-YYYY
                    usoGrifo.inicio = moment(usoGrifo.inicio).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss');
                    usoGrifo.termino = usoGrifo.termino ? moment(usoGrifo.termino).tz('America/Santiago').format('DD-MM-YYYY HH:mm:ss') : null;
                    return usoGrifo;
                });

            } catch (error) {
                console.error("Error al obtener los usosGrifos:", error);
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
        async registrarUsoGrifo(nuevoUsoGrifo) {
            const token = localStorage.getItem("authToken");

            axios
                .post("http://localhost:3002/usosGrifos", nuevoUsoGrifo, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                .then((response) => {
                    console.log("Uso de grifo creado:", response.data);

                    let nuevoUsoGrifo = response.data;

                    // Formatear las fechas antes de agregarlo a la lista
                    nuevoUsoGrifo.inicio = moment(nuevoUsoGrifo.inicio)
                        .tz("America/Santiago")
                        .format("DD-MM-YYYY HH:mm:ss");
                    nuevoUsoGrifo.termino = nuevoUsoGrifo.termino
                        ? moment(nuevoUsoGrifo.termino).tz("America/Santiago").format("DD-MM-YYYY HH:mm:ss")
                        : null;

                    // Añadir el nuevo usoGrifo a la lista
                    this.usosGrifos.push(nuevoUsoGrifo);
                })
                .catch((error) => {
                    if (error.response) {
                        console.error("Error al crear el uso de grifo:", error.response.data);
                    } else if (error.request) {
                        console.error("No se recibió respuesta del servidor:", error.request);
                    } else {
                        console.error("Error en la configuración de la solicitud:", error.message);
                    }
                });
        },


        openDetallesModal(usoGrifo) {
            this.$refs.modalDetalles.open(usoGrifo);
        },
    },
    mounted() {
        this.fetchUsosGrifos();
    }
};
</script>