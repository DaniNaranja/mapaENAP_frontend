<template>
    <div
      :class="[
        'border-l-4 p-4 mb-4 flex items-center shadow-md cursor-pointer transition-all duration-200',
        tipo === 'Con bomba' ? 'border-blue-500 bg-blue-100 hover:bg-blue-300' : 'border-green-500 bg-green-100 hover:bg-green-300'
      ]"
      @click="handleClick"
    >
      <div
        :class="[
          'w-12 h-12 rounded-full flex items-center justify-center text-white mr-4',
          tipo === 'Con bomba' ? 'bg-blue-500' : 'bg-green-500'
        ]"
      >
      <img src="grifo.png" alt="" class="h-8">
      </div>
      <div>
        <p class="font-bold text-lg">
          {{ tipo === 'Con bomba' ? 'Con bomba' : 'Sin bomba' }}
        </p>
        <p class="text-sm">{{ numero_grifo }}</p>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NotificationCardGrifo",
    props: {
      tipo: {
        type: String,
        required: true, // 'total' o 'parcial'
      },
      numero_grifo: {
        type: String,
        required: true,
      },
      
    },
    methods: {
      handleClick() {
        // Emitir evento con los detalles del corte
        this.$emit("notification-clicked", {
          tipo: this.tipo,
          calle: this.numero_grifo,
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
  