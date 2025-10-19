import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';
import { obtenerExPropiedades } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ExPropiedades = () => {
  const [exPropiedades, setExPropiedades] = useState([]);
  const [exPropiedadesFiltradas, setExPropiedadesFiltradas] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarExPropiedades();
  }, []);

  const cargarExPropiedades = async () => {
    try {
      const respuesta = await obtenerExPropiedades();
      setExPropiedades(respuesta.data);
      setExPropiedadesFiltradas(respuesta.data)
    } catch (err) {
      console.error('Error al cargar ex propiedades', err);
    }
  };

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);
    const filtradas = exPropiedades.filter(exPropiedad => 
      exPropiedad.direccionPropiedad.toLowerCase().includes(termino) || exPropiedad.localidadPropiedad.toLowerCase().includes(termino)
    );
    setExPropiedadesFiltradas(filtradas);
  };

  const manejoVerDetalles = (id) => {
    navigate(`/propiedades/detalle/${id}`);
  };

  return (
    <div className="container mt-4">
      <h2>Propiedades Inactivas</h2>
      <InputGroup className="mb-3">
        <Form.Control
          placeholder="Buscar por dirección o localidad"
          value={busqueda}
          onChange={manejoBusqueda}
        />
      </InputGroup>
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
          {exPropiedadesFiltradas.map((propiedad) => (
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
    </div>
  );
};

export default ExPropiedades;