import axios from 'axios';

const URL_BASE_API = 'http://localhost:8080'; //cambiar a url de Render después

const api = axios.create({
  baseURL: URL_BASE_API,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const iniciarSesion = (datos) => api.post('/auth/login', datos);

export const obtenerClientes = () => api.get('/clientes/listar');
export const obtenerClientePorId = (id) => api.get(`/clientes/${id}`);
export const crearCliente = (datos) => api.post('/clientes/crear', datos);
export const actualizarCliente = (id, datos) => api.put(`/clientes/${id}/modificar`, datos);
export const desactivarCliente = (id) => api.put(`/clientes/${id}/desactivar`);
export const activarCliente = (id) => api.put(`/clientes/${id}/activar`);

export const obtenerPropiedades = () => api.get('/propiedades/listar');
export const obtenerPropiedadPorId = (id) => api.get(`/propiedades/${id}`);
export const crearPropiedad = (datos) => api.post('/propiedades/crear', datos);
export const actualizarPropiedad = (id, datos) => api.put(`/propiedades/${id}/modificar`, datos);
export const desactivarPropiedad = (id) => api.put(`/propiedades/${id}/desactivar`);
export const activarPropiedad = (id) => api.put(`/propiedades/${id}/activar`);

export const obtenerRecibos = () => api.get('/recibo/listar');
export const obtenerRecibo = (numeroRecibo) => api.get(`/recibo/${numeroRecibo}`);
export const crearRecibo = (datos) => api.post('/recibo/crear', datos);
export const eliminarRecibo = (id) => api.delete(`/recibo/${id}`);

export const obtenerExClientes = () => api.get('/clientes/inactivos');
export const obtenerExPropiedades = () => api.get('/propiedades/inactivas');