// src/pages/ficha_ciclista.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

export default function FichaCiclista() {
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const modo = params.get('modo') || 'adicionar';
  const idParam = params.get('id') || '';
  const userName = localStorage.getItem('ciclolog_user_name') || '';

  const [formData, setFormData] = useState({
    id: idParam,
    nome: '',
    equipa: '',
    email: '',
    grade: '',
  });

  const [errors, setErrors] = useState({});
  const [equipas, setEquipas] = useState([]);

  const readOnly = modo === 'ver';
  const titulo = {
    adicionar: 'Adicionar Ciclista',
    editar: 'Editar Ciclista',
    ver: 'Ficha do Ciclista',
  }[modo];

  // Redirecionar se não estiver autenticado
  useEffect(() => {
    if (!localStorage.getItem('ciclolog_logged_in')) {
      navigate('/login');
    }
  }, [navigate]);

  // Carregar equipas para dropdown
  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/equipas/')
      .then(res => res.json())
      .then(data => setEquipas(data));
  }, []);

  // Carregar ciclista se for editar ou ver
  useEffect(() => {
    if ((modo === 'editar' || modo === 'ver') && idParam) {
      fetch(`http://127.0.0.1:8000/api/ciclista/${idParam}/`)
        .then(res => res.json())
        .then(data => {
          setFormData({
            id: data.id,
            nome: data.nome,
            equipa: data.equipa || '',
            email: data.email || '',
            grade: data.grade || '',
          });
        });
    }
  }, [modo, idParam]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: files ? files[0] : value
    });
  };

  const validate = () => {
    const newErrors = {};
    if (!formData.nome.trim()) newErrors.nome = 'Insira o nome do ciclista';
    if (!formData.grade.trim()) newErrors.grade = 'Insira a categoria';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors);
      return;
    }
    const payload = {
      nome: formData.nome,
      equipa: formData.equipa || null,
      email: formData.email,
      grade: formData.grade
    };

    const isEditar = modo === 'editar';
    const url = isEditar
      ? `http://127.0.0.1:8000/api/ciclista/${formData.id}/`
      : 'http://127.0.0.1:8000/api/ciclista/create/';
    const method = isEditar ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const detail = await res.text();
        console.error('Erro:', detail);
        throw new Error('Erro ao guardar ciclista');
      }

      alert('Ciclista guardado com sucesso!');
      navigate('/ciclista');
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <>
      <header>
        <div className="header-content">
          <div className="logo">
            <img src="/logo-ciclolog.png" alt="Logo" />
            <span>CICLOLOG</span>
          </div>
          <div className="user-menu">
            <span><b>{userName}</b></span>
            <Link to="/login" style={{ color: '#fff' }}>
              <i className="fas fa-sign-out-alt"></i> Sair
            </Link>
          </div>
        </div>
      </header>

      <main className="container">
        <h2><i className="fas fa-person-biking"></i> {titulo}</h2>
        <form onSubmit={handleSubmit} autoComplete="off">
          <div className="form-group">
            <label>Nome</label>
            <input
              type="text"
              name="nome"
              value={formData.nome}
              onChange={handleChange}
              readOnly={readOnly}
              required
            />
          </div>

          <div className="form-group">
            <label>Equipa</label>
            <select
              name="equipa"
              value={formData.equipa || ''}
              onChange={handleChange}
              disabled={readOnly}
            >
              <option value="">Selecione a equipa</option>
              {equipas.map(eq => (
                <option key={eq.id} value={eq.id}>{eq.nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={readOnly}
            />
          </div>
          <div className="form-group">
            <label>Categoria</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              readOnly={readOnly}
          />
          {errors.grade && <div className="error-message">{errors.grade}</div>}
          </div>

          {!readOnly && (
            <div className="btn-row">
              <button type="submit" className="btn">
                <i className="fas fa-save"></i> Gravar Ciclista
              </button>
              <button type="button" className="btn" onClick={() => navigate('/ciclista')}>
                <i className="fas fa-times"></i> Cancelar
              </button>
            </div>
          )}

          {readOnly && (
            <div className="btn-row">
              <Link to="/ciclista" className="btn" style={{ backgroundColor: '#555' }}>
                <i className="fas fa-arrow-left"></i> Voltar
              </Link>
            </div>
          )}
        </form>
      </main>
    </>
  );
}
