import React, { useState, useEffect } from 'react';
import { Table, Button, InputGroup, Form } from 'react-bootstrap';
import { obtenerExContratos } from '../services/api';
import { useNavigate } from 'react-router-dom';
import './styles/ExContratos.css';

const ExContratos = () => {
  const [exContratos, setExContratos] = useState([]);
  const [exContratosFiltrados, setExContratosFiltrados] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    cargarExContratos();
  }, []);

  const cargarExContratos = async () => {
    try {
      const respuesta = await obtenerExContratos();
      setExContratos(respuesta.data);
      setExContratosFiltrados(respuesta.data)
    } catch (err) {
      console.error('Error al cargar contratos inactivos', err);
    }
  };

  const manejoBusqueda = (e) => {
    const termino = e.target.value.toLowerCase();
    setBusqueda(termino);
    const filtrados = exContratos.filter(exContrato => 
      exContrato.direccionPropiedad.toLowerCase().includes(termino) || exContrato.localidadPropiedad.toLowerCase().includes(termino)
    );
    setExContratosFiltrados(filtrados);
  };

  const manejoVerDetalles = (id) => {
    navigate(`/contratos/detalle/${id}`);
  };

  return (
    <div className="contenedor-principal">
      <div className="contratos-container">
        <div className="contratos-header">
          <h2 className="contratos-title">Contratos Inactivos</h2>
        </div>

        <InputGroup className="contratos-buscar">
          <Form.Control
            placeholder="Buscar por dirección o localidad"
            value={busqueda}
            onChange={manejoBusqueda}
          />
        </InputGroup>

        <div className="contratos-tabla-container">
          <Table borderless className="mb-0 contratos-tabla">
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
              {exContratosFiltrados.map((contrato) => (
                <tr key={contrato.id}>
                  <td>{contrato.id}</td>
                  <td>{contrato.numContrato}</td>
                  <td>{contrato.direccionPropiedad}</td>
                  <td>{contrato.localidadPropiedad}</td>
                  <td className='text-center'>
                    <Button 
                      variant="outline-light"
                      size='sm' 
                      onClick={() => manejoVerDetalles(contrato.id)}
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
      
      
    </div>
  );
};

export default ExContratos;