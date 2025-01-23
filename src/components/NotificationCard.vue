<template>
    <div
      :class="[
        'border-l-4 p-4 mb-4 flex items-center shadow-md',
        tipo === 'total' ? 'border-red-500 bg-red-100' : 'border-yellow-500 bg-yellow-100'
      ]"
    >
      <div
        :class="[
          'w-10 h-10 rounded-full flex items-center justify-center text-white mr-4',
          tipo === 'total' ? 'bg-red-500' : 'bg-yellow-500'
        ]"
      >
        <i class="fa-solid fa-exclamation-triangle"></i>
      </div>
      <div>
        <p class="font-bold text-lg">
          {{ tipo === 'total' ? 'Corte Total' : 'Corte Parcial' }}
        </p>
        <p class="text-sm">{{ descripcion }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotificationCard",
    props: {
      tipo: {
        type: String,
        required: true, // 'total' o 'parcial'
      },
      descripcion: {
        type: String,
        required: true,
      },
    },
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales si es necesario */
  </style>
  