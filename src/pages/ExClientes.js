import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerExClientes } from '../services/api';
import './styles/ExClientes.css';

const ExClientes = () => {
  const [exClientes, setExClientes] = useState([]);
  const [exClientesFiltrados, setExClientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarExClientes();
  }, []);

  const cargarExClientes = async () => {
      try {
        const respuesta = await obtenerExClientes();
        setExClientes(respuesta.data);
        setExClientesFiltrados(respuesta.data);
      } catch (err) {
        console.error('Error al cargar clientes', err);
      }
    };

  const manejoVerDetalles = (id) => {
    navigate(`/clientes/detalle/${id}`);
  };

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);
    const filtrados = exClientes.filter(exCliente => 
      exCliente.nombre.toLowerCase().includes(termino)
    );
    setExClientesFiltrados(filtrados);
  };

  return (
    <div className="contenedor-principal">
      <div className="clientes-container">
        <div className="clientes-header">
          <h2 className="clientes-title">Clientes Inactivos</h2>
        </div>

        <InputGroup className="clientes-search">
          <Form.Control
            placeholder="Buscar por nombre o CUIT"
            value={busqueda}
            onChange={manejoBusqueda}
          />
        </InputGroup>

        <div className="clientes-tabla-container">
          <Table borderless className="mb-0 clientes-tabla">
            <thead>
              <tr>
                <th>Nombre</th>
                <th>CUIT</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {exClientesFiltrados.map((exCliente) => (
                <tr key={exCliente.id}>
                  <td onClick={() => manejoVerDetalles(exCliente.id)} style={{ cursor: 'pointer' }}>
                    {exCliente.nombre}
                  </td>
                  <td onClick={() => manejoVerDetalles(exCliente.id)} style={{ cursor: 'pointer' }}>
                    {exCliente.cuit}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => manejoVerDetalles(exCliente.id)}
                      className="btn-ver"
                    >
                      Ver
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
    </div>
    
    /*<div className="contenedor-principal">
      <h2>Clientes Inactivos</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={manejoBusqueda}
        />
      </InputGroup>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>CUIT</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {exClientesFiltrados.map((cliente) => (
            <tr key={cliente.id}>
              <td>{cliente.id}</td>
              <td>{cliente.nombre}</td>
              <td>{cliente.cuit}</td>
              <td>
                <Button variant="secondary" onClick={() => manejoVerDetalles(cliente.id)}>Ver Detalles</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>*/
  );
};

export default ExClientes;