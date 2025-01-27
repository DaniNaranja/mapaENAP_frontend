import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapaView from '../views/MapaView.vue'
import PermisosView from '../views/PermisosView.vue'
import HistorialView from '@/views/HistorialView.vue'
import LoginView from '../views/LoginView.vue'

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/mapa',
    name: 'mapa',
    component: MapaView,
    meta: { requiresAuth: true },
  },
  {
    path: '/permisos',
    name: 'permisos',
    component: PermisosView,
    meta: { requiresAuth: true },
  },
  {
    path: '/historial',
    name: 'historial',
    component: HistorialView,
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: LoginView
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

// Navigation guard global
router.beforeEach((to, from, next) => {
  // Si la ruta requiere autenticación y el usuario no está autenticado
  const isAuthenticated = localStorage.getItem('authToken'); // Verifica si el token está en el localStorage

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // Si no está autenticado, redirigir a login
    if (!isAuthenticated) {
      next({ name: 'login' });
    } else {
      next(); // El usuario está autenticado, puede acceder a la ruta
    }
  } else {
    next(); // Si la ruta no requiere autenticación, continuar
  }
});

export default router
