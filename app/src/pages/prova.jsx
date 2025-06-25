// src/pages/prova.jsx
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/prova.module.css';

export default function Prova() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('ciclolog_user_name') || '';
  const isAdmin = localStorage.getItem('ciclolog_is_admin') === '1';
  const tipo = localStorage.getItem('ciclolog_user_tipo') || '';

  const [competitions, setCompetition] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // redireciona para login se não estiver autenticado
    if (!localStorage.getItem('ciclolog_logged_in')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const confirmarEliminacao = (nome) =>
    window.confirm(
      `Tem a certeza que deseja eliminar a prova "${nome}"? Esta ação não pode ser revertida.`
    );

    useEffect(() => {
        fetch('http://127.0.0.1:8000/api/prova/')
        .then((res) => {
            if (!res.ok) {
            throw new Error('Erro ao carregar provas');
            }
            return res.json();
        })
        .then((data) => {
            setCompetition(data); // ← define os dados reais vindos do backend
            setLoading(false);
        })
        .catch((error) => {
            console.error('Erro ao buscar provas:', error);
            setLoading(false);
        });
    }, []);

    if (loading) return <p>A carregar provas...</p>;
  return (
    <div className={styles.loginPage}>
      {/* Header */}
      <header>
        <div className="header-content">
          <div className="logo">
            <img src="/logo-ciclolog.png" alt="Logo" />
            <span>CICLOLOG</span>
          </div>
          <div className="user-menu">
            <span>
              Bem-vindo, <b>{userName}</b>
            </span>
            <button
              onClick={() => {
                localStorage.clear();
                navigate('/login', { replace: true });
              }}
              style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer' }}
            >
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

      {/* Main content */}
      <main>
        <h2 className="page-title"><i className="fas fa-users"></i> Provas</h2>

        <div className="actions-bar">
          <Link to="/ficha_prova/" className="btn">
            <i className="fas fa-plus"></i> Adicionar Nova Prova
          </Link>
          <input
            type="text"
            placeholder="Pesquisar prova..."
            className="search-input"
            onChange={(e) => {
              // implementar filtro mais tarde
            }}
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Local</th>
                <th>Data de Início</th>
                <th>Data de Fim</th>
                <th>Nº Etapas</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {competitions.map((p) => (
                <tr key={p.id}>
                  <td>{p.id}</td>
                  <td>{p.nome}</td>
                  <td>{p.local}</td>
                  <td>{p.data_inicio}</td>
                  <td>{p.data_fim}</td>
                  <td>{p.noetapas}</td>
                  <td className="actions">
                    <Link to={`/ficha_prova/?modo=ver&id=${p.id}`} title="Ver">
                      <i className="fas fa-eye"></i>
                    </Link>
                    <Link to={`/ficha_prova/?modo=editar&id=${p.id}`} title="Editar">
                      <i className="fas fa-edit"></i>
                    </Link>
                    <button
                      onClick={() => {
                        if (confirmarEliminacao(p.nome)) {
                          fetch(`http://127.0.0.1:8000/api/prova/${p.id}/`, {
                            method: 'DELETE',
                          })
                            .then(res => {
                              if (res.ok) {
                                setCompetition(prev => prev.filter(item => item.id !== p.id));
                              } else {
                                alert('Erro ao eliminar prova');
                              }
                            })
                            .catch(err => {
                              console.error('Erro ao eliminar prova:', err);
                              alert('Erro ao eliminar prova');
                            });
                        }
                      }}
                      title="Eliminar"
                      className="btn-icon"
                    >
                      <i className="fas fa-trash"></i>
                    </button>

                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Footer */}
      <footer>
        <div className="container" style={{ textAlign: 'center', fontSize: '1rem' }}>
          &copy; 2025 Ciclolog. Todos os direitos reservados.
        </div>
      </footer>
    </div>
  );
}