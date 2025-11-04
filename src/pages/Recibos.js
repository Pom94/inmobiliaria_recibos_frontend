import React, { useState, useEffect } from 'react';
import { Table, Button, Form, Modal, Row, Col, InputGroup } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { obtenerRecibos, obtenerRecibo, crearRecibo, eliminarRecibo, obtenerClientes, obtenerPropiedades } from '../services/api';
import './styles/Recibos.css';

const Recibos = () => {
  const [recibos, setRecibos] = useState([]);
  const [recibosFiltrados, setRecibosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [clientes, setClientes] = useState([]);
  const [propiedades, setPropiedades] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [datosFormulario, setDatosFormulario] = useState({
    clienteId: '',
    propiedadId: '',
    conceptos: [{ concepto: '', periodo: '', anio: '', importe: '' }],
    mediosPagos: [{ medioPago: '', importePago: '' }],
    pesos: ''
  });
  const navigate = useNavigate();
  const subtotal = datosFormulario.conceptos.reduce((total, item) => {
    const valor = parseFloat(item.importe) || 0; 
    return total + valor;
  }, 0);
  const total = datosFormulario.mediosPagos.reduce((total, item) => {
    const valor = parseFloat(item.importePago) || 0; 
    return total + valor;
  }, 0);

  useEffect(() => {
    cargarRecibos();
    cargarClientes();
    cargarPropiedades();
  }, []);

  const cargarRecibos = async () => {
    try {
      const respuesta = await obtenerRecibos();
      setRecibos(respuesta.data);
      setRecibosFiltrados(respuesta.data)
    } catch (err) {
      console.error('Error al cargar recibos', err);
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

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);

    const filtrados = recibos.filter((recibo) => {
      const cliente = clientes.find((c) => c.id === recibo.clienteId);
      const nombreCliente = cliente ? cliente.nombre.toLowerCase() : '';
      return nombreCliente.includes(termino);
    });

    setRecibosFiltrados(filtrados);
  };

  const manejoCambio = (e) => {
    setDatosFormulario({ ...datosFormulario, [e.target.name]: e.target.value });
  };

  const manejoCambioConcepto = (index, campo, valor) => {
    const nuevosConceptos = [...datosFormulario.conceptos];
    nuevosConceptos[index][campo] = valor;
    setDatosFormulario({ ...datosFormulario, conceptos: nuevosConceptos });

  };

  const agregarConcepto = () => {
    setDatosFormulario({
      ...datosFormulario,
      conceptos: [...datosFormulario.conceptos, { concepto: '', periodo: '', anio: '', importe: '' }]
    });
  };

  const eliminarConcepto = (index) => {
    setDatosFormulario({
      ...datosFormulario,
      conceptos: datosFormulario.conceptos.filter((_, i) => i !== index)
    });
  };

  const manejoCambioMedioPago = (index, campo, valor) => {
    const nuevosMediosPagos = [...datosFormulario.mediosPagos];
    nuevosMediosPagos[index][campo] = valor;
    setDatosFormulario({ ...datosFormulario, mediosPagos: nuevosMediosPagos });
  };

  const agregarMedioPago = () => {
    setDatosFormulario({
      ...datosFormulario,
      mediosPagos: [...datosFormulario.mediosPagos, { medioPago: '', importePago: '' }]
    });
  };

  const eliminarMedioPago = (index) => {
    setDatosFormulario({
      ...datosFormulario,
      mediosPagos: datosFormulario.mediosPagos.filter((_, i) => i !== index)
    });
  };

  const manejoEnvio = async (e) => {
    e.preventDefault();
    try {
      await crearRecibo({
        clienteId: parseInt(datosFormulario.clienteId),
        propiedadId: parseInt(datosFormulario.propiedadId),
        conceptos: datosFormulario.conceptos.map(c => ({
          ...c,
          importe: parseFloat(c.importe) || 0
        })),
        mediosPagos: datosFormulario.mediosPagos.map(m => ({
          ...m,
          importePago: parseFloat(m.importePago) || 0
        })),
        pesos: datosFormulario.pesos
      });
      cargarRecibos();
      setMostrarModal(false);
      setDatosFormulario({
        clienteId: '',
        propiedadId: '',
        conceptos: [{ concepto: '', periodo: '', anio: '', importe: '' }],
        mediosPagos: [{ medioPago: '', importePago: '' }],
        pesos: ''
      });
    } catch (err) {
      console.error('Error al crear recibo', err);
    }
  };

  const manejoVerDetalles = (numeroRecibo) => {
    navigate(`/recibos/detalle/${numeroRecibo}`);
  };

  const cerrarModal = () => {
    setMostrarModal(false);
    setDatosFormulario({
        clienteId: '',
        propiedadId: '',
        conceptos: [{ concepto: '', periodo: '', anio: '', importe: '' }],
        mediosPagos: [{ medioPago: '', importePago: '' }],
        pesos: ''
      });
  };


  return (
    <div className="contenedor-principal">
      <div className="recibos-container">
        <div className="recibos-header">
          <h2 className="recibos-title">Recibos</h2>
          <Button
            variant="primary"
            onClick={() => setMostrarModal(true)}
            className="boton-nuevo-recibo"
          >
            Nuevo Recibo
          </Button>
        </div>

        <InputGroup className="recibos-buscar">
          <Form.Control
            placeholder="Buscar por cliente"
            value={busqueda}
            onChange={manejoBusqueda}
          />
        </InputGroup>

        <div className="recibos-tabla-container">
          <Table borderless className="mb-0 recibos-tabla">
            <thead>
              <tr>
                <th>Nº Recibo</th>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Propiedad</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {recibosFiltrados.map((recibo) => (
                <tr key={recibo.numeroRecibo}>
                  <td>{recibo.numeroRecibo}</td>
                  <td>{new Date(recibo.fechaRecibo).toLocaleDateString()}</td>
                  <td>
                    {clientes.find((c) => c.id === recibo.clienteId)?.nombre || '—'}
                  </td>
                  <td>
                    {(() => {
                      const propiedad = propiedades.find((p) => p.id === recibo.propiedadId);
                      return propiedad ? `${propiedad.direccionPropiedad} - ${propiedad.localidadPropiedad}` : '—';
                    })()}
                  </td>
                  <td>
                    <Button
                      variant="outline-light"
                      size="sm"
                      onClick={() => manejoVerDetalles(recibo.numeroRecibo)}
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
      

      <Modal className="modal-recibos-container" show={mostrarModal} onHide={cerrarModal}>
        <Modal.Header closeButton className="modal-recibos-header">
          <Modal.Title>Crear Recibo</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-recibos-body">
          <Form onSubmit={manejoEnvio}>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Label>Cliente:</Form.Label>
                  <Form.Control as="select" name="clienteId" value={datosFormulario.clienteId} onChange={manejoCambio} required>
                    <option value="">Seleccionar</option>
                    {clientes.map((cliente) => (
                      <option key={cliente.id} value={cliente.id}>{cliente.nombre}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
              <Col>
                <Form.Group>
                  <Form.Label>Propiedad:</Form.Label>
                  <Form.Control as="select" name="propiedadId" value={datosFormulario.propiedadId} onChange={manejoCambio} required>
                    <option value="">Seleccionar</option>
                    {propiedades.map((propiedad) => (
                      <option key={propiedad.id} value={propiedad.id}>{[propiedad.direccionPropiedad, ', ', propiedad.localidadPropiedad]}</option>
                    ))}
                  </Form.Control>
                </Form.Group>
              </Col>
            </Row>

            <h5 className="mt-3">Conceptos</h5>
            {datosFormulario.conceptos.map((concepto, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    placeholder="Concepto"
                    value={concepto.concepto}
                    onChange={(e) => manejoCambioConcepto(index, 'concepto', e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Período"
                    value={concepto.periodo}
                    onChange={(e) => manejoCambioConcepto(index, 'periodo', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Año"
                    value={concepto.anio}
                    onChange={(e) => manejoCambioConcepto(index, 'anio', e.target.value)}
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Importe"
                    value={concepto.importe}
                    onChange={(e) => manejoCambioConcepto(index, 'importe', e.target.value)}
                    required
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="danger" onClick={() => eliminarConcepto(index)}>X</Button>
                </Col>
              </Row>
              

            ))}
            <Button variant="secondary" onClick={agregarConcepto}>Agregar Concepto</Button>
            <Row className="mt-3">
              <Col>
                <h5>Subtotal: ${subtotal.toLocaleString()}</h5>
              </Col>
            </Row>
            
            <h5 className="mt-3">Medios de Pago</h5>
            {datosFormulario.mediosPagos.map((medio, index) => (
              <Row key={index} className="mb-2">
                <Col>
                  <Form.Control
                    placeholder="Medio de Pago"
                    value={medio.medioPago}
                    onChange={(e) => manejoCambioMedioPago(index, 'medioPago', e.target.value)}
                    required
                  />
                </Col>
                <Col>
                  <Form.Control
                    type="number"
                    placeholder="Importe"
                    value={medio.importePago}
                    onChange={(e) => manejoCambioMedioPago(index, 'importePago', e.target.value)}
                    required
                  />
                </Col>
                <Col xs="auto">
                  <Button variant="danger" onClick={() => eliminarMedioPago(index)}>X</Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" onClick={agregarMedioPago}>Agregar Medio de Pago</Button>
            <Row className="mt-3">
              <Col>
                <h5>Total: ${total.toLocaleString()}</h5>
              </Col>
            </Row>

            <Form.Group className="mt-3">
              <Form.Label>Son Pesos</Form.Label>
              <Form.Control name="pesos" value={datosFormulario.pesos} onChange={manejoCambio} required />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3">Crear Recibo</Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Recibos;