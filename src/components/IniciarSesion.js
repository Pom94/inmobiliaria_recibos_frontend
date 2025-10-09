import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const IniciarSesion = ({ establecerToken }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [error, setError] = useState('');

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      console.log('Enviando solicitud a:', 'http://localhost:8080/auth/iniciar-sesion');
      console.log('Datos enviados:', { username: usuario, password: contrasenia });
      const respuesta = await axios.post('http://localhost:8080/auth/iniciar-sesion', { username: usuario, password: contrasenia }, {
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
    <Form onSubmit={manejoEnvio}>
      {error && <Alert variant="danger">{error}</Alert>}
      <Form.Group controlId="usuario">
        <Form.Label>Usuario</Form.Label>
        <Form.Control type="text" value={usuario} onChange={(e) => setUsuario(e.target.value)} required />
      </Form.Group>
      <Form.Group controlId="contrasenia">
        <Form.Label>Contraseña</Form.Label>
        <Form.Control type="password" value={contrasenia} onChange={(e) => setContrasenia(e.target.value)} required />
      </Form.Group>
      <Button variant="primary" type="submit">Iniciar Sesión</Button>
    </Form>
  );
};

export default IniciarSesion;