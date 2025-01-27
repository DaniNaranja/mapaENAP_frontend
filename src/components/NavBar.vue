<template>
    <div class="navbar bg-gradient-to-r from-gray-100 to-violet-200 h-20 flex items-center">
      <!-- Contenedor del logo -->
      <div class="flex items-center">
        <router-link to="/">
          <img src="../assets/logo.png" alt="Logo" class="h-16 p-2 cursor-pointer">
        </router-link>
      </div>
  
      <!-- Espaciador para empujar el contenido hacia los extremos -->
      <div class="flex-1"></div>
  
      <!-- Ícono de usuario -->
      <div class="flex items-center pr-6">
        <router-link to="/login">
          <i class="fa-solid fa-user text-2xl cursor-pointer text-violet-800 hover:text-violet-600"></i>
        </router-link>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: "NavBar",
  };
  </script>
  
  <style scoped>
  /* Puedes agregar estilos adicionales si es necesario */
  </style>
  