<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar ocupa la parte superior -->
    <nav-bar class="navbar" :key="authKey"></nav-bar>
    
    <!-- Contenedor principal con Sidebar y RouterView -->
    <div id="app" class="flex flex-row flex-grow">
      <SideBar class="sidebar"/>
      <div class="flex-grow bg-gray-50">
        <RouterView />
      </div>
    </div>
  </div>
</template>

<script>
import NavBar from './components/NavBar.vue';
import SideBar from './components/SideBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    SideBar,
  },

  
};
</script>

<style>

.navbar {
  flex-shrink: 0;
}


.sidebar {
  flex-shrink: 0; /* Asegura que el ancho del sidebar sea fijo */
}
</style>
