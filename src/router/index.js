import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import MapaView from '../views/MapaView.vue'
import PermisosView from '../views/PermisosView.vue'
import HistorialView from '@/views/HistorialView.vue'
import LoginView from '../views/LoginView.vue'
import GrifoHomeView from '@/views/GrifoHomeView.vue'
import GrifoAdminView from '@/views/GrifoAdminView.vue'
import SolicitudGrifoView from '@/views/SolicitudGrifoView.vue'
import HistorialGrifoView from '@/views/HistorialGrifoView.vue'

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
  },
  {
    path: '/grifohome',
    name: 'grifohome',
    component: GrifoHomeView
  },
  {
    path: '/grifos',
    name: 'grifos',
    component: GrifoAdminView,
    meta: { requiresAuth: true },
  },
  {
    path: '/solicitudgrifos',
    name: 'solicitudgrifos',
    component: SolicitudGrifoView,
    meta: { requiresAuth: true },
  },
  {
    path: '/grifohistorial',
    name: 'grifohistorial',
    component: HistorialGrifoView,
    meta: { requiresAuth: true },
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
