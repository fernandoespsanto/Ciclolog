// src/pages/ciclista.jsx
import React, { useEffect, useState } from 'react';
import styles from '../styles/ciclista.module.css';
import { Link, useNavigate } from 'react-router-dom';

export default function Ciclista() {
  const [termoPesquisa, setTermoPesquisa] = useState('');
  const [ciclistas, setCiclistas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState('');
  const isAdmin = localStorage.getItem('ciclolog_is_admin') === '1';
  const tipo = localStorage.getItem('ciclolog_user_tipo') || '';

  useEffect(() => {
    const nome = localStorage.getItem('ciclolog_user_name') || '';
    setUserName(nome);

    fetch('http://127.0.0.1:8000/api/ciclista/')
      .then(res => res.json())
      .then(data => {
        setCiclistas(data);
        setLoading(false); // ← falta esta linha para parar o loading
      })
      .catch(err => {
        console.error('Erro ao carregar ciclistas:', err);
        setLoading(false);
      });
  }, []);


  const eliminarCiclista = async (id) => {
    if (!id) return;

    const confirm = window.confirm('Tem a certeza que deseja eliminar este ciclista?');
    if (!confirm) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/ciclista/${id}/`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error('Erro ao eliminar ciclista:', errorText);
        alert('Erro ao eliminar ciclista');
        return;
      }

      // Atualiza lista após remoção
      setCiclistas(prev => prev.filter(c => c.id !== id));
      alert('Ciclista eliminado com sucesso!');
    } catch (err) {
      alert('Erro de rede: ' + err.message);
    }
  };
    const filteredCiclistas = ciclistas.filter(c =>
    c.nome.toLowerCase().includes(termoPesquisa.toLowerCase())
  );

  if (loading) return <p>A carregar ciclistas...</p>;

  return (
    <div className={styles.App}>
      <header>
        <div className="header-content">
          <div className="logo">
            <img src="logo-ciclolog.png" alt="Logo" />
            <span>CICLOLOG</span>
          </div>
          <div className="user-menu">
            <span>Bem-vindo, <b>{userName}</b></span>
            <button onClick={() => {
              localStorage.clear();
              navigate('/login', { replace: true });
            }} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}>
              <i className="fas fa-sign-out-alt"></i> Sair
            </button>
          </div>
        </div>
      </header>
      <aside className="sidebar">
        <nav>
          <ul>
            <li><Link to="/dashboard" className="active"><i className="fas fa-home"></i>Dashboard</Link></li>
            {(isAdmin || tipo === 'gestor-provas') && (
              <>
                <li><Link to="/prova"><i className="fas fa-flag-checkered"></i>Provas</Link></li>
              </>
            )}
            {(isAdmin ) && (
              <>
                <li><Link to="/equipas"><i className="fas fa-users"></i>Equipas</Link></li>
              </>
            )}
            {(isAdmin || tipo === 'gestor-equipas') && (
              <>
                <li><Link to="/ciclista"><i className="fas fa-user"></i>Ciclistas</Link></li>
              </>
            )}
            <li><Link to="/resultados"><i className="fas fa-chart-bar"></i>Resultados</Link></li>
          </ul>
        </nav>
      </aside>

      <main>
        <h2 className="page-title"><i className="fas fa-user"></i> Ciclistas</h2>
        <div className="actions-bar">
          <Link to="/ficha_ciclista?modo=adicionar" className="btn">
            <i className="fas fa-plus"></i> Adicionar Novo Ciclista
          </Link>
          <input type="text" placeholder="Pesquisar ciclista..." className="search-input" 
            value={termoPesquisa}
            onChange={e => setTermoPesquisa(e.target.value)}
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Clube</th>
                <th>Email</th>
                <th>Categoria</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredCiclistas.map(c => (
                <tr key={c.id}>
                  <td>{c.id}</td>
                  <td>{c.nome}</td>
                  <td>{c.equipa_nome || '-'}</td>
                  <td>{c.email}</td>
                  <td>{c.grade}</td>
                  <td className="actions">
                    <Link to={`/ficha_ciclista?modo=ver&id=${c.id}`} title="Ver"><i className="fas fa-eye"></i></Link>
                    <Link to={`/ficha_ciclista?modo=editar&id=${c.id}`} title="Editar"><i className="fas fa-edit"></i></Link>
                    <button onClick={() => eliminarCiclista(c.id)} title="Eliminar" className="btn-icon">
                      <i className="fas fa-trash"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      <footer>
        <div className="container" style={{ textAlign: 'center', fontSize: '1rem' }}>
          &copy; 2025 Ciclolog. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}
