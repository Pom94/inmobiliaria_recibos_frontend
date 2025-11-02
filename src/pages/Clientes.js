import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerClientes, crearCliente } from '../services/api';
import './styles/Clientes.css';

const Clientes = () => {
  const [clientes, setClientes] = useState([]);
  const [clientesFiltrados, setClientesFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    nombre: '',
    direccion: '',
    iva: '',
    cuit: '',
    localidad: ''
  });

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
    const filtrados = clientes.filter((cliente) =>
      cliente.nombre.toLowerCase().includes(termino)
      || cliente.cuit.toLowerCase().includes(termino)
    );
    setClientesFiltrados(filtrados);
  };

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      await crearCliente(datosFormulario);
      cargarClientes();
      setMostrarModal(false);
      setDatosFormulario({ nombre: '', direccion: '', iva: '', cuit: '', localidad: '' });
    } catch (err) {
      console.error('Error al guardar cliente', err);
    }
  };

  const manejoVerDetalles = (id) => {
    navigate(`/clientes/detalle/${id}`);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDatosFormulario({ nombre: '', direccion: '', iva: '', cuit: '', localidad: '' });
  };

  return (
    <div className="contenedor-principal">
      <div className="clientes-container">
        <div className="clientes-header">
          <h2 className="clientes-title">Clientes</h2>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
            className="boton-nuevo-cliente"
          >
            Nuevo Cliente
          </Button>
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
              {clientesFiltrados.map((cliente) => (
                <tr key={cliente.id}>
                  <td onClick={() => manejoVerDetalles(cliente.id)} style={{ cursor: 'pointer' }}>
                    {cliente.nombre}
                  </td>
                  <td onClick={() => manejoVerDetalles(cliente.id)} style={{ cursor: 'pointer' }}>
                    {cliente.cuit}
                  </td>
                  <td className="text-center">
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => manejoVerDetalles(cliente.id)}
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

      <Modal show={mostrarModal} onHide={cerrarModal} centered>
        <Modal.Header closeButton className="modal-clientes-header">
          <Modal.Title>Agregar Cliente</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-clientes-body">
          <Form onSubmit={manejoEnvio}>
            <Form.Label>Nombre del Cliente:</Form.Label>
            <Form.Control
              className="mb-2"
              name="nombre"
              value={datosFormulario.nombre}
              onChange={manejoCambio}
            />
            <Form.Label>Dirección:</Form.Label>
            <Form.Control
              className="mb-2"
              name="direccion"
              value={datosFormulario.direccion}
              onChange={manejoCambio}
            />
            <Form.Label>Localidad:</Form.Label>
            <Form.Control
              className="mb-2"
              name="localidad"
              value={datosFormulario.localidad}
              onChange={manejoCambio}
            />
            <Form.Label>I.V.A:</Form.Label>
            <Form.Control
              className="mb-2"
              name="iva"
              value={datosFormulario.iva}
              onChange={manejoCambio}
            />
            <Form.Label>C.U.I.T:</Form.Label>
            <Form.Control
              className="mb-2"
              name="cuit"
              value={datosFormulario.cuit}
              onChange={manejoCambio}
            />

            <Button variant="primary" type="submit" className="mt-3">
              Guardar
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
    /*<div className="container mt-4">
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
    </div>*/
  );
};

export default Clientes;