import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerContratos, crearContrato, actualizarContrato, desactivarContrato } from '../services/api';
import './styles/Contratos.css';

const Contratos = () => {
  const [contratos, setContratos] = useState([]);
  const [contratosFiltrados, setContratosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    numContrato: '',
    inicioContrato: '',
    finContrato: '',
    nombrePropietario: '',
    direccionPropiedad: '',
    localidadPropiedad: '',
    cuitPropietario: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    cargarContratos();
  }, []);

  const cargarContratos = async () => {
    try {
      const respuesta = await obtenerContratos();
      setContratos(respuesta.data);
      setContratosFiltrados(respuesta.data);
    } catch (err) {
      console.error('Error al cargar contratos', err);
    }
  };

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);
    const filtrados = contratos.filter(contrato => 
      contrato.direccionPropiedad.toLowerCase().includes(termino) || contrato.localidadPropiedad.toLowerCase().includes(termino)
    );
    setContratosFiltrados(filtrados);
  };

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      await crearContrato(datosFormulario);
      cargarContratos();
      setMostrarModal(false);
      setDatosFormulario({
        numContrato: '',
        inicioContrato: '',
        finContrato: '',
        nombrePropietario: '',
        direccionPropiedad: '',
        localidadPropiedad: '',
        cuitPropietario: ''
      });
    } catch (err) {
      console.error('Error al guardar contrato', err);
    }
  };


  const manejoVerDetalles = (id) => {
    navigate(`/contratos/detalle/${id}`);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDatosFormulario({
        numContrato: '',
        inicioContrato: '',
        finContrato: '',
        nombrePropietario: '',
        direccionPropiedad: '',
        localidadPropiedad: '',
        cuitPropietario: ''
      });
  };

  return (
    <div className="contenedor-principal">
      <div className="contratos-container">
        <div className="contratos-header">
          <h2 className="contratos-title">Contratos</h2>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
            className="boton-nueva-contrato"
          >
            Nuevo Contrato
          </Button>
        </div>

        <InputGroup className="contratos-buscar">
          <Form.Control
            placeholder="Buscar por dirección o localidad"
            value={busqueda}
            onChange={manejoBusqueda}
          />
        </InputGroup>

        <div className="contratos-tabla-container">
          <Table  className='mb-0 contratos-tabla'>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nº Contrato</th>
                <th>Dirección</th>
                <th>Localidad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {contratosFiltrados.map((contrato) => (
                <tr key={contrato.id}>
                  <td>{contrato.id}</td>
                  <td>{contrato.numContrato}</td>
                  <td>{contrato.direccionPropiedad}</td>
                  <td>{contrato.localidadPropiedad}</td>
                  <td className='text-center'>
                    <Button 
                      variant="outline-light"
                      size='sm' 
                      onClick={() => manejoVerDetalles(contrato.id)}
                      className='btn-ver'
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
        <Modal.Header closeButton className='modal-contratos-header'>
          <Modal.Title>Agregar Contrato</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-contratos-body'>
          <Form onSubmit={manejoEnvio}>
            <Form.Group>
              <Form.Label>Número de Contrato:</Form.Label>
              <Form.Control className="mb-2" name="numContrato" value={datosFormulario.numContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha de Inicio de Contrato:</Form.Label>
              <Form.Control className="mb-2" type="date" name="inicioContrato" value={datosFormulario.inicioContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fecha de Fin de Contrato:</Form.Label>
              <Form.Control className="mb-2" type="date" name="finContrato" value={datosFormulario.finContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre de Propietario:</Form.Label>
              <Form.Control className="mb-2" name="nombrePropietario" value={datosFormulario.nombrePropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección de la Propiedad:</Form.Label>
              <Form.Control className="mb-2" name="direccionPropiedad" value={datosFormulario.direccionPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localidad de la Propiedad:</Form.Label>
              <Form.Control className="mb-2" name="localidadPropiedad" value={datosFormulario.localidadPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>CUIT del Propietario:</Form.Label>
              <Form.Control className="mb-2" name="cuitPropietario" value={datosFormulario.cuitPropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" type="submit" className='mt-3'>Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Contratos;