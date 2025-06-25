// src/pages/equipas.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/equipas.module.css';

export default function Equipas() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('ciclolog_user_name') || '';
  const isAdmin = localStorage.getItem('ciclolog_is_admin') === '1';
  const tipo = localStorage.getItem('ciclolog_user_tipo') || '';
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // 'success' ou 'error'

  useEffect(() => {
    // Se não estiver autenticado, vai para o login
    if (!localStorage.getItem('ciclolog_logged_in')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const confirmarEliminacao = (nome) => {
    return window.confirm(
      `Tem a certeza que deseja eliminar a equipa "${nome}"? Esta ação não pode ser revertida.`
    );
  };

useEffect(() => {
    fetch('http://127.0.0.1:8000/api/equipas/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Erro ao carregar equipas');
        }
        return res.json();
      })
      .then((data) => {
        setTeams(data); // ← define os dados reais vindos do backend
        setLoading(false);
      })
      .catch((error) => {
        console.error('Erro ao buscar equipas:', error);
        setLoading(false);
      });
  }, []);

  const handleDelete = async (id, nome) => {
    const confirmar = window.confirm(`Tem a certeza que deseja eliminar a equipa "${nome}"? Esta ação não pode ser revertida.`);
    if (!confirmar) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/equipas/${id}/`, {
        method: 'DELETE'
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || 'Erro ao eliminar equipa.');
      }

      setTeams(prev => prev.filter(team => team.id !== id));
      setMessage(`Equipa "${nome}" eliminada com sucesso.`);
      setMessageType('success');
    } catch (err) {
      setMessage(`Erro: ${err.message}`);
      setMessageType('error');
    }

    setTimeout(() => {
      setMessage('');
      setMessageType('');
    }, 3000);
  };



  if (loading) return <p>A carregar equipas...</p>;
  return (
    <div className={styles.loginPage}>
      {/* Header */}
      <header>
        <div className="header-content">
          <div className="logo">
            <img src="logo-ciclolog.png" alt="Logo" />
            <span>CICLOLOG</span>
          </div>
          <div className="user-menu">
            <span>Bem-vindo, <b>{userName}</b></span>
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
      
        {message && (
            <div style={{
              position: 'fixed',
              top: '20px',
              right: '20px',
              backgroundColor: messageType === 'success' ? '#28a745' : '#dc3545',
              color: '#fff',
              padding: '12px 20px',
              borderRadius: '4px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
              zIndex: 9999
            }}>
              <i className={`fas fa-${messageType === 'success' ? 'check-circle' : 'exclamation-circle'}`} style={{ marginRight: '8px' }}></i>
              {message}
            </div>
          )}

      {/* Main content */}
      <main>
        <h2 className="page-title"><i className="fas fa-users"></i> Equipas</h2>

        <div className="actions-bar">
            <Link to="/ficha_equipa?modo=adicionar" className="btn">
              <i className="fas fa-plus"></i> Adicionar Nova Equipa
            </Link>
          <input
            type="text"
            placeholder="Pesquisar equipa..."
            className="search-input"
            onChange={(e) => {
              /* implementar filtro, se quiseres */
            }}
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Telefone</th>
                <th>Cidade</th>
                <th>Gestor</th>
                <th>Ações</th>
              </tr>
            </thead>
          <tbody>
            {teams.map(team => (
              <tr key={team.id}>
                <td>{team.id}</td>
                <td>{team.nome}</td>
                <td>{team.email}</td>
                <td>{team.telefone}</td>
                <td>{team.cidade}</td>
                <td className="actions">
                  {/* Botão Ver */}
                  <Link to={`/ficha_equipa?modo=ver&id=${team.id}`} title="Ver">
                    <i className="fas fa-eye"></i>
                  </Link>

                  {/* Botão Editar */}
                  <Link to={`/ficha_equipa?modo=editar&id=${team.id}`} title="Editar">
                    <i className="fas fa-edit"></i>
                  </Link>

                  {/* Botão Eliminar */}
                  <button
                    onClick={() => handleDelete(team.id, team.nome)}
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
