//src/pages/validar_utilizadores.jsx
import React, { useEffect, useState } from 'react';

export default function ValidarUtilizadores() {
  const [utilizadores, setUtilizadores] = useState([]);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/utilizadores/')
      .then(res => res.json())
      .then(setUtilizadores)
      .catch(err => console.error('Erro ao buscar utilizadores:', err));
  }, []);

  const handleChange = (id, field, value) => {
    setUtilizadores(users =>
      users.map(u => (u.id === id ? { ...u, [field]: value } : u))
    );
  };

  const handleSave = async (user) => {
    const payload = {
      tipo: user.tipo,
      is_active: user.is_active,
    };

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/utilizadores/${user.id}/`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error('Erro ao guardar utilizador');
      setSuccessMsg('Utilizador atualizado com sucesso!');
      setTimeout(() => setSuccessMsg(''), 3000);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2><i className="fas fa-users-cog"></i> Validação de Utilizadores</h2>
      {successMsg && <div style={{ color: 'green', marginBottom: '10px' }}>{successMsg}</div>}
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #ccc' }}>
            <th>Nome</th>
            <th>Email</th>
            <th>Tipo</th>
            <th>Ativo</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          {utilizadores.map(u => (
            <tr key={u.id} style={{ borderBottom: '1px solid #eee' }}>
              <td>{u.first_name} {u.last_name}</td>
              <td>{u.email}</td>
              <td>
                <select value={u.tipo} onChange={e => handleChange(u.id, 'tipo', e.target.value)}>
                  <option value="gestor-equipas">Gestor de Equipas</option>
                  <option value="ciclista">Ciclista</option>
                  <option value="gestor-provas">Gestor de Provas</option>
                </select>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={u.is_active}
                  onChange={e => handleChange(u.id, 'is_active', e.target.checked)}
                />
              </td>
              <td>
                <button onClick={() => handleSave(u)} className="btn">
                  Guardar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
