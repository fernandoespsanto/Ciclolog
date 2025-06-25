// src/pages/dashboard.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import  '../styles/dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const userName = localStorage.getItem('ciclolog_user_name') || '';
  const [stats, setStats] = useState({
    ciclistas: 0,
    equipas: 0,
    provas: 0,
    resultados: 54  // valor fixo por enquanto
  });

  const tipo = localStorage.getItem('ciclolog_user_tipo') || '';
  const isAdmin = localStorage.getItem('ciclolog_is_admin') === '1';

  useEffect(() => {
    if (!localStorage.getItem('ciclolog_logged_in')) {
      navigate('/login', { replace: true });
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login', { replace: true });
  };

   useEffect(() => {
    fetch('http://127.0.0.1:8000/api/dashboard/stats/')
      .then(res => res.json())
      .then(data => {
        setStats({
          ciclistas: data.ciclistas,
          equipas: data.equipas,
          provas: data.provas,
          resultados: data.resultados,
        });
      })
      .catch(err => {
        console.error('Erro ao carregar estatísticas:', err);
      });
  }, []);

  const statItems = [
    { icon: 'fas fa-user', title: 'Ciclistas', value: stats.ciclistas },
    { icon: 'fas fa-users', title: 'Equipas', value: stats.equipas },
    { icon: 'fas fa-flag-checkered', title: 'Provas', value: stats.provas },
    { icon: 'fas fa-trophy', title: 'Resultados', value: stats.resultados },
  ];

  return (
    <div>
      <header>
        <div className="container header-content">
          <div className="logo">
            <img src="/logo-ciclolog.png" alt="Ciclolog Logo" />
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

      <main>
        <section className="welcome">
          <h2>Bem-vindo ao Painel de Gestão CICLOLOG</h2>
          <p>Aqui pode gerir ciclistas, equipas, provas, etapas e consultar resultados. Utilize o menu lateral para navegar pelas funcionalidades.</p>
        </section>

        <section className="stats-grid">
          {statItems.map((s,i) => (
            <div key={i} className="stat-card">
              <i className={s.icon}></i>
              <div className="stat-title">{s.title}</div>
              <div className="stat-value">{s.value}</div>
            </div>
          ))}
        </section>
        {tipo === 'admin' && (
          <div style={{ margin: '20px 0' }}>
            <Link to="/validar_utilizadores" className="btn">
              <i className="fas fa-user-check"></i> Validar Utilizadores
            </Link>
          </div>
        )}
        {(isAdmin || tipo === 'gestor-provas') && (
          <Link to="/resultados_etapa" className="btn" style={{ marginTop: '2rem' }}>
            <i className="fas fa-plus-circle"></i> Inserir Resultados
          </Link>
        )}

      </main>

      <footer>
        <div className="container">
          <div style={{ textAlign: 'center', fontSize: '1rem' }}>
            &copy; 2025 Ciclolog. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
}
