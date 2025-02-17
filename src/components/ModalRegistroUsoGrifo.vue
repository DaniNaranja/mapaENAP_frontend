<template>
  <div v-if="visible" class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div class="bg-white rounded-lg shadow-lg p-6 w-2/5">
      <h2 class="text-xl font-bold mb-4">Registrar nuevo uso de grifo</h2>
      <form @submit.prevent="registrarUsoGrifo">
        <!-- Calle -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="calle">Numero de grifo (Descripcion ubicacion)</label>
          <input
            id="calle"
            v-model="form.numero_grifo"
            class="border rounded w-full py-2 px-3"
            type="text"
            placeholder="Grifo 123, en interseccion calle A con calle B"
            required
          />
        </div>

        <!-- Tipo de corte -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="tipo">Tipo:</label>
          <select
            id="tipo"
            v-model="form.tipo"
            class="border rounded w-full py-2 px-3"
            required
          >
            <option value="Con bomba">Con bomba</option>
            <option value="Sin bomba">Sin bomba</option>
          </select>
        </div>

        <!-- Latitud -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="latitud">Latitud</label>
          <input
            id="latitud"
            v-model="form.latitud"
            class="border rounded w-full py-2 px-3 bg-gray-100"
            type="number"
            readonly
          />
        </div>

        <!-- Longitud -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="longitud">Longitud</label>
          <input
            id="longitud"
            v-model="form.longitud"
            class="border rounded w-full py-2 px-3 bg-gray-100"
            type="number"
            readonly
          />
        </div>

        

        <!-- Inicio -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="inicio">Fecha y hora de inicio</label>
          <input
            id="inicio"
            v-model="form.inicio"
            class="border rounded w-full py-2 px-3"
            type="datetime-local"
            required
          />
        </div>

        <!-- Término -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="termino">Fecha y hora de término</label>
          <input
            id="termino"
            v-model="form.termino"
            class="border rounded w-full py-2 px-3"
            type="datetime-local"
            
          />
        </div>

        <!-- Motivo -->
        <div class="mb-4">
          <label class="block font-bold mb-2" for="motivo">Motivo</label>
          <textarea
            id="motivo"
            v-model="form.motivo"
            class="border rounded w-full py-2 px-3"
            placeholder="Motivo del corte"
            required
          ></textarea>
        </div>

        <!-- Botones -->
        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-500 text-white px-5 py-3 rounded mr-2 font-semibold hover:bg-gray-600"
            @click="cerrar"
          >
            Cancelar
          </button>
          <button type="submit" class="bg-green-500 text-white px-5 py-3 rounded font-semibold hover:bg-green-600">
            Guardar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "ModalRegistroCorte",
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    coordenadas: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      form: {
        calle: "",
        latitud: this.coordenadas.lat,
        longitud: this.coordenadas.lng,
        tipo: "Con bomba",
        inicio: "",
        termino: "",
        motivo: "",
      },
    };
  },
  watch: {
    // Actualizar latitud y longitud si cambian las coordenadas
    coordenadas: {
      immediate: true,
      handler(newCoordenadas) {
        this.form.latitud = newCoordenadas.lat;
        this.form.longitud = newCoordenadas.lng;
      },
    },
  },
  methods: {
    cerrar() {
      this.$emit("close");
    },
    registrarUsoGrifo() {
      // Crear el nuevo corte con los datos del formulario
      if (!this.form.termino) {
    this.form.termino = null;
  }
      const nuevoUsoGrifo = { ...this.form };
      this.$emit("registrar-usoGrifo", nuevoUsoGrifo); // Emitir evento con los datos
      this.cerrar(); // Cerrar el modal
    },
  },
};
</script>

<style scoped>
/* Personaliza estilos si es necesario */
</style>
