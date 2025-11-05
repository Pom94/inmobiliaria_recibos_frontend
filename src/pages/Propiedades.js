import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerPropiedades, crearPropiedad, actualizarPropiedad, desactivarPropiedad } from '../services/api';
import './styles/Propiedades.css';

const Propiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
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
    cargarPropiedades();
  }, []);

  const cargarPropiedades = async () => {
    try {
      const respuesta = await obtenerPropiedades();
      setPropiedades(respuesta.data);
      setPropiedadesFiltradas(respuesta.data);
    } catch (err) {
      console.error('Error al cargar propiedades', err);
    }
  };

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);
    const filtradas = propiedades.filter(propiedad => 
      propiedad.direccionPropiedad.toLowerCase().includes(termino) || propiedad.localidadPropiedad.toLowerCase().includes(termino)
    );
    setPropiedadesFiltradas(filtradas);
  };

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      await crearPropiedad(datosFormulario);
      cargarPropiedades();
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
      console.error('Error al guardar propiedad', err);
    }
  };


  const manejoVerDetalles = (id) => {
    navigate(`/propiedades/detalle/${id}`);
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
      <div className="propiedades-container">
        <div className="propiedades-header">
          <h2 className="propiedades-title">Propiedades</h2>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
            className="boton-nueva-propiedad"
          >
            Nueva Propiedad
          </Button>
        </div>

        <InputGroup className="propiedades-buscar">
          <Form.Control
            placeholder="Buscar por dirección o localidad"
            value={busqueda}
            onChange={manejoBusqueda}
          />
        </InputGroup>

        <div className="propiedades-tabla-container">
          <Table  className='mb-0 propiedades-tabla'>
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
              {propiedadesFiltradas.map((propiedad) => (
                <tr key={propiedad.id}>
                  <td>{propiedad.id}</td>
                  <td>{propiedad.numContrato}</td>
                  <td>{propiedad.direccionPropiedad}</td>
                  <td>{propiedad.localidadPropiedad}</td>
                  <td className='text-center'>
                    <Button 
                      variant="outline-light"
                      size='sm' 
                      onClick={() => manejoVerDetalles(propiedad.id)}
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
        <Modal.Header closeButton className='modal-propiedades-header'>
          <Modal.Title>Agregar Propiedad</Modal.Title>
        </Modal.Header>
        <Modal.Body className='modal-propiedades-body'>
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

export default Propiedades;