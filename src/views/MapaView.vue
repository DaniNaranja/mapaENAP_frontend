<template>
  <div class="home flex">
    <!-- Contenedor izquierdo: Título y mapa -->
    <div class="flex-1 flex flex-col">
      <h1 class="ml-6 mt-2 font-bold text-2xl">Cortes de calles</h1>
      <h2 class="ml-6 mt-2 text-lg">Haga click en el mapa para registrar un nuevo corte autorizado</h2>
      <map-viewer class="ml-6 mt-2 mb-4 flex-1"></map-viewer>
    </div>

    <!-- Contenedor derecho: Notificaciones -->
    <div class="bg-white border-l shadow-lg overflow-y-auto" style=" width: 30%;height: calc(100vh - 5rem);">
      <!-- Título de Notificaciones fijo -->
      <div class="sticky top-0 bg-white z-10 p-4 shadow-sm">
        <h2 class="text-xl font-bold">Cortes registrados para hoy</h2>
      </div>

      <!-- Ejemplo de notificaciones -->
      <NotificationCard tipo="total" descripcion="Corte total en calle Principal" />
      <NotificationCard tipo="parcial" descripcion="Corte parcial en calle Secundaria" />
      <NotificationCard tipo="total" descripcion="Corte total en avenida Central" />
      <NotificationCard tipo="total" descripcion="Corte total en calle Principal 2" />
      <NotificationCard tipo="parcial" descripcion="Corte parcial en calle Secundaria 2" />
      <NotificationCard tipo="total" descripcion="Corte total en avenida Central 2" />
      <NotificationCard tipo="total" descripcion="Corte total en calle Principal" />
      <NotificationCard tipo="parcial" descripcion="Corte parcial en calle Secundaria" />
      <NotificationCard tipo="total" descripcion="Corte total en avenida Central" />
      <NotificationCard tipo="total" descripcion="Corte total en calle Principal 2" />
      <NotificationCard tipo="parcial" descripcion="Corte parcial en calle Secundaria 2" />
      <NotificationCard tipo="total" descripcion="Corte total en avenida Central 2" />
    </div>
  </div>

  
</template>

<script>
// @ is an alias to /src

import MapViewer from '@/components/MapViewer.vue';
import NotificationCard from '@/components/NotificationCard.vue';

export default {
  name: 'HomeView',
  components: {
    MapViewer,
    NotificationCard
    
  }
}
</script>
