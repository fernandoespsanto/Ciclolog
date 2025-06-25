//login.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styles from '../styles/login.module.css';
//import '../styles/login.css'; 

function Login() {
  const navigate = useNavigate();

  // estados de login
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState(false);

  // estados do modal admin
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminPass, setAdminPass] = useState('');
  const [adminError, setAdminError] = useState(false);
  const adminRef = useRef();

  useEffect(() => {
    if (adminModalOpen) {
      setAdminError(false);
      setAdminPass('');
      setTimeout(() => adminRef.current?.focus(), 100);
    }
  }, [adminModalOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(false);

    try {
      const res = await fetch('http://127.0.0.1:8000/api/utilizadores/');
      if (!res.ok) throw new Error('Erro ao buscar utilizadores');

      const users = await res.json();

      const user = users.find(u =>
        u.email === email &&
        u.password === password &&
        u.is_active === true
      );

      if (user) {
        localStorage.setItem('ciclolog_logged_in', '1');
        localStorage.setItem('ciclolog_user_name', user.first_name);
        localStorage.setItem('ciclolog_user_tipo', user.tipo);
        localStorage.removeItem('ciclolog_is_admin');
        localStorage.setItem('ciclolog_user_email', user.email);
        navigate('/dashboard', { replace: true });
      } else {
        setLoginError(true);
      }
    } catch (err) {
      console.error('Erro ao fazer login:', err);
      setLoginError(true);
    }
  };

  const handleAdminLogin = () => {
    if (adminPass === 'admin') {
      localStorage.setItem('ciclolog_logged_in', '1');
      localStorage.setItem('ciclolog_user_name', 'Administrador');
      localStorage.setItem('ciclolog_is_admin', '1');
      localStorage.setItem('ciclolog_user_tipo', 'admin');
      localStorage.setItem('ciclolog_user_email', 'email');
      setAdminModalOpen(false);
      navigate('/dashboard');
    } else {
      setAdminError(true);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <button
          className={styles.adminBtn}
          title="Acesso admin"
          onClick={() => setAdminModalOpen(true)}
        >
          <i className="fas fa-user-shield"></i>
        </button>
        <h5 style={{ color: '#2E7D32', textAlign: 'right' }}>Administrador</h5>
        <div className="login-card">
          <div className="logo">
            <img src="/logo-ciclolog.png" alt="Ciclolog Logo" />
          </div>
           <h1 className={styles.title}>Iniciar Sessão</h1>

          <form onSubmit={handleSubmit} className="login-form">
            <div className={styles.formGroup}>
              <label htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                autoComplete="username"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="password">Palavra-passe</label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            {loginError && <div className={styles.errorMessage}>Email ou palavra-passe inválidos.</div>}

            <button type="submit" className={styles.loginBtn}>Iniciar Sessão</button>
          </form>

          <div className="links">
            <Link to="/register">Ainda não tem conta? Registe-se aqui</Link>
            <Link to="/forgot-password">Esqueceu-se da palavra-passe?</Link>
            <Link to="/">Voltar à página inicial</Link>
          </div>
        </div>

        {adminModalOpen && (
          <div className={styles.modalBackdrop}>
            <div className={styles.modalContent}>
               <h3 style={{ color: '#2E7D32', marginBottom: 17 }}>Acesso de Administrador</h3>
              <input
                type="password"
                ref={adminRef}
                placeholder="Password admin"
                value={adminPass}
                onChange={e => setAdminPass(e.target.value)}
                onKeyUp={e => e.key === 'Enter' && handleAdminLogin()}
              />
              {adminError && <div className="error-message">Password incorreta!</div>}
              <div className={styles.modalButtonGroup}>
                <button onClick={handleAdminLogin} className={styles.modalBtn}>
                  <i className="fas fa-sign-in-alt"></i> Entrar
                </button>
                <button onClick={() => setAdminModalOpen(false)} className={styles.modalBtn}>
                  <i className="fas fa-times"></i> Cancelar
                </button>
              </div>

            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;