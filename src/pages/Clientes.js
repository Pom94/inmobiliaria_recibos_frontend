import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerClientes, crearCliente, actualizarCliente, desactivarCliente } from '../services/api';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [clienteSeleccionado, setClienteSeleccionado] = useState(null);
  const [datosFormulario, setDatosFormulario] = useState({ nombre: '', direccion: '', iva: '', cuit: '', localidad: '' });
  const navigate = useNavigate();

  useEffect(() => {
    cargarClientes();
  }, []);

  const cargarClientes = async () => {
    try {
      const respuesta = await obtenerClientes();
      setClientes(respuesta.data);
      setClientesFiltrados(respuesta.data);
    } catch (err) {
      console.error('Error al cargar clientes', err);
    }
  };

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);
    const filtrados = clientes.filter(cliente => 
      cliente.nombre.toLowerCase().includes(termino)
    );
    setClientesFiltrados(filtrados);
  };

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      if (clienteSeleccionado) {
        await actualizarCliente(clienteSeleccionado.id, datosFormulario);
      } else {
        await crearCliente(datosFormulario);
      }
      cargarClientes();
      setMostrarModal(false);
      setClienteSeleccionado(null);
      setDatosFormulario({ nombre: '', direccion: '', iva: '', cuit: '', localidad: '' });
    } catch (err) {
      console.error('Error al guardar cliente', err);
    }
  };

  const manejoEditar = (cliente) => {
    setClienteSeleccionado(cliente);
    setDatosFormulario({
      nombre: cliente.nombre,
      direccion: cliente.direccion,
      iva: cliente.iva,
      cuit: cliente.cuit,
      localidad: cliente.localidad
    });
    setMostrarModal(true);
  };

  const manejoVerDetalles = (id) => {
    navigate(`/clientes/detalle/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Clientes</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Buscar por nombre o apellido"
          value={busqueda}
          onChange={manejoBusqueda}
        />
      </InputGroup>
      <Button onClick={() => setMostrarModal(true)} className="mb-3">Agregar Cliente</Button>
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
          {clientesFiltrados.map((cliente) => (
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

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{clienteSeleccionado ? 'Editar Cliente' : 'Agregar Cliente'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={manejoEnvio}>
            <Form.Group>
              <Form.Label>Nombre</Form.Label>
              <Form.Control name="nombre" value={datosFormulario.nombre} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control name="direccion" value={datosFormulario.direccion} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>IVA</Form.Label>
              <Form.Control name="iva" value={datosFormulario.iva} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>CUIT</Form.Label>
              <Form.Control name="cuit" value={datosFormulario.cuit} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localidad</Form.Label>
              <Form.Control name="localidad" value={datosFormulario.localidad} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Clientes;