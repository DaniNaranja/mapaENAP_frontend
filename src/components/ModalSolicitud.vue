<!-- Modal.vue -->
<template>
    <div v-if="isVisible" class="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div class="bg-white rounded-lg p-6 w-1/3">
        <h2 class="text-xl font-bold mb-4">Solicitar Permiso</h2>
        <form @submit.prevent="submitForm">
          <div class="mb-4">
            <label for="nombre" class="block text-sm font-semibold">Nombre</label>
            <input type="text" v-model="form.nombre" id="nombre" class="w-full p-2 border rounded" required />
          </div>
  
          <div class="mb-4">
            <label for="descripcion" class="block text-sm font-semibold">Descripción</label>
            <textarea v-model="form.descripcion" id="descripcion" class="w-full p-2 border rounded" required></textarea>
          </div>
  
          <div class="flex justify-end">
            <button type="button" @click="close" class="mr-2 p-2 bg-gray-500 text-white rounded">Cancelar</button>
            <button type="submit" class="p-2 bg-green-500 text-white rounded">Enviar</button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "ModalSolicitud",
    data() {
      return {
        isVisible: false,
        form: {
          nombre: "",
          descripcion: "",
        },
      };
    },
    methods: {
      open() {
        this.isVisible = true;
      },
      close() {
        this.isVisible = false;
      },
      submitForm() {
        console.log("Formulario enviado:", this.form);
        this.close(); // Cierra el modal después de enviar el formulario
      },
    },
  };
  </script>
  
  <style scoped>
  /* Estilos opcionales */
  </style>
  