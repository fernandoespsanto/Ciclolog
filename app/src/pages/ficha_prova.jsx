// src/pages/ficha_prova.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from '../styles/ficha_prova.module.css';

export default function ProvaForm() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const modo = params.get('modo') || 'adicionar'; // adicionar | editar | ver
  const idParam = params.get('id') || '';
  const [successMessage, setSuccessMessage] = useState('');

  // form state
  const [form, setForm] = useState({
    id: idParam,
    nome: '',
    local: '',
    data_inicio: '',
    data_fim: '',
    noetapas: 1,
  });

  // etapas inputs state
  const [etapasInputs, setEtapasInputs] = useState([]);
  const [etapasData, setEtapasData] = useState([]);

  // load existing prova if editar/ver
  useEffect(() => {
    if ((modo === 'editar' || modo === 'ver') && idParam) {
      fetch(`http://127.0.0.1:8000/api/prova/${idParam}/`)
        .then(res => res.json())
        .then(data => {
          setForm({
            id: data.id,
            nome: data.nome,
            local: data.local,
            data_inicio: data.data_inicio,
            data_fim: data.data_fim,
            noetapas: data.noetapas,
          });
          // if has etapas, populate etapasData
          setEtapasData(data.etapas || []);
        });
    }
  }, [modo, idParam]);

  // update document title and button label
  const tituloMap = {
    adicionar: 'Adicionar Prova',
    editar:    'Editar Prova',
    ver:       'Ficha da Prova',
  };
  const titulo = tituloMap[modo] || 'Ficha da Prova';
  const submitLabel = modo === 'editar' ? 'Guardar Alterações' : 'Adicionar';

  // handle form change
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    if (name === 'noetapas') {
      const n = parseInt(value, 10) || 0;
      // generate empty etapasInputs
      setEtapasInputs(Array.from({ length: n }, (_, i) => i + 1));
      // reset etapasData
      setEtapasData([]);
    }
  };

  // handle etapas field change
  const handleEtapaChange = (idx, field, value) => {
    setEtapasData(ed => {
      const copy = [...ed];
      copy[idx] = { ...copy[idx], [field]: value };
      return copy;
    });
  };

  const confirmarEliminacao = nome => window.confirm(
    `Tem a certeza que deseja eliminar a prova "${nome}"? Esta ação não pode ser revertida.`
  );

  const handleSubmit = async e => {
  e.preventDefault();

  const isEditar = modo === 'editar';

  // URLs separados
  const provaUrl = isEditar
    ? `http://127.0.0.1:8000/api/prova/${form.id}/`
    : 'http://127.0.0.1:8000/api/prova/create/';
  const provaMethod = isEditar ? 'PUT' : 'POST';

  const provaPayload = {
    nome: form.nome,
    local: form.local,
    data_inicio: form.data_inicio,
    data_fim: form.data_fim,
    noetapas: form.noetapas,
  };

  try {
    // 1. Envia a prova
    const provaRes = await fetch(provaUrl, {
      method: provaMethod,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(provaPayload),
    });

    if (!provaRes.ok) {
      const errorDetail = await provaRes.text();
      console.error('Erro ao criar prova:', errorDetail);
      throw new Error('Erro ao salvar prova');
    }

    const provaData = await provaRes.json();
    const provaId = provaData.id;

    // 2. Envia cada etapa associada
    const etapaUrl = 'http://127.0.0.1:8000/api/etapa/create/';
    for (const etapa of etapasData) {
      const etapaPayload = {
        prova: provaId,
        partida: etapa.partida,
        chegada: etapa.chegada,
        data: etapa.data,
        distancia: etapa.distancia,
      };

      const etapaRes = await fetch(etapaUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(etapaPayload),
      });

      if (!etapaRes.ok) {
        const etapaErr = await etapaRes.text();
        console.error('Erro ao criar etapa:', etapaErr);
        throw new Error('Erro ao salvar etapas');
      }
    }

    // Tudo correu bem
  setSuccessMessage('Prova e etapas guardadas com sucesso!');

  setTimeout(() => {
    navigate('/prova', { replace: true });
  }, 2000); // espera 2 segundos para redirecionar


  } catch (err) {
    alert(err.message);
  }
};

  // read-only?
  const readOnly = modo === 'ver';

  return (
    <div className="page-title">
      {successMessage && (
        <div style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: '#28a745',
          color: '#fff',
          padding: '12px 20px',
          borderRadius: '4px',
          boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
          zIndex: 9999
        }}>
          <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
          {successMessage}
        </div>
      )}

      <main>
        <div className={styles.container}>
          <div className={styles.formProva}>
            <h2 id="titulo-ficha">{titulo}</h2>
            <form autoComplete="off" id="formProva" onSubmit={handleSubmit}>
              {modo !== 'adicionar' && (
                <div className={styles.formGroup}>
                  <label>ID</label>
                  <input type="text" name="id" value={form.id} readOnly />
                </div>
              )}
              <div className={styles.formGroup}>
                <label>Nome da Prova</label>
                <input
                  type="text"
                  name="nome"
                  value={form.nome}
                  onChange={handleChange}
                  required
                  readOnly={readOnly}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Local</label>
                <input
                  type="text"
                  name="local"
                  value={form.local}
                  onChange={handleChange}
                  required
                  readOnly={readOnly}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Data de Início</label>
                <input
                  type="date"
                  name="data_inicio"
                  value={form.data_inicio}
                  onChange={handleChange}
                  required
                  readOnly={readOnly}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Data de Fim</label>
                <input
                  type="date"
                  name="data_fim"
                  value={form.data_fim}
                  onChange={handleChange}
                  required
                  readOnly={readOnly}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Número de Etapas</label>
                <input
                  type="number"
                  name="noetapas"
                  value={form.noetapas}
                  onChange={handleChange}
                  min="1"
                  required
                  readOnly={readOnly}
                />
              </div>

              {!readOnly && (
                <div className="btn-row" id="btnRow">
                  <button type="submit" className="btn" id="btnSubmeter">
                    {submitLabel}
                  </button>
                  <Link to="/prova" className="btn" style={{ background: '#666' }}>
                    Voltar
                  </Link>
                </div>
              )}
            </form>
          </div>

          {/* Etapas panel */}
          {form.noetapas > 0 && !readOnly && (
            <div className={styles.etapaspanel} id="etapasPanel">
              <h4>Etapas da Prova</h4>
              <form id="formEtapas">
                {etapasInputs.map((etapaNum, i) => (
                  <div key={i} className={styles.etapaFormGroup}>
                    <strong>Etapa {etapaNum}</strong>
                    <input
                      type="text"
                      placeholder="Local de Partida"
                      value={etapasData[i]?.partida || ''}
                      onChange={e => handleEtapaChange(i, 'partida', e.target.value)}
                      required
                    />
                    <input
                      type="text"
                      placeholder="Local de Chegada"
                      value={etapasData[i]?.chegada || ''}
                      onChange={e => handleEtapaChange(i, 'chegada', e.target.value)}
                      required
                    />
                    <input
                      type="date"
                      value={etapasData[i]?.data || ''}
                      onChange={e => handleEtapaChange(i, 'data', e.target.value)}
                      required
                    />
                    <input
                      type="number"
                      placeholder="Distância (km)"
                      min="1"
                      value={etapasData[i]?.distancia || ''}
                      onChange={e => handleEtapaChange(i, 'distancia', e.target.value)}
                      required
                    />
                  </div>
                ))}
                {etapasInputs.length > 0 && (
                  <button type="button" className="btn" id="btnGuardarEtapas">
                    Guardar Etapas
                  </button>
                )}
              </form>

              {/* Tabela resumo apenas em ver/editar */}
              <table className="tabela-etapas" id="tabelaEtapas">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Partida</th>
                    <th>Chegada</th>
                    <th>Data</th>
                    <th>Distância (km)</th>
                  </tr>
                </thead>
                <tbody>
                  {etapasData.map((e, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{e.partida}</td>
                      <td>{e.chegada}</td>
                      <td>{e.data}</td>
                      <td>{e.distancia}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
