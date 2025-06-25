// src/pages/ficha_equipa.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import styles from '../styles/ficha_prova.module.css';

export default function FichaEquipa() {
  const navigate = useNavigate();
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  const modo = params.get('modo') || 'adicionar';
  const idParam = params.get('id') || '';
  const [successMessage, setSuccessMessage] = useState('');
  const [utilizadores, setUtilizadores] = useState([]);

  const [form, setForm] = useState({
    id: idParam,
    nome: '',
    email: '',
    telefone: '',
    cidade: '',
    gestor_id: ''
  });

  const tituloMap = {
    adicionar: 'Adicionar Equipa',
    editar: 'Editar Equipa',
    ver: 'Ficha da Equipa',
  };
  const titulo = tituloMap[modo] || 'Ficha da Equipa';
  const submitLabel = modo === 'editar' ? 'Guardar Alterações' : 'Adicionar';
  const readOnly = modo === 'ver';

  // Carrega utilizadores para o dropdown do gestor
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/utilizadores/gestores/')
      .then(res => res.json())
      .then(data => setUtilizadores(data));
  }, []);

  // Carrega equipa se modo for editar ou ver
  useEffect(() => {
    if ((modo === 'editar' || modo === 'ver') && idParam) {
      fetch(`http://127.0.0.1:8000/api/equipas/${idParam}`)
        .then(res => res.json())
        .then(data => {
          setForm({
            id: data.id,
            nome: data.nome,
            email: data.email,
            telefone: data.telefone || '',
            cidade: data.cidade,
            gestor_id: data.gestor?.id || ''
          });
        });
    }
  }, [modo, idParam]);

  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();

    const isEditar = modo === 'editar';
    const url = isEditar
      ? `http://127.0.0.1:8000/api/equipas/${form.id}/`
      : 'http://127.0.0.1:8000/api/equipas/create/';
    const method = isEditar ? 'PUT' : 'POST';

    const payload = {
      nome: form.nome,
      email: form.email,
      telefone: form.telefone,
      cidade: form.cidade,
      gestor_id: form.gestor_id || null
    };

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error('Erro:', detail);
        throw new Error('Erro ao guardar equipa');
      }
      if (!form.gestor_id) {
        alert('Por favor selecione um gestor.');
        return;
      }


      setSuccessMessage('Equipa guardada com sucesso!');
      setTimeout(() => {
        navigate('/equipas', { replace: true });
      }, 2000);
    } catch (err) {
      alert(err.message);
    }
  };

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
          <div className={styles.formEquipa}>
            <h2 id="titulo-ficha">{titulo}</h2>
            <form autoComplete="off" id="formEquipa" onSubmit={handleSubmit}>
              {modo !== 'adicionar' && (
                <div className={styles.formGroup}>
                  <label>ID</label>
                  <input type="text" name="id" value={form.id} readOnly />
                </div>
              )}

              <div className={styles.formGroup}>
                <label>Nome da Equipa</label>
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
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  readOnly={readOnly}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Telefone</label>
                <input
                  type="text"
                  name="telefone"
                  value={form.telefone}
                  onChange={handleChange}
                  readOnly={readOnly}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Cidade</label>
                <input
                  type="text"
                  name="cidade"
                  value={form.cidade}
                  onChange={handleChange}
                  required
                  readOnly={readOnly}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Gestor</label>
                <select
                  name="gestor_id"
                  value={form.gestor_id}
                  onChange={handleChange}
                  disabled={readOnly}
                  required  // obrigatório
                >
                  <option value="">-- Selecione o gestor --</option>
                  {utilizadores.map(u => (
                    <option key={u.id} value={u.id}>
                      {u.first_name} {u.last_name}
                    </option>
                  ))}
                </select>
              </div>

              {!readOnly && (
                <div className="btn-row" id="btnRow">
                  <button type="submit" className="btn" id="btnSubmeter">
                    {submitLabel}
                  </button>
                  <Link to="/equipas" className="btn" style={{ background: '#666' }}>
                    Voltar
                  </Link>
                </div>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
