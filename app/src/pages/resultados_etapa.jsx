//src/pages/resultados_etapa.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../styles/resultados_etapa.module.css';

export default function ResultadosEtapa() {
  const navigate = useNavigate();
  const [provas, setProvas] = useState([]);
  const [etapas, setEtapas] = useState([]);
  const [equipas, setEquipas] = useState([]);
  const [provaSelecionada, setProvaSelecionada] = useState('');
  const [etapaSelecionada, setEtapaSelecionada] = useState('');
  const [linhas, setLinhas] = useState([]);

  // Carrega provas
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/prova/')
      .then(res => res.json())
      .then(setProvas);
  }, []);

  // Carrega equipas
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/equipas/')
      .then(res => res.json())
      .then(setEquipas);
  }, []);

  // Carrega etapas da prova selecionada
  useEffect(() => {
    if (provaSelecionada) {
      fetch(`http://127.0.0.1:8000/api/etapas/?prova=${provaSelecionada}`)
        .then(res => res.json())
        .then(setEtapas);
    } else {
      setEtapas([]);
    }
  }, [provaSelecionada]);

  const handleAdicionarLinha = () => {
    setLinhas(prev => [
      ...prev,
      {
        id: prev.length + 1,
        equipaId: '',
        equipaNome: '',
        ciclistaId: '',
        ciclistasDisponiveis: [],
        tempo: '',
        desclassifica: false,
        desiste: false,
        notas: '',
        mesmoTempo: false,
      },
    ]);
  };
  const eliminarLinha = (index) => {
    setLinhas(prev => {
      const novas = [...prev];
      novas.splice(index, 1); // remove a linha
      // atualiza os IDs visuais
      return novas.map((linha, i) => ({ ...linha, id: i + 1 }));
    });
  };

  const handleCarregarCiclistasEquipa = async () => {
    const nomeEquipa = prompt('Nome da equipa que deseja carregar:');
    if (!nomeEquipa) return;

    const equipaEncontrada = equipas.find(eq => eq.nome.toLowerCase() === nomeEquipa.toLowerCase());
    if (!equipaEncontrada) {
      alert('Equipa não encontrada.');
      return;
    }

    const equipaId = equipaEncontrada.id;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ciclista/por-equipa/?equipa=${equipaId}`);
      const data = await res.json();

      const novasLinhas = data.map((c, index) => ({
        id: linhas.length + index + 1,
        equipaId: equipaId,
        equipaNome: equipaEncontrada.nome,
        ciclistaId: c.id,
        ciclistasDisponiveis: [c],
        tempo: '',
        desclassifica: false,
        desiste: false,
        notas: '',
        mesmoTempo: false,
      }));

      setLinhas(prev => [...prev, ...novasLinhas]);
    } catch (err) {
      alert('Erro ao carregar ciclistas da equipa');
      console.error(err);
    }
  };


  const handleLinhaChange = (index, field, value) => {
    setLinhas(prev =>
      prev.map((linha, i) =>
        i === index ? { ...linha, [field]: value } : linha
      )
    );
  };

  const handleMesmoTempo = (index) => {
    if (index === 0) return;
    const tempoAnterior = linhas[index - 1].tempo;
    handleLinhaChange(index, 'tempo', tempoAnterior);
  };

  const handleEliminarTodas = () => {
    const confirmar = window.confirm('Tem a certeza que deseja eliminar todas as linhas?');
    if (confirmar) setLinhas([]);
  };

  const handleSubmit = async () => {
    for (const l of linhas) {
      const payload = {
        etapa: parseInt(etapaSelecionada),
        ciclista: l.ciclistaId,
        tempo: l.tempo,
        lugar: l.id,
        desclassifica: l.desclassifica,
        desiste: l.desiste,
        notas: l.notas || '',
      };

      if (!l.tempo || !/^\d{2}:\d{2}:\d{2}$/.test(l.tempo)) {
        alert(`Tempo inválido na linha ${l.id}. Use o formato HH:MM:SS`);
        return;
      }

      if (!etapaSelecionada || isNaN(parseInt(etapaSelecionada))) {
        alert("Etapa não selecionada corretamente.");
        return;
      }
      console.log("Gravando payload:", payload);

      const res = await fetch('http://127.0.0.1:8000/api/resultados/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        alert(`Erro ao gravar resultado da linha ${l.id}`);
        return;
      }
    }

    alert('Resultados inseridos com sucesso!');
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <h2><i className="fas fa-trophy"></i> Inserir Resultados da Etapa</h2>

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
            <option key={e.id} value={e.id}>
              Etapa {e.id}: {e.partida} → {e.chegada}
            </option>
          ))}
        </select>
      </div>

      <div className="form-group" style={{ marginTop: '1rem' }}>
        <button className="btn" onClick={handleAdicionarLinha}>
          <i className="fas fa-user-plus"></i> Adicionar Ciclista Manualmente
        </button>

        <button className="btn" style={{ marginLeft: '10px' }} onClick={handleCarregarCiclistasEquipa}>
          <i className="fas fa-search"></i> Carregar Ciclistas de Equipa
        </button>

        <button
          className="btn"
          style={{ marginLeft: '10px', backgroundColor: '#d9534f', color: '#fff' }}
          onClick={handleEliminarTodas}
        >
          <i className="fas fa-trash"></i> Eliminar Todas as Linhas
        </button>
      </div>


      <table className={styles.resultadosTable}>
        <thead>
          <tr>
            <th>#</th>
            <th>Equipa</th>
            <th>Ciclista</th>
            <th>Tempo</th>
            <th>Desclassificado</th>
            <th>Desistência</th>
            <th>Notas</th>
            <th>Mesmo Tempo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {linhas.map((linha, i) => (
            <tr key={i}>
              <td>{linha.id}</td>

              <td>
                <select
                  value={linha.equipaId}
                  onChange={async e => {
                    const equipaId = e.target.value;
                    const equipaNome = e.target.options[e.target.selectedIndex].text;

                    let ciclistas = [];
                    try {
                      const res = await fetch(`http://127.0.0.1:8000/api/ciclista/por-equipa/?equipa=${equipaId}`);
                      ciclistas = await res.json();
                    } catch (err) {
                      alert('Erro ao carregar ciclistas da equipa.');
                    }

                    handleLinhaChange(i, 'equipaId', equipaId);
                    handleLinhaChange(i, 'equipaNome', equipaNome);
                    handleLinhaChange(i, 'ciclistasDisponiveis', ciclistas);
                    handleLinhaChange(i, 'ciclistaId', '');
                  }}
                >
                  <option value="">-- Equipa --</option>
                  {equipas.map(eq => (
                    <option key={eq.id} value={eq.id}>{eq.nome}</option>
                  ))}
                </select>
              </td>

              <td>
                <select
                  value={linha.ciclistaId}
                  onChange={e => handleLinhaChange(i, 'ciclistaId', e.target.value)}
                >
                  <option value="">-- Ciclista --</option>
                  {linha.ciclistasDisponiveis.map(c => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </td>

              <td><input value={linha.tempo} onChange={e => handleLinhaChange(i, 'tempo', e.target.value)} /></td>
              <td><input type="checkbox" checked={linha.desclassifica} onChange={e => handleLinhaChange(i, 'desclassifica', e.target.checked)} /></td>
              <td><input type="checkbox" checked={linha.desiste} onChange={e => handleLinhaChange(i, 'desiste', e.target.checked)} /></td>
              <td><input value={linha.notas} onChange={e => handleLinhaChange(i, 'notas', e.target.value)} /></td>
              <td>
                <input
                  type="checkbox"
                  onChange={() => handleMesmoTempo(i)}
                />
              </td>
              <td>
                <button onClick={() => eliminarLinha(i)} title="Eliminar" className="btn-icon">
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="btn-row" style={{ marginTop: '2rem' }}>
        <button onClick={handleSubmit} className="btn">
          <i className="fas fa-save"></i> Gravar Resultados
        </button>
        <button onClick={() => navigate('/dashboard')} className="btn" style={{ background: '#777' }}>
          <i className="fas fa-times"></i> Cancelar
        </button>
      </div>
    </div>
  );
}
