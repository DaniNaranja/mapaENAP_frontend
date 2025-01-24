<template>
    <div
      :class="[
        'border-l-4 p-4 mb-4 flex items-center shadow-md cursor-pointer transition-all duration-200',
        tipo === 'total' ? 'border-red-500 bg-red-100 hover:bg-red-300' : 'border-yellow-500 bg-yellow-100 hover:bg-yellow-300'
      ]"
      @click="handleClick"
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
        <p class="text-sm">{{ calle }}</p>
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
      calle: {
        type: String,
        required: true,
      },
      latitud: {
        type: String,
        required: true,
      },
      longitud: {
        type: String,
        required: true,
      },
    },
    methods: {
      handleClick() {
        // Emitir evento con los detalles del corte
        this.$emit("notification-clicked", {
          tipo: this.tipo,
          calle: this.calle,
          latitud: this.latitud,
          longitud: this.longitud,
        });
      },
    },
  };
  </script>
  
  <style scoped>
  /* Agregar efecto hover para oscurecer el fondo */
  .notification-card {
    transition: background-color 0.2s ease, box-shadow 0.2s ease;
  }
  
  .notification-card:hover {
    filter: brightness(0.85); /* Oscurecer el fondo */
  }
  </style>
  