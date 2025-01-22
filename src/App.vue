<template>
  <nav-bar></nav-bar>
  <div id="app" class="flex flex-row">
    <SideBar/>
    <RouterView></RouterView>
  </div>
</template>


<script>
import NavBar from './components/NavBar.vue'; // Ruta al archivo NavBar.vue
import SideBar from './components/SideBar.vue';

export default {
  name: 'App',
  components: {
    NavBar,
    SideBar // Registra el componente
  },
};
</script>

<style>


</style>
