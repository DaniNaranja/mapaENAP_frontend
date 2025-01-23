<template>
    <div class="navbar bg-gradient-to-r from-gray-100 to-violet-200 h-20 flex items-center">
        <!-- Contenedor del logo -->
        <div class="flex items-center">
            <router-link to="/">
                <img src="../assets/logo.png" alt="Logo" class="h-16 p-2 cursor-pointer">
            </router-link>
        </div>

        <!-- Espaciador (opcional si hay más contenido en la barra) -->
        <div class="flex-1"></div>

        <!-- Contenido adicional (si lo hay) -->
        <div class="flex-none gap-4">
            <div class="dropdown">
                <!-- Aquí podrías agregar elementos adicionales -->
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'NavBar',
};
</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>
