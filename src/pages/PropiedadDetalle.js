import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { obtenerPropiedadPorId, actualizarPropiedad, desactivarPropiedad, activarPropiedad } from '../services/api';
import '../pages/styles/PropiedadDetalle.css'

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
    <div className="propiedad-detalle-container">
      <div className="propiedad-detalle-card">

        <h2 className="propiedad-detalle-title">Detalles de la Propiedad</h2>

        {editando ? (
          <Form onSubmit={(e) => { e.preventDefault(); manejoGuardar(); }}>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">Nº de Contrato</Form.Label>
              <Form.Control className="propiedad-detalle-input" name="numContrato" value={datosFormulario.numContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">Dirección de la Propiedad</Form.Label>
              <Form.Control className="propiedad-detalle-input" name="direccionPropiedad" value={datosFormulario.direccionPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">Localidad de la Propiedad</Form.Label>
              <Form.Control className="propiedad-detalle-input" name="localidadPropiedad" value={datosFormulario.localidadPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">Nombre del Propietario</Form.Label>
              <Form.Control className="propiedad-detalle-input" name="nombrePropietario" value={datosFormulario.nombrePropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">CUIT del Propietario</Form.Label>
              <Form.Control className="propiedad-detalle-input" name="cuitPropiedad" value={datosFormulario.cuitPropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">Inicio de Contrato</Form.Label>
              <Form.Control className="propiedad-detalle-input" type="date" name="inicioContrato" value={datosFormulario.inicioContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="propiedad-detalle-label">Fin de Contrato</Form.Label>
              <Form.Control className="propiedad-detalle-input" type="date" name="finContrato" value={datosFormulario.finContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" onClick={manejoGuardar}>Guardar</Button>{' '}
            <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
          </Form>
        ) : (
          <>
            <div className="propiedad-detalle-info">
              <p><strong>ID:</strong> {propiedad.id}</p>
              <p><strong>Nº de Contrato:</strong> {propiedad.numContrato}</p>
              <p><strong>Inicio de Contrato:</strong> {formatearFecha(propiedad.inicioContrato)}</p>
              <p><strong>Fin de Contrato:</strong> {formatearFecha(propiedad.finContrato)}</p>
              <p><strong>Dirección:</strong> {propiedad.direccionPropiedad}</p>
              <p><strong>Localidad:</strong> {propiedad.localidadPropiedad}</p>
              <p><strong>Nombre Propietario:</strong> {propiedad.nombrePropietario}</p>
              <p><strong>CUIT Propietario:</strong> {propiedad.cuitPropietario}</p>
              <p><strong>Activo:</strong> {propiedad.activo ? 'Sí' : 'No'}</p>
            </div>
          </>
        )}
      </div>

      <Button className="btn-editar" onClick={() => setEditando(true)}>Editar</Button>
      {propiedad.activo ? (
        <Button variant="danger" className="btn-desactivar" onClick={manejoDesactivar}>Desactivar</Button>
      ) : (
        <Button variant="success" className="btn-activar" onClick={manejoActivar}>Activar</Button>
      )}
      <Button className="btn-volver" onClick={() => navigate(propiedad.activo ? '/propiedades' : '/propiedades/inactivas')}>
        Volver
      </Button>
    </div>
    );
};

export default PropiedadDetalle;