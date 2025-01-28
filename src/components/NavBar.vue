<template>
    <div class="navbar bg-gradient-to-r from-gray-100 to-violet-200 h-20 flex items-center sticky">
      <!-- Contenedor del logo condicional -->
      <div v-if="isAuthenticated" class="flex items-center">
        <router-link to="/mapa">
          <img src="../assets/logo.png" alt="Logo Mapa" class="h-16 p-2 cursor-pointer">
        </router-link>
      </div>
  
      <div v-else class="flex items-center">
        <router-link to="/">
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
        
        <!-- Menú desplegable, posicionado fuera de la navbar -->
        <div v-if="showMenu" class="fixed top-20 right-6 w-48 bg-red-300 shadow-lg rounded-md px-2 py-3 z-50 hover:bg-red-500">
          <button @click="logout" class="w-full text-red-950 hover:text-white">Cerrar sesión
            <i class="fa fa-sign-out text-2xl float-right" aria-hidden="true"></i>
          </button>
          
        </div>
      </div>
  
      <!-- Ícono de usuario para iniciar sesión si no está autenticado -->
      <div v-else class="flex items-center pr-6">
        <router-link to="/login" class="flex items-center group">
          <span class="text-slate-700 font-semibold mr-3 group-hover:text-white transition-colors duration-300">
            Iniciar sesión
          </span>
          <i class="fa-solid fa-user text-2xl cursor-pointer text-violet-800 group-hover:text-white transition-colors duration-300"></i>
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
  /* Aquí se usa 'fixed' para que el menú esté fuera de la navbar */
  .fixed {
    position: fixed;
    top: 80px;  /* Ajusta esto dependiendo de la altura de la navbar */
    right: 20px; /* O puedes usar 'right: 0' para alinearlo a la derecha de la pantalla */
    z-index: 50; /* Asegúrate de que el menú esté por encima de otros elementos */
  }
  </style>
  