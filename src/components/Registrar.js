import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../components/styles/Registrar.css'

const Registrar = ({ establecerToken }) => {
  const [usuario, setUsuario] = useState('');
  const [contrasenia, setContrasenia] = useState('');
  const [confirmarContrasenia, setConfirmarContrasenia] = useState('');
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');
  const navigate = useNavigate();

  const manejoEnvio = async (e) => {
    e.preventDefault();

    if (contrasenia !== confirmarContrasenia) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      setError('');
      setExito('');

      const respuesta = await axios.post(
        'http://localhost:8080/auth/registrar',
        { username: usuario, password: contrasenia },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const token = respuesta.data.token;
      localStorage.setItem('token', token);
      establecerToken(token);

      setExito("Administrador registrado exitosamente. Redirigiendo...");
      
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);

    } catch (err) {
      console.error("Error completo:", err);

      const backendError =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.response?.data?.detalle ||
        err.response?.data?.details ||
        (Array.isArray(err.response?.data?.errors)
          ? err.response.data.errors.join(", ")
          : null);

      setError(backendError || "Error al registrar");
    }
  };

  return (
    <div className="registrar-container">
      <div className="registrar-card">
        <Form onSubmit={manejoEnvio}>
          {error && <Alert variant="danger">{error}</Alert>}
          {exito && <Alert variant="success">{exito}</Alert>}

          <Form.Group className="mb-3">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
              type="text"
              value={usuario}
              onChange={(e) => setUsuario(e.target.value)}
              required
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
              type="password"
              value={contrasenia}
              onChange={(e) => setContrasenia(e.target.value)}
              required
              />
          </Form.Group>

          <Form.Group className="mb-3">
              <Form.Label>Confirmar Contraseña</Form.Label>
              <Form.Control
              type="password"
              value={confirmarContrasenia}
              onChange={(e) => setConfirmarContrasenia(e.target.value)}
              required
              />
          </Form.Group>

          <div className="botones-registrar-container">
            <Button variant="primary" type="submit">Registrarse</Button>
            <Button variant="secondary" onClick={() => navigate('/iniciar-sesion')}>Volver</Button>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Registrar;
