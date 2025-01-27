<template>
    <div class="navbar bg-gradient-to-r from-gray-100 to-violet-200 h-20 flex items-center">
      <!-- Contenedor del logo condicional -->
      <div v-if="isAuthenticated" class="flex items-center">
        <!-- Logo que lleva a /mapa si el usuario está autenticado -->
        <router-link  to="/mapa">
          <img src="../assets/logo.png" alt="Logo Mapa" class="h-16 p-2 cursor-pointer">
        </router-link>
      </div>

      <div v-else class="flex items-center">
        <router-link  to="/">
          <img src="../assets/logo.png" alt="Logo Mapa" class="h-16 p-2 cursor-pointer">
        </router-link>
      </div>
  
      <!-- Espaciador para empujar el contenido hacia los extremos -->
      <div class="flex-1"></div>
  
      <!-- Ícono de usuario o nombre -->
      <div v-if="isAuthenticated" class="relative flex items-center pr-6">
        <button @click="toggleMenu" class="flex items-center group">
          <span class="text-slate-700 font-semibold mr-3 group-hover:text-white transition-colors duration-300">
            {{ username }}
          </span>
          <i class="fa-solid fa-user text-2xl cursor-pointer text-violet-800 group-hover:text-white transition-colors duration-300"></i>
        </button>
        <div v-if="showMenu" class="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md p-2">
          <button @click="logout" class="w-full text-left text-red-500">Cerrar sesión</button>
        </div>
      </div>
  
      <!-- Ícono de usuario para iniciar sesión si no está autenticado -->
      <div v-else class="flex items-center pr-6">
        <router-link to="/login" class="flex items-center group">
          <span class="text-slate-700 font-semibold mr-3 group-hover:text-white transition-colors duration-300">
            Iniciar sesión
          </span>
          <i
            class="fa-solid fa-user text-2xl cursor-pointer text-violet-800 group-hover:text-white transition-colors duration-300">
          </i>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
export default {
  name: "NavBar",
  data() {
    return {
      showMenu: false, // Para controlar si el menú desplegable está visible
    };
  },
  computed: {
    // Acceder al estado de Vuex para isAuthenticated y username
    isAuthenticated() {
      return this.$store.state.isAuthenticated;
    },
    username() {
      return this.$store.state.username || "Usuario";
    },
  },
  methods: {
    toggleMenu() {
      this.showMenu = !this.showMenu;
    },
    logout() {
      this.$store.dispatch('logout');  // Llamar la acción de Vuex para cerrar sesión
      this.showMenu = false;
      this.$router.push('/'); // Redirige a la página de inicio después de cerrar sesión
    },
  },
};
</script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales si es necesario */
  </style>
  