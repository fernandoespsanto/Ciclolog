//serv/App.jsx
import './App.css'
import { Routes, Route } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MainLayout from './components/mainlayout'
import Register from './pages/register';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import Ciclista from './pages/ciclista';
import FichaCiclista from './pages/ficha_ciclista';
import Equipas from './pages/equipas';
import Prova from './pages/prova';
import ProvaForm from './pages/ficha_prova';
import FichaEquipa from './pages/ficha_equipa';
import ValidarUtilizadores from './pages/validar_utilizadores';
import ResultadosEtapa from './pages/resultados_etapa';
import Resultados from './pages/resultados';

function App() {
  return (
    <>
      <Routes>
        {/* ROTA de registo “pura” sem layout */}
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/ciclista" element={<Ciclista />} />
          <Route path="/ficha_ciclista/*" element={<FichaCiclista />} />
          <Route path="/equipas/*" element={<Equipas />} />
          <Route path="/prova/*" element={<Prova />} />
          <Route path="/ficha_prova/*" element={<ProvaForm />} />
          <Route path="/ficha_equipa" element={<FichaEquipa />} />
          <Route path="/validar_utilizadores" element={<ValidarUtilizadores />} />
          <Route path="/resultados_etapa" element={<ResultadosEtapa />} />
          <Route path="/resultados" element={<Resultados />} />

        <Route path="/*" element={<MainLayout />} />
      </Routes>
    </>
  );
}
export default App