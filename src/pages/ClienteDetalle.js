import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { obtenerClientePorId, actualizarCliente, desactivarCliente, activarCliente } from '../services/api';
import './styles/ClienteDetalle.css';

const ClienteDetalle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cliente, setCliente] = useState(null);
  const [error, setError] = useState('');
  const [editando, setEditando] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({ nombre: '', direccion: '', iva: '', cuit: '', localidad: '' });

  useEffect(() => {
    const cargarCliente = async () => {
      try {
        const respuesta = await obtenerClientePorId(id);
        setCliente(respuesta.data);
        setDatosFormulario({
          nombre: respuesta.data.nombre,
          direccion: respuesta.data.direccion,
          iva: respuesta.data.iva,
          cuit: respuesta.data.cuit,
          localidad: respuesta.data.localidad
        });
      } catch (err) {
        console.error('Error al cargar detalles del cliente:', err);
        setError('No se pudo cargar el cliente. Verifica el ID o intenta de nuevo.');
      }
    };
    cargarCliente();
  }, [id]);

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoGuardar = async () => {
    try {
      await actualizarCliente(id, datosFormulario);
      setCliente({ ...cliente, ...datosFormulario });
      setEditando(false);
    } catch (err) {
      console.error('Error al guardar cliente:', err);
      setError('Error al actualizar el cliente.');
    }
  };

  const manejoDesactivar = async () => {
    if (window.confirm('¿Desactivar cliente?')) {
      try {
        await desactivarCliente(id);
        navigate('/clientes');
      } catch (err) {
        console.error('Error al desactivar cliente:', err);
        setError('Error al desactivar el cliente.');
      }
    }
  };

  const manejoActivar = async () => {
    if (window.confirm('¿Activar cliente?')) {
      try {
        await activarCliente(id);
        navigate('/clientes/inactivos')
      } catch (err) {
        console.error('Error al activar cliente: ', err);
        setError('Error al activar el cliente.');
      }
    }
  };

  if (error) return <Container><p>{error}</p><Button onClick={() => navigate('/clientes')}>Volver</Button></Container>;
  if (!cliente) return <Container><p>Cargando...</p></Container>;

  return (
    <div className="cliente-detalle-container">
      <div className="cliente-detalle-card">

        <h2 className="cliente-detalle-title">Detalles del Cliente</h2>

        {editando ? (
          <Form onSubmit={(e) => { e.preventDefault(); manejoGuardar(); }}>
            <Form.Group>
              <Form.Label className="cliente-detalle-label">Nombre</Form.Label>
              <Form.Control className="cliente-detalle-input" name="nombre" value={datosFormulario.nombre} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="cliente-detalle-label">Dirección</Form.Label>
              <Form.Control className="cliente-detalle-input" name="direccion" value={datosFormulario.direccion} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="cliente-detalle-label">Localidad</Form.Label>
              <Form.Control className="cliente-detalle-input" name="localidad" value={datosFormulario.localidad} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="cliente-detalle-label">IVA</Form.Label>
              <Form.Control className="cliente-detalle-input" name="iva" value={datosFormulario.iva} onChange={manejoCambio} required />
            </Form.Group>
            <Form.Group>
              <Form.Label className="cliente-detalle-label">CUIT</Form.Label>
              <Form.Control className="cliente-detalle-input" name="cuit" value={datosFormulario.cuit} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" onClick={manejoGuardar}>Guardar</Button>{' '}
            <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
          </Form>
        ) : (
          <>
            <div className="cliente-detalle-info">
              <p><strong>ID:</strong> {cliente.id}</p>
              <p><strong>Nombre:</strong> {cliente.nombre}</p>
              <p><strong>Dirección:</strong> {cliente.direccion}</p>
              <p><strong>Localidad:</strong> {cliente.localidad}</p>
              <p><strong>IVA:</strong> {cliente.iva}</p>
              <p><strong>CUIT:</strong> {cliente.cuit}</p>
              <p><strong>Activo:</strong> {cliente.activo ? 'Sí' : 'No'}</p>
            </div>
          </>
        )}
      </div>
      <Button className="btn-editar" onClick={() => setEditando(true)}>Editar</Button>
      {cliente.activo ? (
        <Button variant="danger" className="btn-desactivar" onClick={manejoDesactivar}>Desactivar</Button>
      ) : (
        <Button variant="success" className="btn-activar" onClick={manejoActivar}>Activar</Button>
      )}

      <Button className="btn-volver" onClick={() => navigate(cliente.activo ? '/clientes' : '/clientes/inactivos')}>
        Volver
      </Button>
    </div>
  );
};

export default ClienteDetalle;