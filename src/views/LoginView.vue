<template>
  <section class="home">
    <div class="bg-gradient-to-b from-violeta to-indigo-700 flex" style="height: calc(100vh - 5rem);">
      <div class="w-3/5 h-full hidden lg:block">
        <img src="../assets/enap_bg.jpg" alt="Placeholder Image" class="object-cover w-full h-full">
      </div>
      <div class="px-20 w-full lg:w-2/5 flex flex-col items-center mt-10">
        <img src="../assets/logo_login.png" alt="" class="mb-2">
        <h1 class="text-2xl font-semibold mb-4 text-white">Mapa interactivo</h1>
        <h2 class="text-xl font-medium mb-4 text-white">Administrador</h2>

        <form @submit.prevent="loginAdmin" class="w-full max-w-lg">
          <!-- Username Input -->
          <div class="mb-4">
            <label for="username" class="block text-white">Nombre de usuario</label>
            <input
              type="text"
              id="username"
              name="username"
              v-model="username"
              class="w-full border bg-lightgray rounded-md mt-2 p-3 focus:outline-none focus:border-red"
              autocomplete="off"
            />
          </div>
          <!-- Password Input -->
          <div class="mb-4">
            <label for="password" class="block text-white">Contraseña</label>
            <input
              type="password"
              id="password"
              name="password"
              v-model="password"
              class="w-full border bg-lightgray rounded-md mt-2 p-3 focus:outline-none focus:border-red"
              autocomplete="off"
            />
          </div>

          <button
            type="submit"
            class="bg-sky-500 hover:bg-blue-600 text-white font-semibold rounded-md py-5 px-4 w-full text-xl mt-4"
          >
            Ingresar
          </button>
        </form>

        <div v-if="errorMessage" class="text-red-500 mt-2 bg-red-300 px-4 py-2 rounded">{{ errorMessage }}</div>

      </div>
    </div>
  </section>
</template>

<script>
import axios from 'axios';

export default {
  name: "LoginView",
  data() {
    return {
      username: '',
      password: '',
      errorMessage: '',
    };
  },
  methods: {
    async loginAdmin() {
      try {
        // Enviar solicitud POST al backend con las credenciales
        const response = await axios.post('http://localhost:3002/login', {
          username: this.username,
          password: this.password,
        });

        // Si la solicitud es exitosa, el token será devuelto
        const token = response.data.token;

        // Guardar el token en localStorage
        localStorage.setItem('authToken', token);

        // Despachar la acción de Vuex para actualizar el estado
        this.$store.dispatch('login', token);  // Actualiza el estado en Vuex

        // Redirigir a la página principal (o donde necesites)
        this.$router.push('/mapa');
      } catch (error) {
        // Si ocurre un error (usuario no encontrado, contraseña incorrecta, etc.)
        if (error.response && error.response.data.message) {
          this.errorMessage = error.response.data.message;
        } else {
          this.errorMessage = 'Error al intentar iniciar sesión.';
        }
      }
    },
  },
};
</script>

<style scoped>
/* Estilos adicionales si es necesario */
</style>
