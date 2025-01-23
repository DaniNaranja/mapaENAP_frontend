import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapaView from '../views/MapaView.vue'
import PermisosView from '../views/PermisosView.vue'
import HistorialView from '@/views/HistorialView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mapa',
    name: 'mapa',
    component: MapaView
  },
  {
    path: '/permisos',
    name: 'permisos',
    component: PermisosView
  },
  {
    path: '/historial',
    name: 'historial',
    component: HistorialView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
