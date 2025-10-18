import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Form } from 'react-bootstrap';
import { obtenerClientePorId, actualizarCliente, desactivarCliente, activarCliente } from '../services/api';

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
    <Container className="mt-4">
      <h2>Detalles del Cliente</h2>
      {editando ? (
        <Form onSubmit={(e) => { e.preventDefault(); manejoGuardar(); }}>
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
          <Button variant="primary" onClick={manejoGuardar}>Guardar</Button>{' '}
          <Button variant="secondary" onClick={() => setEditando(false)}>Cancelar</Button>
        </Form>
      ) : (
        <>
          <Row>
            <Col><strong>ID:</strong> {cliente.id}</Col>
          </Row>
          <Row>
            <Col><strong>Nombre:</strong> {cliente.nombre}</Col>
          </Row>
          <Row>
            <Col><strong>Dirección:</strong> {cliente.direccion}</Col>
          </Row>
          <Row>
            <Col><strong>IVA:</strong> {cliente.iva}</Col>
          </Row>
          <Row>
            <Col><strong>CUIT:</strong> {cliente.cuit}</Col>
          </Row>
          <Row>
            <Col><strong>Localidad:</strong> {cliente.localidad}</Col>
          </Row>
          <Row>
            <Col><strong>Activo:</strong> {cliente.activo ? 'Sí' : 'No'}</Col>
          </Row>
          <Button variant="info" onClick={() => setEditando(true)} className="mt-3">Editar</Button>{' '}
          {cliente.activo ? (
            <Button variant="danger" onClick={manejoDesactivar} className="mt-3">Desactivar</Button>
          ) : (
            <Button variant="success" onClick={manejoActivar} className="mt-3">Activar</Button>
          )}{' '}
          {cliente.activo ? (
            <Button variant="secondary" onClick={() => navigate('/clientes')} className="mt-3">Volver</Button>
          ) : (
            <Button variant="secondary" onClick={() => navigate('/clientes/inactivos')} className="mt-3">Volver</Button>
          )}
          {/*<Button variant="secondary" onClick={() => navigate('/clientes')} className="mt-3">Volver</Button>*/}
        </>
      )}
    </Container>
  );
};

export default ClienteDetalle;