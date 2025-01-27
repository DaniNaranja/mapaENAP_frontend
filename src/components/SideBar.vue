<template>
    <div v-if="mostrarSidebar" class="sidebar bg-gradient-to-b from-purple-500 to-indigo-800">
      <RouterLink to="/mapa">
        <div class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900">
          <div class="flex items-center">
            <i class="fa-solid fa-map-location-dot m-3 text-2xl" style="color: white"></i>
            <span style="font-size: 16px; color: white; font-weight: 600;">Mapa</span>
          </div>
          <i class="fas fa-chevron-right text-xl ml-3 arrow"></i>
        </div>
      </RouterLink>
      <RouterLink to="/permisos">
        <div class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900">
          <div class="flex items-center">
            <i class="fa-solid fa-clipboard-list m-3.5 text-2xl" style="color: white"></i>
            <span style="font-size: 16px; color: white; font-weight: 600;">Permisos</span>
          </div>
          <i class="fas fa-chevron-right text-xl ml-3 arrow"></i>
        </div>
      </RouterLink>
      <RouterLink to="/historial">
        <div class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900">
          <div class="flex items-center">
            <i class="fa-solid fa-clock-rotate-left m-3 text-2xl" style="color: white"></i>
            <span style="font-size: 16px; color: white; font-weight: 600;">Historial</span>
          </div>
          <i class="fas fa-chevron-right text-xl ml-3 arrow"></i>
        </div>
      </RouterLink>
    </div>
  </template>
  
  <script>
  export default {
    name: "SideBar",
    computed: {
    mostrarSidebar() {
      // Obtenemos la ruta actual utilizando el enrutador de Vue
      const rutaActual = this.$route.path;
      // Ocultamos la barra lateral si estamos en la vista de login
      return rutaActual !== "/login" && rutaActual !== "/";
    },
  },
  };
  </script>
  
  <style scoped>
  .sidebar {
    width: 12rem; /* Ancho de la barra lateral */
    height: calc(100vh - 5rem); /* Altura dinámica que descuenta la altura del NavBar (5rem) */
  }
  </style>
  