import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import IniciarSesion from './components/IniciarSesion';
import Clientes from './pages/Clientes';
import Contratos from './pages/Contratos';
import Recibos from './pages/Recibos';
import ExClientes from './pages/ExClientes';
import ExContratos from './pages/ExContratos';
import ClienteDetalle from './pages/ClienteDetalle';
import ContratoDetalle from './pages/ContratoDetalle';
import ReciboDetalle from './pages/ReciboDetalle';
import Registrar from './components/Registrar';
//import './App.css';

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
        <div className="sidebar">
          <h3>Inmobiliaria</h3>
          <ul>
            <li><Link to="/clientes">Clientes</Link></li>
            <li><Link to="/clientes/inactivos">Clientes Inactivos</Link></li>
            <li><Link to="/contratos">Contratos</Link></li>
            <li><Link to="/contratos/inactivos">Contratos Inactivos</Link></li>
            <li><Link to="/recibos">Recibos</Link></li>
            <li><Link onClick={cerrarSesion}>Cerrar Sesión</Link></li>
          </ul>
        </div>
        /*<Navbar bg="dark" variant="dark" expand="lg">
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
        </Navbar>*/
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
          path="/contratos" 
          element={token ? <Contratos /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/contratos/detalle/:id" 
          element={token ? <ContratoDetalle /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/recibos" 
          element={token ? <Recibos /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/recibos/detalle/:numeroRecibo" 
          element={token ? <ReciboDetalle /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/clientes/inactivos" 
          element={token ? <ExClientes /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/contratos/inactivos" 
          element={token ? <ExContratos /> : <Navigate to="/iniciar-sesion" />} 
        />
        <Route 
          path="/registrar"
          element={!token ? <Registrar establecerToken={setToken} /> : <Navigate to="/" />}
        />
      </Routes>
    </Router>
  );
};

const Dashboard = () => {
  return (
    <Container className="mt-4 dashboard-inmobiliaria">
      <h1>Bienvenido al Sistema Inmobiliario</h1>
      <p>Usa el menú para gestionar clientes, propiedades y recibos.</p>
    </Container>
  );
};

export default App;