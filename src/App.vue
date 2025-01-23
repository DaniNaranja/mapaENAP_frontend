<template>
  <div class="flex flex-col h-screen">
    <!-- Navbar ocupa la parte superior -->
    <nav-bar></nav-bar>
    
    <!-- Contenedor principal con Sidebar y RouterView -->
    <div id="app" class="flex flex-row flex-grow">
      <SideBar />
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
