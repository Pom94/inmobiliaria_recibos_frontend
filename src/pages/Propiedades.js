import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerPropiedades, crearPropiedad, actualizarPropiedad, desactivarPropiedad } from '../services/api';

const Propiedades = () => {
  const [propiedades, setPropiedades] = useState([]);
  const [propiedadesFiltradas, setPropiedadesFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [propiedadSeleccionada, setPropiedadSeleccionada] = useState(null);
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
      const datos = {
        ...datosFormulario,
        inicioContrato: datosFormulario.inicioContrato ? new Date(datosFormulario.inicioContrato).toISOString() : null,
        finContrato: datosFormulario.finContrato ? new Date(datosFormulario.finContrato).toISOString() : null
      };
      if (propiedadSeleccionada) {
        await actualizarPropiedad(propiedadSeleccionada.id, datos);
      } else {
        await crearPropiedad(datos);
      }
      cargarPropiedades();
      setMostrarModal(false);
      setPropiedadSeleccionada(null);
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

  const manejoEditar = (propiedad) => {
    setPropiedadSeleccionada(propiedad);
    setDatosFormulario({
      numContrato: propiedad.numContrato,
      inicioContrato: propiedad.inicioContrato ? new Date(propiedad.inicioContrato).toISOString().split('T')[0] : '',
      finContrato: propiedad.finContrato ? new Date(propiedad.finContrato).toISOString().split('T')[0] : '',
      nombrePropietario: propiedad.nombrePropietario,
      direccionPropiedad: propiedad.direccionPropiedad,
      localidadPropiedad: propiedad.localidadPropiedad,
      cuitPropietario: propiedad.cuitPropietario
    });
    setMostrarModal(true);
  };

  const manejoVerDetalles = (id) => {
    navigate(`/propiedades/detalle/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Propiedades</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Buscar por dirección o localidad"
          value={busqueda}
          onChange={manejoBusqueda}
        />
      </InputGroup>
      <Button onClick={() => setMostrarModal(true)} className="mb-3">Agregar Propiedad</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nº Contrato</th>
            <th>Dirección</th>
            <th>Localidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {propiedadesFiltradas.map((propiedad) => (
            <tr key={propiedad.id}>
              <td>{propiedad.id}</td>
              <td>{propiedad.numContrato}</td>
              <td>{propiedad.direccionPropiedad}</td>
              <td>{propiedad.localidadPropiedad}</td>
              <td>
                <Button variant="secondary" onClick={() => manejoVerDetalles(propiedad.id)}>Ver Detalles</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={mostrarModal} onHide={() => setMostrarModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{propiedadSeleccionada ? 'Editar Propiedad' : 'Agregar Propiedad'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={manejoEnvio}>
            <Form.Group>
              <Form.Label>Nº Contrato</Form.Label>
              <Form.Control name="numContrato" value={datosFormulario.numContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inicio Contrato</Form.Label>
              <Form.Control type="date" name="inicioContrato" value={datosFormulario.inicioContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fin Contrato</Form.Label>
              <Form.Control type="date" name="finContrato" value={datosFormulario.finContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Propietario</Form.Label>
              <Form.Control name="nombrePropietario" value={datosFormulario.nombrePropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección Propiedad</Form.Label>
              <Form.Control name="direccionPropiedad" value={datosFormulario.direccionPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localidad</Form.Label>
              <Form.Control name="localidadPropiedad" value={datosFormulario.localidadPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>CUIT Propietario</Form.Label>
              <Form.Control name="cuitPropietario" value={datosFormulario.cuitPropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" type="submit">Guardar</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Propiedades;