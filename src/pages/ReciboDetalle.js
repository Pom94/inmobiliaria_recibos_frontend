import React, { useState, useEffect} from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Button, Table } from 'react-bootstrap';
import { obtenerRecibo, obtenerRecibos, crearRecibo, eliminarRecibo, obtenerClientes, obtenerPropiedades} from '../services/api';
import './styles/ReciboDetalle.css';

const ReciboDetalle = () => {
  const { numeroRecibo } = useParams();
  console.log('ID del recibo:', numeroRecibo);
  const navigate = useNavigate();
  const [recibo, setRecibo] = useState(null);
  const [error, setError] = useState('');
  const [clientes, setClientes] = useState([]);
  const [propiedades, setPropiedades] = useState([]);

  useEffect(() => {
    cargarRecibo();
  }, [numeroRecibo]);

  useEffect(() => {
    cargarClientes();
    cargarPropiedades();
  }, []);

  const cargarRecibo = async () =>{
    try{
      const respuesta = await obtenerRecibo(numeroRecibo);
      setRecibo(respuesta.data);
    } catch (err) {
      console.error('Error al cargar detalles del recibo.', err);
      setError('No se pudo cargar el recibo. Verifica el numero de recibo o intenta de nuevo.');
    }
  };

  const cargarClientes = async () => {
      try {
        const respuesta = await obtenerClientes();
        setClientes(respuesta.data);
      } catch (err) {
        console.error('Error al cargar clientes', err);
      }
    };
  
    const cargarPropiedades = async () => {
      try {
        const respuesta = await obtenerPropiedades();
        setPropiedades(respuesta.data);
      } catch (err) {
        console.error('Error al cargar propiedades', err);
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

  const manejoEliminar = async () => {
    if (window.confirm('¿Eliminar recibo?')) {
      try {
        await eliminarRecibo(numeroRecibo);
        navigate('/recibos');
      } catch (err) {
        console.error('Error al eliminar recibo:', err);
        setError('Error al eliminar el recibo.');
      }
    }
  };
    
  if (error) return <Container><p>{error}</p><Button onClick={() => navigate('/recibos')}>Volver</Button></Container>;
  if (!recibo) return <Container><p>Cargando...</p></Container>;

  return(
    <div className="recibo-detalle-container">
      
      <div className="recibo-detalle-header">
        <h2>Recibo #{recibo.numeroRecibo}</h2>
        <span className="recibo-detalle-fecha">{formatearFecha(recibo.fechaRecibo)}</span>
      </div>

      {/* Cliente */}
      <section className="recibo-detalle-card">
        <h4>Cliente</h4>
        <div className="detalle-grid">
          <p><strong>Nombre:</strong> {clientes.find(c => c.id === recibo.clienteId)?.nombre}</p>
          <p><strong>C.U.I.T:</strong> {clientes.find(c => c.id === recibo.clienteId)?.cuit}</p>
          <p><strong>Dirección:</strong> {clientes.find(c => c.id === recibo.clienteId)?.direccion}</p>
          <p><strong>Localidad:</strong> {clientes.find(c => c.id === recibo.clienteId)?.localidad}</p>
          <p><strong>IVA:</strong> {clientes.find(c => c.id === recibo.clienteId)?.iva}</p>
        </div>
      </section>

      {/* Propiedad */}
      <section className="recibo-detalle-card">
        <h4>Propiedad</h4>
        <div className="detalle-grid">
          <p><strong>Contrato Nº:</strong> {propiedades.find(p => p.id === recibo.propiedadId)?.numContrato}</p>
          <p><strong>Inicio:</strong> {formatearFecha(propiedades.find(p => p.id === recibo.propiedadId)?.inicioContrato)}</p>
          <p><strong>Fin:</strong> {formatearFecha(propiedades.find(p => p.id === recibo.propiedadId)?.finContrato)}</p>
          <p><strong>Dirección:</strong> {propiedades.find(p => p.id === recibo.propiedadId)?.direccionPropiedad}</p>
          <p><strong>Localidad:</strong> {propiedades.find(p => p.id === recibo.propiedadId)?.localidadPropiedad}</p>
          <p><strong>Propietario:</strong> {propiedades.find(p => p.id === recibo.propiedadId)?.nombrePropietario}</p>
          <p><strong>C.U.I.T Propietario:</strong> {propiedades.find(p => p.id === recibo.propiedadId)?.cuitPropietario}</p>
        </div>
      </section>

      {/* Conceptos */}
      <section className="recibo-detalle-card">
        <h4>Conceptos</h4>
        <Table bordered className="tabla-detalle">
          <thead>
            <tr>
              <th>Concepto</th>
              <th>Periodo</th>
              <th>Año</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            {recibo.conceptos.map((c, i) => (
              <tr key={i}>
                <td>{c.concepto}</td>
                <td>{c.periodo}</td>
                <td>{c.anio}</td>
                <td>${c.importe}</td>
              </tr>
            ))}
            <tr className="subtotal-row">
              <td></td><td></td>
              <th>Subtotal:</th>
              <td>${recibo.subtotal}</td>
            </tr>
          </tbody>
        </Table>
      </section>

      {/* Medios de pago */}
      <section className="recibo-detalle-card">
        <h4>Medios de Pago</h4>
        <Table bordered className="tabla-detalle">
          <thead>
            <tr>
              <th>Medio de Pago</th>
              <th>Importe</th>
            </tr>
          </thead>
          <tbody>
            {recibo.mediosPagos.map((m, i) => (
              <tr key={i}>
                <td>{m.medioPago}</td>
                <td>${m.importePago}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </section>

      {/* Total */}
      <div className="recibo-total">
        <h4>Total: ${recibo.total}</h4>
        <p><strong>Son pesos:</strong> {recibo.pesos}</p>
      </div>

      {/* Botones */}
      <div className="recibo-detalle-actions">
        <Button variant="danger" onClick={manejoEliminar}>Eliminar</Button>
        <Button variant="secondary" onClick={() => navigate('/recibos')}>Volver</Button>
      </div>

    </div>
    /*
    <Container className="mt-4">
      <h2>Detalles de Recibo</h2>
      <Row>
            <Col><strong>Nº de Recibo: </strong> {recibo.numeroRecibo}</Col>
          </Row>
          <Row>
            <Col><strong>Fecha: </strong>{new Date(recibo.fechaRecibo).toLocaleDateString()}</Col>
          </Row>

          <Row>
            <Col><strong>Cliente: </strong> {clientes.find((c) => c.id === recibo.clienteId)?.nombre || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>C.U.I.T: </strong> {clientes.find((c) => c.id === recibo.clienteId)?.cuit || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Dirección: </strong> {clientes.find((c) => c.id === recibo.clienteId)?.direccion || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Localidad: </strong> {clientes.find((c) => c.id === recibo.clienteId)?.localidad || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>I.V.A: </strong> {clientes.find((c) => c.id === recibo.clienteId)?.iva || '—'}</Col>
          </Row>


          <Row>
            <Col><strong>Contrato Nº: </strong> {propiedades.find((p) => p.id === recibo.propiedadId)?.numContrato || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Inicio: </strong> {new Date(propiedades.find((p) => p.id === recibo.propiedadId)?.inicioContrato).toLocaleDateString() || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Fin: </strong> {new Date(propiedades.find((p) => p.id === recibo.propiedadId)?.finContrato).toLocaleDateString() || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Calle de la propiedad: </strong> {propiedades.find((p) => p.id === recibo.propiedadId)?.direccionPropiedad || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Localidad de la propiedad: </strong> {propiedades.find((p) => p.id === recibo.propiedadId)?.localidadPropiedad || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>Propietario: </strong> {propiedades.find((p) => p.id === recibo.propiedadId)?.nombrePropietario || '—'}</Col>
          </Row>
          <Row>
            <Col><strong>C.U.I.T: </strong> {propiedades.find((p) => p.id === recibo.propiedadId)?.cuitPropietario || '—'}</Col>
          </Row>


          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Concepto</th>
                <th>Periodo</th>
                <th>Año</th>
                <th>Importe</th>
              </tr>
            </thead>
            <tbody>
              {recibo.conceptos.map((concepto) => (
                <tr>
                  <td>{concepto.concepto}</td>
                  <td>{concepto.periodo}</td>
                  <td>{concepto.anio}</td>
                  <td>{concepto.importe}</td>
                </tr>                
              ))}
              <tr>
                <td></td>
                <td></td>
                <th>Subtotal:</th>
                <td>{recibo.subtotal}</td>
              </tr>
            </tbody>
          </Table>



          <Row>
            <Col><strong>Medios de Pago: </strong></Col>
          </Row>
          <Table striped bordered hover>
            <tbody>
              {recibo.mediosPagos.map((medioPago) => (
                <tr>
                  <td>{medioPago.medioPago}</td>
                  <td>{medioPago.importePago}</td>
                </tr>                
              ))}
            </tbody>
          </Table>

          <Row>
            <Col><strong>Total de Recibo: </strong> {recibo.total}</Col>
          </Row>
          <Row>
            <Col><strong>Son pesos: </strong> {recibo.pesos}</Col>
          </Row>

          <Button variant="danger" onClick={manejoEliminar} className="mt-3">Eliminar</Button>
          <Button variant="secondary" onClick={() => navigate('/recibos')} className="mt-3">Volver</Button>
    </Container>
    */
  );
};

export default ReciboDetalle;