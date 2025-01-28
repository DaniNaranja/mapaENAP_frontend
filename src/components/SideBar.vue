<template>
  <div
    v-if="mostrarSidebar"
    class="sidebar bg-gradient-to-b from-purple-500 to-indigo-800 sticky top-[5rem]"
  >
    <RouterLink
      to="/mapa"
      :class="isActive('/mapa') ? 'bg-violet-900' : ''"
      class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900"
    >
      <div class="flex items-center">
        <i class="fa-solid fa-map-location-dot m-3 text-2xl text-white"></i>
        <span class="text-white font-semibold text-base">Mapa</span>
      </div>
      <i class="fas fa-chevron-right text-xl text-white ml-3"></i>
    </RouterLink>
    <RouterLink
      to="/permisos"
      :class="isActive('/permisos') ? 'bg-violet-900' : ''"
      class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900"
    >
      <div class="flex items-center">
        <i class="fa-solid fa-clipboard-list m-3.5 text-2xl text-white"></i>
        <span class="text-white font-semibold text-base">Permisos</span>
      </div>
      <i class="fas fa-chevron-right text-xl text-white ml-3"></i>
    </RouterLink>
    <RouterLink
      to="/historial"
      :class="isActive('/historial') ? 'bg-violet-900' : ''"
      class="flex items-center justify-between pr-4 pl-4 pt-2 pb-2 hover:bg-violet-900"
    >
      <div class="flex items-center">
        <i class="fa-solid fa-clock-rotate-left m-3 text-2xl text-white"></i>
        <span class="text-white font-semibold text-base">Historial</span>
      </div>
      <i class="fas fa-chevron-right text-xl text-white ml-3"></i>
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
  methods: {
    isActive(route) {
      return this.$route.path === route;
    },
  },
};
</script>

<style scoped>
.sidebar {
  width: 12rem;
  /* Ancho de la barra lateral */
  height: calc(100vh - 5rem);
  /* Altura dinámica que descuenta la altura del NavBar (5rem) */
}
</style>