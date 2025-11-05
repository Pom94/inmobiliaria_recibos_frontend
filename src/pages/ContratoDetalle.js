import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { obtenerContratoPorId, actualizarContrato, desactivarContrato, activarContrato } from '../services/api';
import '../pages/styles/ContratoDetalle.css'

const ContratoDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [contrato, setContrato] = useState(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({ numContrato: '', inicioContrato: '', finContrato: '', nombrePropietario: '', direccionPropiedad: '', localidadPropiedad: '', cuitPropietario: '' });

  useEffect(() => {
    const cargarContrato = async () => {
      try {
        const respuesta = await obtenerContratoPorId(id);
        setContrato(respuesta.data);
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
        console.error('Error al cargar detalles del contrato:', err);
        setError('No se pudo cargar el contrato. Verifica el ID o intenta de nuevo.');
      }
    };
    cargarContrato();
  }, [id]);

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoGuardar = async () => {
    try {
      await actualizarContrato(id, datosFormulario);
      setContrato({ ...contrato, ...datosFormulario });
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar contrato:', err);
      setError('Error al actualizar el contrato.');
    }
  };

  const manejoDesactivar = async () => {
    if (window.confirm('¿Desactivar contrato?')) {
      try {
        await desactivarContrato(id);
        navigate('/contratos');
      } catch (err) {
        console.error('Error al desactivar contrato:', err);
        setError('Error al desactivar el contrato.');
      }
    }
  };

  const manejoActivar = async () => {
    if (window.confirm('¿Activar contrato?')) {
      try {
        await activarContrato(id);
        navigate('/contratos/inactivos')
      } catch (err) {
        console.error('Error al activar contrato: ', err);
        setError('Error al activar el contrato.');
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

  if (error) return <Container><p>{error}</p><Button onClick={() => navigate('/contratos')}>Volver</Button></Container>;
  if (!contrato) return <Container><p>Cargando...</p></Container>;

  return (
    <div className="contrato-detalle-container">
      <div className="contrato-detalle-card">

        <h2 className="contrato-detalle-title">Detalles del Contrato</h2>

        {editando ? (
          <Form onSubmit={(e) => { e.preventDefault(); manejoGuardar(); }}>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">Nº de Contrato</Form.Label>
              <Form.Control className="contrato-detalle-input" name="numContrato" value={datosFormulario.numContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">Dirección de la Propiedad</Form.Label>
              <Form.Control className="contrato-detalle-input" name="direccionPropiedad" value={datosFormulario.direccionPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">Localidad de la Propiedad</Form.Label>
              <Form.Control className="contrato-detalle-input" name="localidadPropiedad" value={datosFormulario.localidadPropiedad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">Nombre del Propietario</Form.Label>
              <Form.Control className="contrato-detalle-input" name="nombrePropietario" value={datosFormulario.nombrePropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">CUIT del Propietario</Form.Label>
              <Form.Control className="contrato-detalle-input" name="cuitPropiedad" value={datosFormulario.cuitPropietario} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">Inicio de Contrato</Form.Label>
              <Form.Control className="contrato-detalle-input" type="date" name="inicioContrato" value={datosFormulario.inicioContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="contrato-detalle-label">Fin de Contrato</Form.Label>
              <Form.Control className="contrato-detalle-input" type="date" name="finContrato" value={datosFormulario.finContrato} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" onClick={manejoGuardar}>Guardar</Button>{' '}
            <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
          </Form>
        ) : (
          <>
            <div className="contrato-detalle-info">
              <p><strong>ID:</strong> {contrato.id}</p>
              <p><strong>Nº de Contrato:</strong> {contrato.numContrato}</p>
              <p><strong>Inicio de Contrato:</strong> {formatearFecha(contrato.inicioContrato)}</p>
              <p><strong>Fin de Contrato:</strong> {formatearFecha(contrato.finContrato)}</p>
              <p><strong>Dirección:</strong> {contrato.direccionPropiedad}</p>
              <p><strong>Localidad:</strong> {contrato.localidadPropiedad}</p>
              <p><strong>Nombre Propietario:</strong> {contrato.nombrePropietario}</p>
              <p><strong>CUIT Propietario:</strong> {contrato.cuitPropietario}</p>
              <p><strong>Activo:</strong> {contrato.activo ? 'Sí' : 'No'}</p>
            </div>
          </>
        )}
      </div>

      <Button className="btn-editar" onClick={() => setEditando(true)}>Editar</Button>
      {contrato.activo ? (
        <Button variant="danger" className="btn-desactivar" onClick={manejoDesactivar}>Desactivar</Button>
      ) : (
        <Button variant="success" className="btn-activar" onClick={manejoActivar}>Activar</Button>
      )}
      <Button className="btn-volver" onClick={() => navigate(contrato.activo ? '/contratos' : '/contratos/inactivos')}>
        Volver
      </Button>
    </div>
    );
};

export default ContratoDetalle;