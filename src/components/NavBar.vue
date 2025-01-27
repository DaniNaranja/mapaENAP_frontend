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
        <div v-if="mostrarLogin" class="flex items-center pr-6">
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

    computed: {
        mostrarLogin() {
            const rutaActual = this.$route.path;
            // Ocultamos la barra lateral si estamos en la vista de login
            return rutaActual !== "/login"

        },
    }
}


</script>

<style scoped>
/* Puedes agregar estilos adicionales si es necesario */
</style>