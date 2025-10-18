import React, { useState, useEffect } from 'react';
import { Table, Button, Form, InputGroup, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerExClientes } from '../services/api';

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
    <div className="container mt-4">
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
    </div>
  );
};

export default ExClientes;