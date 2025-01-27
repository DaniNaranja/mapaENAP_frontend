<template>
    <section class="home">
      <!-- component -->
      <div class="bg-gradient-to-b from-violeta to-indigo-700 flex" style="height: calc(100vh - 5rem);">
        <!-- Left: Image -->
        <div class="w-3/5 h-full hidden lg:block">
          <img src="../assets/enap_bg.jpg" alt="Placeholder Image" class="object-cover w-full h-full">
        </div>
        <!-- Right: Login Form -->
        <div class="px-20 w-full lg:w-2/5 flex flex-col items-center mt-10">
          <img src="../assets/logo_login.png" alt="" class="mb-2">
          <h1 class="text-2xl font-semibold mb-4 text-white">Mapa interactivo</h1>
          <h2 class="text-xl font-medium mb-4 text-white">Administrador</h2>
  
          <form @submit.prevent="loginAdmin" class="w-full max-w-lg">
            <!-- Username Input -->
            <div class="mb-4">
              <label for="mail" class="block text-white">Nombre de usuario</label>
              <input
                type="text"
                id="username"
                name="username"
                v-model="username"
                class="w-full border bg-lightgray rounded-md mt-2 p-3 focus:outline-none focus:border-red"
                autocomplete="off"
              >
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
              >
            </div>
  
            <!-- Login Button -->
            <button
              type="submit"
              class="bg-blue-500 hover:bg-blue-700 text-white font-semibold rounded-md py-5 px-4 w-full text-xl mt-4"
            >
              Ingresar
            </button>
          </form>
          <!-- Sign up Link -->
          <div class="mt-6 text-blue-500 text-center">
            <!-- Add your signup link or content here -->
          </div>
        </div>
      </div>
    </section>
  </template>
  
  <script>
  export default {
    name: "LoginView",
  };
  </script>
  
  <style scoped>
  /* Si necesitas estilos adicionales, puedes agregarlos aquí */
  </style>
  