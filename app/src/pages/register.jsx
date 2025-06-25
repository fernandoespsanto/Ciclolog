//src/pages/register.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/register.css';

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    tipo: '',
    morada: '',
    datanasc: '',
    telefone: '',
    nodocident: ''
  });
  const [errors, setErrors] = useState({ tipo: false, register: '' });

  const handleChange = e => {
    const { id, value } = e.target;
    setForm(prev => ({ ...prev, [id]: value }));
    if (id === 'tipo') setErrors(prev => ({ ...prev, tipo: false }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setErrors({ tipo: false, register: '' });

    if (!form.tipo) {
      setErrors(prev => ({ ...prev, tipo: true }));
      return;
    }
    const payload = {
    ...form,
    username: form.email
    /*is_active: true */
  };

    try {
      console.log("Payload enviado:", payload);
      const response = await fetch('http://127.0.0.1:8000/api/utilizadores/create/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        // Registo criado com sucesso
        alert('Registo efetuado com sucesso!');
        navigate('/login');
      } else if (response.status === 400) {
        const data = await response.json();
        // Exibe o primeiro erro de validação encontrado
        const firstError = Object.values(data)[0];
        setErrors(prev => ({ ...prev, register: Array.isArray(firstError) ? firstError[0] : firstError }));
      } else {
        setErrors(prev => ({ ...prev, register: 'Erro inesperado. Tente novamente.' }));
      }
    } catch (err) {
      console.error(err);
      setErrors(prev => ({ ...prev, register: 'Não foi possível conectar ao servidor.' }));
    }
  };

  return (
    <div className="register-container">
      <div className="logo">
        <img src="/logo-ciclolog.png" alt="Ciclolog Logo" />
      </div>
      <h1>Registar Utilizador</h1>
      <form onSubmit={handleSubmit} autoComplete="off">
        <div className="form-group">
          <label htmlFor="first_name">Primeiro Nome</label>
          <input type="text" id="first_name" value={form.first_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="last_name">Último Nome</label>
          <input type="text" id="last_name" value={form.last_name} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" value={form.email} onChange={handleChange} required />
        </div>

        <div className="form-group">
          <label htmlFor="password">Palavra-passe</label>
          <input type="password" id="password" value={form.password} onChange={handleChange} required minLength={4} />
        </div>

        <div className="form-group">
          <label htmlFor="tipo">Tipo de Utilizador</label>
          <select id="tipo" value={form.tipo} onChange={handleChange} required>
            <option value="">Selecione...</option>
            <option value="gestor-equipas">Gestor de Equipas</option>
            <option value="ciclista">Ciclista</option>
            <option value="gestor-provas">Gestor de Provas</option>
          </select>
          {errors.tipo && <div className="error-message">Escolha o tipo de utilizador</div>}
        </div>

        <hr />

        <div className="form-group">
          <label htmlFor="morada">Morada</label>
          <textarea
            id="morada"
            value={form.morada}
            onChange={handleChange}
            placeholder="Rua, nº, andar, localidade"
          />
        </div>

        <div className="form-group">
          <label htmlFor="datanasc">Data de Nascimento</label>
          <input type="date" id="datanasc" value={form.datanasc} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="telefone">Telefone</label>
          <input type="tel" id="telefone" value={form.telefone} onChange={handleChange} />
        </div>

        <div className="form-group">
          <label htmlFor="nodocident">Nº Doc. Identificação</label>
          <input type="text" id="nodocident" value={form.nodocident} onChange={handleChange} />
        </div>

        {errors.register && <div className="error-message">{errors.register}</div>}

        <button type="submit" className="register-btn">Registar</button>
      </form>
      <div className="links">
        <Link to="/login">Já tem conta? Entrar</Link>
        <Link to="/">Voltar à página inicial</Link>
      </div>
    </div>
  );
}

export default Register;
