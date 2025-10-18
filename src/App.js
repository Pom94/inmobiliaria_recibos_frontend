import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import IniciarSesion from './components/IniciarSesion';
import Clientes from './pages/Clientes';
import Propiedades from './pages/Propiedades';
import Recibos from './pages/Recibos';
import ExClientes from './pages/ExClientes';
import ExPropiedades from './pages/ExPropiedades';
import ClienteDetalle from './pages/ClienteDetalle';
import PropiedadDetalle from './pages/PropiedadDetalle';

const App = () => {
  const [token, setToken] = useState(localStorage.getItem('token'));

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  const cerrarSesion = () => {
    localStorage.removeItem('token');
    setToken(null);
    window.location.href = '/iniciar-sesion';
  };

  return (
    <Router>
      {token && (
        <Navbar bg="dark" variant="dark" expand="lg">
          <Container>
            <Navbar.Brand>Inmobiliaria</Navbar.Brand>
            <Navbar.Toggle aria-controls="basic-navbar-nav" />
            <Navbar.Collapse id="basic-navbar-nav">
              <Nav className="me-auto">
                <Nav.Link href="/clientes">Clientes</Nav.Link>
                <Nav.Link href="/propiedades">Propiedades</Nav.Link>
                <Nav.Link href="/recibos">Recibos</Nav.Link>
                <Nav.Link href="/clientes/inactivos">Clientes Inactivos</Nav.Link>
                <Nav.Link href="/propiedades/inactivas">Propiedades Inactivas</Nav.Link>
                <Nav.Link onClick={cerrarSesion}>Cerrar Sesión</Nav.Link>
              </Nav>
            </Navbar.Collapse>
          </Container>
        </Navbar>
      )}
      <Routes>
        <Route 
          path="/iniciar-sesion" 
          element={token ? <Navigate to="/" /> : <IniciarSesion establecerToken={setToken} />} 
        />
        <Route 
          path="/" 
          element={token ? <Dashboard /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/clientes" 
          element={token ? <Clientes /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/clientes/detalle/:id" 
          element={token ? <ClienteDetalle /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/propiedades" 
          element={token ? <Propiedades /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/propiedades/detalle/:id" 
          element={token ? <PropiedadDetalle /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/recibos" 
          element={token ? <Recibos /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/clientes/inactivos" 
          element={token ? <ExClientes /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/propiedades/inactivas" 
          element={token ? <ExPropiedades /> : <Navigate to="/iniciar-sesion" />} 
        />
      </Routes>
    </Router>
  );
};

const Dashboard = () => {
  return (
    <Container className="mt-4">
      <h1>Bienvenido al Sistema Inmobiliario</h1>
      <p>Usa el menú superior para gestionar clientes, propiedades y recibos.</p>
    </Container>
  );
};

export default App;