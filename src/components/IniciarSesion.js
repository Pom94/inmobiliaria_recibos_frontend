import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import '../components/styles/IniciarSesion.css'

const IniciarSesion = ({ establecerToken }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      //'http://localhost:8080/auth/iniciar-sesion' / 'https://inmobiliaria-recibos-backend.onrender.com/auth/iniciar-sesion'
      console.log('Datos enviados:', { username: usuario, password: contrasenia });
      const respuesta = await axios.post('https://inmobiliaria-recibos-backend.onrender.com/auth/iniciar-sesion', { username: usuario, password: contrasenia }, {
        headers: { 'Content-Type': 'application/json' }
      });
      const token = respuesta.data.token;
      localStorage.setItem('token', token);
      establecerToken(token);
      console.log('Token recibido:', token);
    } catch (err) {
      console.error('Error en login:', err);
      setError('Inicio de sesión fallido: ' + (err.response?.data?.message || err.message || 'Error de red'));
    }
  };

  return (
    <div className="iniciar-sesion-container">
      <div className="iniciar-sesion-card">
        <Form onSubmit={manejoEnvio}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="usuario">
            <Form.Label>Usuario</Form.Label>
            <Form.Control type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
          </Form.Group>
          <Form.Group className="mb-3" controlId="contrasenia">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} required />
          </Form.Group>

          <div className="mt-3 text-center botones-iniciar-sesion-container">
            <Button variant="primary" type="submit">Iniciar Sesión</Button>
          </div>
          <div className="mt-3 text-center">
            <a href="/registrar" style={{ color: "#5865f2" }}>
              Registrar
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default IniciarSesion;