import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { obtenerPropiedadPorId, actualizarPropiedad, desactivarPropiedad, activarPropiedad } from '../services/api';

const PropiedadDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [propiedad, setPropiedad] = useState(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({ numContrato: '', inicioContrato: '', finContrato: '', nombrePropietario: '', direccionPropiedad: '', localidadPropiedad: '', cuitPropietario: '' });

  useEffect(() => {
    const cargarPropiedad = async () => {
      try {
        const respuesta = await obtenerPropiedadPorId(id);
        setPropiedad(respuesta.data);
        setDatosFormulario({
          numContrato: respuesta.data.numContrato,
          inicioContrato: respuesta.data.inicioContrato,
          finContrato: respuesta.data.finContrato,
          nombrePropietario: respuesta.data.nombrePropietario,
          direccionPropiedad: respuesta.data.direccionPropiedad,
          localidadPropiedad: respuesta.data.localidadPropiedad,
          cuitPropietario: respuesta.data.cuitPropietario
        });
      } catch (err) {
        console.error('Error al cargar detalles de la propiedad:', err);
        setError('No se pudo cargar la propiedad. Verifica el ID o intenta de nuevo.');
      }
    };
    cargarPropiedad();
  }, [id]);

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoGuardar = async () => {
    try {
      await actualizarPropiedad(id, datosFormulario);
      setPropiedad({ ...propiedad, ...datosFormulario });
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar propiedad:', err);
      setError('Error al actualizar la propiedad.');
    }
  };

  const manejoDesactivar = async () => {
    if (window.confirm('¿Desactivar propiedad?')) {
      try {
        await desactivarPropiedad(id);
        navigate('/propiedades');
      } catch (err) {
        console.error('Error al desactivar propiedad:', err);
        setError('Error al desactivar la propiedad.');
      }
    }
  };

  const manejoActivar = async () => {
    if (window.confirm('¿Activar propiedad?')) {
      try {
        await activarPropiedad(id);
        navigate('/propiedades/inactivas')
      } catch (err) {
        console.error('Error al activar propiedad: ', err);
        setError('Error al activar la propiedad.');
      }
    }
  };

  const formatearFecha = (fechaISO) => {
    if (!fechaISO) return '';
    const fecha = new Date(fechaISO);
    return fecha.toLocaleDateString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  if (error) return <Container><p>{error}</p><Button onClick={() => navigate('/propiedades')}>Volver</Button></Container>;
  if (!propiedad) return <Container><p>Cargando...</p></Container>;

  return (
      <Container className="mt-4">
        <h2>Detalles de la Propiedad</h2>
        {editando ? (
          <Form onSubmit={(e) => { e.preventDefault(); manejoGuardar(); }}>
            <Form.Group>
              <Form.Label>Nº de Contrato</Form.Label>
              <Form.Control name="numContrato" value={datosFormulario.numContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Dirección de la Propiedad</Form.Label>
              <Form.Control name="direccionPropiedad" value={datosFormulario.direccionPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Localidad de la Propiedad</Form.Label>
              <Form.Control name="localidadPropiedad" value={datosFormulario.localidadPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Nombre del Propietario</Form.Label>
              <Form.Control name="nombrePropietario" value={datosFormulario.nombrePropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>CUIT del Propietario</Form.Label>
              <Form.Control name="cuitPropiedad" value={datosFormulario.cuitPropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Inicio de Contrato</Form.Label>
              <Form.Control type="date" name="inicioContrato" value={datosFormulario.inicioContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label>Fin de Contrato</Form.Label>
              <Form.Control type="date" name="finContrato" value={datosFormulario.finContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" onClick={manejoGuardar}>Guardar</Button>{' '}
            <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
          </Form>
        ) : (
            /*numContrato: respuesta.data.numContrato,
          inicioContrato: respuesta.data.inicioContrato,
          finContrato: respuesta.data.finContrato,
          nombrePropietario: respuesta.data.nombrePropietario,
          direccionPropiedad: respuesta.data.direccionPropiedad,
          localidadPropiedad: respuesta.data.localidadPropiedad,
          cuitPropietario: respuesta.data.cuitPropietario*/
          <>
            <Row>
              <Col><strong>ID:</strong> {propiedad.id}</Col>
            </Row>
            <Row>
              <Col><strong>Nº de Contrato:</strong> {propiedad.numContrato}</Col>
            </Row>
            <Row>
              <Col><strong>Dirección de la Propiedad:</strong> {propiedad.direccionPropiedad}</Col>
            </Row>
            <Row>
              <Col><strong>Localidad de la Propiedad:</strong> {propiedad.localidadPropiedad}</Col>
            </Row>
            <Row>
              <Col><strong>Nombre del Propietario:</strong> {propiedad.nombrePropietario}</Col>
            </Row>
            <Row>
              <Col><strong>CUIT del Propietario:</strong> {propiedad.cuitPropietario}</Col>
            </Row>
            <Row>
              <Col><strong>Inicio del Contrato:</strong> {formatearFecha(propiedad.inicioContrato)}</Col>
            </Row>
            <Row>
              <Col><strong>Fin del Contrato:</strong> {formatearFecha(propiedad.finContrato)}</Col>
            </Row>
            <Row>
              <Col><strong>Activo:</strong> {propiedad.activo ? 'Sí' : 'No'}</Col>
            </Row>
            <Button variant="info" onClick={() => setEditando(true)} className="mt-3">Editar</Button>{' '}
            {propiedad.activo ? (
              <Button variant="danger" onClick={manejoDesactivar} className="mt-3">Desactivar</Button>
            ) : (
              <Button variant="success" onClick={manejoActivar} className="mt-3">Activar</Button>
            )}{' '}
            {propiedad.activo ? (
              <Button variant="secondary" onClick={() => navigate('/propiedades')} className="mt-3">Volver</Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate('/propiedades/inactivas')} className="mt-3">Volver</Button>
            )}
          </>
        )}
      </Container>
    );
};

export default PropiedadDetalle;