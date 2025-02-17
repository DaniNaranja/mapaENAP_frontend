<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
        <div class="bg-white rounded-lg p-6 w-2/3 flex">
            <!-- Formulario -->
            <div class="flex-1 pr-4">
                <h2 class="text-xl font-bold mb-4">Solicitar Uso de Grifo</h2>
                <form @submit.prevent="submitForm">

                    
                    <!-- Tipo de corte -->
                    <div class="mb-4">
                        <label for="tipo" class="block text-sm font-semibold mb-1">Tipo</label>
                        <select v-model="form.tipo" id="tipo" class="w-full p-2 border rounded bg-gray-200" required>
                            <option value="Con bomba">Con bomba</option>
                            <option value="Sin bomba">Sin bomba</option>
                        </select>
                    </div>

                    <!-- Fecha -->
                    <div class="mb-4">
                        <label for="fecha" class="block text-sm font-semibold mb-1">Fecha</label>
                        <input type="date" v-model="form.fecha" id="fecha" class="w-full p-2 border rounded bg-gray-200"
                            required />
                    </div>

                    <!-- Solicitante -->
                    <div class="mb-4">
                        <label for="solicitante" class="block text-sm font-semibold mb-1">Solicitante</label>
                        <input type="text" v-model="form.solicitante" id="solicitante"
                            class="w-full p-2 border rounded bg-gray-200" required />
                    </div>
                    <!-- Numero grifo y descripcion ubicacion -->
                    <div class="mb-4">
                        <label for="calle" class="block text-sm font-semibold mb-1">Numero grifo (Ubicacion):</label>
                        <input type="text" v-model="form.numero_grifo" id="calle" class="w-full p-2 border rounded bg-gray-200"
                            required placeholder="Grifo 123, entre calle A y calle B" />
                    </div>

                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-1">Inicio y termino</label>
                        <div class="flex">
                            <input type="datetime-local" v-model="form.inicio" id="inicio"
                                class="w-1/2 p-2 bg-gray-200 border rounded mr-2" required />
                            <input type="datetime-local" v-model="form.termino" id="termino"
                                class="w-1/2 p-2 bg-gray-200 border rounded"/>
                        </div>
                    </div>

                    <!-- Latitud y Longitud -->
                    <div class="mb-4">
                        <label class="block text-sm font-semibold mb-1">Latitud y Longitud</label>
                        <div class="flex">
                            <input type="text" v-model="form.latitud" placeholder="Latitud"
                                class="w-1/2 p-2 bg-gray-200 border rounded mr-2" readonly />
                            <input type="text" v-model="form.longitud" placeholder="Longitud"
                                class="w-1/2 p-2 bg-gray-200 border rounded" readonly />
                        </div>
                    </div>
                    

                    <!-- Motivo -->
                    <div class="mb-4">
                        <label for="motivo" class="block text-sm font-semibold mb-1">Motivo</label>
                        <textarea v-model="form.motivo" id="motivo"
                            class="w-full p-2 border rounded bg-gray-200"></textarea>
                    </div>
                    <div class="mb-4">
                        <label for="email" class="block text-sm font-semibold mb-1">Correo electrónico</label>
                        <input type="text" v-model="form.email" id="email"
                            class="w-full p-2 border rounded bg-gray-200" required />
                    </div>

                


                </form>
            </div>

            <!-- Mapa miniatura -->
            <div class="w-1/3 relative">
                <label class="block text-sm font-semibold mb-2">Arrastre el marcador en el mapa</label>
                <div id="mini-map" class="h-3/4 w-full rounded-xl mb-4"></div>

                <!-- Botones en la esquina inferior derecha -->
                <div class="absolute bottom-4 right-4 flex space-x-2">
                    <button type="button" @click="close"
                        class="px-7 py-3 bg-gray-500 text-lg text-white font-bold rounded hover:bg-gray-700 mr-3">
                        Cancelar
                    </button>
                    <button type="button" @click="submitForm"
                        class="px-10 py-3 bg-green-500 text-lg text-white font-bold rounded hover:bg-green-700">
                        Enviar
                    </button>
                </div>

            </div>
        </div>
    </div>
</template>

<script>
import axios from "axios";

import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useToast } from "vue-toastification";

export default {
    name: "ModalSolicitudGrifo",
    data() {
        return {
            isVisible: false,
            form: {
                tipo: "Con bomba",
                latitud: "-36.77933674462178",
                longitud: "-73.12370348487816",
            },
            miniMap: null,
            marker: null,
        };
    },
    methods: {
        open() {
            this.isVisible = true;
            this.$nextTick(() => {
                // Inicializar el mini mapa una vez que el DOM haya sido actualizado
                this.initializeMiniMap();
            });
        },
        close() {
            this.isVisible = false;
            if (this.miniMap) {
                this.miniMap.remove(); // Limpiar el mapa cuando se cierra el modal
            }
        },

        initializeMiniMap() {
            // Inicializar el mini mapa
            this.miniMap = L.map('mini-map').setView([this.form.latitud, this.form.longitud], 16);

            // Añadir capa base de OpenStreetMap
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            }).addTo(this.miniMap);
            // Crear un ícono personalizado
            const customIcon = L.icon({
                iconUrl: './grifo_bomba.png', // URL de tu marcador
                iconSize: [40, 40], // Tamaño del ícono
                iconAnchor: [20, 40], // Punto de anclaje
                popupAnchor: [0, -40], // Posición del popup respecto al marcador
            });

            // Añadir el marcador personalizado
            this.marker = L.marker([this.form.latitud, this.form.longitud], {
                draggable: true,
                icon: customIcon, // Usar el ícono personalizado
            }).addTo(this.miniMap);

            // Actualizar coordenadas en el formulario cuando se mueva el marcador
            this.marker.on('dragend', () => {
                const position = this.marker.getLatLng();
                this.form.latitud = position.lat;
                this.form.longitud = position.lng;
            });
        },

        submitForm() {
            // Validar campos obligatorios
            if (!this.form.tipo || !this.form.fecha || !this.form.solicitante || !this.form.motivo || !this.form.inicio || !this.form.termino || !this.form.numero_grifo || !this.form.latitud || !this.form.longitud || !this.form.email ) {
                const toast = useToast();
                toast.error("Por favor, complete todos los campos requeridos.", {
                    position: "bottom-right",
                    timeout: 3000,
                });
                return;
            }

            const data = {
                ...this.form,
                inicio: new Date(this.form.inicio).toISOString(), // Convertir la fecha de inicio a formato ISO
                termino: new Date(this.form.termino).toISOString(),

            }

            // Enviar datos al backend
            axios.post("http://localhost:3002/permisosGrifos", data)
                .then(response => {
                    const toast = useToast();
                    toast.success("La solicitud se ha registrado correctamente.", {
                        position: "bottom-right",
                        timeout: 3000,
                    });
                    console.log("Respuesta del servidor:", response.data);

                    // Reiniciar formulario y cerrar modal
                    this.form = {
                        tipo: "Con bomba",
                        latitud: "-36.77933674462178",
                        longitud: "-73.12370348487816",
                    };
                    this.close();
                })
                .catch(error => {
                    const toast = useToast();
                    toast.error("Ocurrió un error al registrar la solicitud.", {
                        position: "bottom-right",
                        timeout: 3000,
                    });
                    console.error("Error del servidor:", error.response || error);
                });
        },

    },
};
</script>

<style scoped>
#mini-map {
    /* Tamaño pequeño para el mapa */
}
</style>