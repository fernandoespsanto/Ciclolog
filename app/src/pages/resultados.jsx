// src/pages/resultados.jsx
import React, { useEffect, useState } from 'react';

export default function Resultados() {
  const [provas, setProvas] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [resultados, setResultados] = useState([]);

  const [provaSelecionada, setProvaSelecionada] = useState('');
  const [etapaSelecionada, setEtapaSelecionada] = useState('');

  // Carregar provas
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/prova/')
      .then(res => res.json())
      .then(setProvas);
  }, []);

  // Carregar etapas da prova selecionada
  useEffect(() => {
    if (provaSelecionada) {
      fetch(`http://127.0.0.1:8000/api/etapas/?prova=${provaSelecionada}`)
        .then(res => res.json())
        .then(setEtapas);
    } else {
      setEtapas([]);
    }
  }, [provaSelecionada]);

  // Carregar resultados da etapa
  useEffect(() => {
    if (etapaSelecionada) {
      fetch(`http://127.0.0.1:8000/api/resultados/?etapa=${etapaSelecionada}`)
        .then(res => res.json())
        .then(setResultados)
        .catch(err => console.error("Erro ao buscar resultados:", err));
    } else {
      setResultados([]);
    }
  }, [etapaSelecionada]);

  return (
    <div className="container">
      <h2><i className="fas fa-chart-bar"></i> Resultados por Etapa</h2>

      <div className="form-group">
        <label>Prova</label>
        <select value={provaSelecionada} onChange={e => setProvaSelecionada(e.target.value)}>
          <option value="">-- Escolher Prova --</option>
          {provas.map(p => (
            <option key={p.id} value={p.id}>{p.nome}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label>Etapa</label>
        <select value={etapaSelecionada} onChange={e => setEtapaSelecionada(e.target.value)}>
          <option value="">-- Escolher Etapa --</option>
          {etapas.map(e => (
            <option key={e.id} value={e.id}>Etapa {e.id}: {e.partida} → {e.chegada}</option>
          ))}
        </select>
      </div>

      {resultados.length > 0 ? (
    <table className="resultados-table" style={{ marginTop: '2rem', width: '100%' }}>
    <thead>
        <tr>
        <th>#</th>
        <th>Equipa</th>
        <th>Ciclista</th>
        <th>Tempo</th>
        <th>Lugar</th>
        <th>Desclassificado</th>
        <th>Desistência</th>
        <th>Notas</th>
        </tr>
    </thead>
    <tbody>
        {resultados.map(r => (
        <tr key={r.id}>
            <td>{r.id}</td>
            <td>{r.equipa_nome}</td>
            <td>{r.ciclista_nome}</td>
            <td>{r.tempo}</td>
            <td>{r.lugar}</td>
            <td>{r.desclassifica ? 'Sim' : 'Não'}</td>
            <td>{r.desiste ? 'Sim' : 'Não'}</td>
            <td>{r.notas}</td>
        </tr>
        ))}
    </tbody>
    </table>

      ) : etapaSelecionada ? (
        <p style={{ marginTop: '1rem' }}>Sem resultados para esta etapa.</p>
      ) : null}
    </div>
  );
}
