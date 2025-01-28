import axios from 'axios';
import store from '../store/index';  // Importa el store de Vuex

// Crear una instancia de axios
const instance = axios.create({
  baseURL: 'http://localhost:3002', // Configura la URL base de la API
  timeout: 10000, // Tiempo máximo de espera en ms
});

// Configurar el interceptor para incluir el token en los encabezados
instance.interceptors.request.use(
  (config) => {
    const token = store.state.token; // Obtener el token desde Vuex
    if (token) {
      // Si hay un token, agregarlo al encabezado de la solicitud
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Exportar la instancia configurada
export default instance;
