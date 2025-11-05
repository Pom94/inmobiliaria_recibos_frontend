import axios from 'axios';

const URL_BASE_API = process.env.REACT_APP_API_URL;; //cambiar a url de Render después process.env.REACT_APP_API_URL; / 'http://localhost:8080';

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

export const obtenerContratos = () => api.get('/contratos/listar');
export const obtenerContratoPorId = (id) => api.get(`/contratos/${id}`);
export const crearContrato = (datos) => api.post('/contratos/crear', datos);
export const actualizarContrato = (id, datos) => api.put(`/contratos/${id}/modificar`, datos);
export const desactivarContrato = (id) => api.put(`/contratos/${id}/desactivar`);
export const activarContrato = (id) => api.put(`/contratos/${id}/activar`);

export const obtenerRecibos = () => api.get('/recibo/listar');
export const obtenerRecibo = (numeroRecibo) => api.get(`/recibo/${numeroRecibo}`);
export const crearRecibo = (datos) => api.post('/recibo/crear', datos);
export const eliminarRecibo = (id) => api.delete(`/recibo/${id}`);

export const obtenerExClientes = () => api.get('/clientes/inactivos');
export const obtenerExContratos = () => api.get('/contratos/inactivos');