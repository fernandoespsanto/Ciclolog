// src/components/MainLayout.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function MainLayout() {
  return (
    <>
    
      <header>
        <div className="container header-content">
          <div className="logo">
            <img src="/logo-ciclolog.png" alt="Ciclolog Logo" />
            <span>CICLOLOG</span>
          </div>
          <nav>
            <ul>
              <li><a href="#features">Funcionalidades</a></li>
              <li><a href="#about">Sobre</a></li>
              <li><a href="#testimonials">Depoimentos</a></li>
              <li><a href="#contact">Contactos</a></li>
              <li><Link to="/login" className="btn">Entrar</Link></li>
            </ul>
          </nav>
        </div>
      </header>


      <section className="hero">
        <div className="container hero-content">
          <h1>Sistema de Registo de Provas de Ciclismo</h1>
          <p>A solução completa para a gestão de competições de ciclismo amador em Portugal. Centralize dados, simplifique processos e promova o ciclismo nacional.</p>
          <Link to="/register" className="btn">Registar Agora</Link>
        </div>
      </section>

      <section id="features" className="features">
        <div className="container">
          <h2>Funcionalidades Principais</h2>
          <p>Descubra como o Ciclolog pode revolucionar a gestão das suas provas de ciclismo</p>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Registo de Ciclistas</h3>
              <p>Gestão centralizada de todos os participantes com informações detalhadas e histórico de participações.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Gestão de Equipas</h3>
              <p>Organize equipas, atribua ciclistas e acompanhe o desempenho coletivo em cada prova.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-flag-checkered"></i>
              </div>
              <h3>Criação de Provas</h3>
              <p>Registe todas as informações das provas: nome, tipo, data, localização, distância e elevação.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-list-ol"></i>
              </div>
              <h3>Etapas e Resultados</h3>
              <p>Defina etapas para provas complexas e registe os resultados de forma precisa e organizada.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-chart-bar"></i>
              </div>
              <h3>Dashboards Interativos</h3>
              <p>Acompanhe estatísticas e desempenhos através de relatórios visuais e intuitivos.</p>
            </div>

            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-file-export"></i>
              </div>
              <h3>Exportação de Dados</h3>
              <p>Exporte relatórios em formatos CSV ou PDF para partilha e análise externa.</p>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="about">
        <div className="container">
          <h2>Sobre o Projeto</h2>
          <p>O Ciclolog nasceu da necessidade de modernizar e simplificar a gestão de provas de ciclismo amador em Portugal. Com o crescimento da modalidade e o surgimento de novos talentos como João Almeida e Iúri Leitão, torna-se essencial dispor de ferramentas eficientes para organizar competições.</p>

          <p>Esta plataforma web permite:</p>
          <ul>
            <li>Centralização de dados de ciclistas, equipas e provas</li>
            <li>Redução de erros humanos e aumento da transparência</li>
            <li>Maior eficiência na organização de eventos</li>
            <li>Promoção do ciclismo amador nacional</li>
            <li>Disponibilização de dados históricos para análise</li>
          </ul>

          <p>Atualmente em fase de desenvolvimento, o Ciclolog terá uma primeira versão funcional no primeiro semestre de 2025, com planos para expansão futura incluindo integração com sensores de meta e versão mobile.</p>
        </div>
      </section>

      <section id="testimonials" className="testimonials">
        <div className="container">
          <h2>O Que Dizem os Nossos Utilizadores</h2>
          <p>Veja a opinião de quem já utiliza o Ciclolog</p>

          <div className="testimonial-grid">
            <div className="testimonial-card">
              <img src="testimonial1.jpg" alt="João Silva" className="testimonial-img" />
              <h3>João Silva</h3>
              <p>Presidente do Clube de Ciclismo do Porto</p>
              <p>"O Ciclolog revolucionou a forma como organizamos as nossas provas. A poupança de tempo e a redução de erros são impressionantes."</p>
            </div>

            <div className="testimonial-card">
              <img src="testimonial2.jpg" alt="Maria Santos" className="testimonial-img" />
              <h3>Maria Santos</h3>
              <p>Secretária da Federação de Ciclismo do Centro</p>
              <p>"Finalmente uma solução portuguesa adaptada às nossas necessidades. A equipa do Ciclolog compreende perfeitamente a realidade do ciclismo amador nacional."</p>
            </div>

            <div className="testimonial-card">
              <img src="testimonial3.jpg" alt="Carlos Mendes" className="testimonial-img" />
              <h3>Carlos Mendes</h3>
              <p>Treinador da Equipa Júnior Algarve</p>
              <p>"Os dashboards de desempenho são incríveis para acompanhar a evolução dos nossos jovens atletas ao longo da temporada."</p>
            </div>
          </div>
        </div>
      </section>

      <footer id="contact">
        <div className="container">
          <div className="footer-content">
            <div className="footer-column">
              <h3>CICLOLOG</h3>
              <p>Sistema de Registo de Provas de Ciclismo para o mercado português. Desenvolvido por estudantes de Engenharia Informática.</p>
              <div className="social-links">
                <a href="#"><i className="fab fa-facebook-f"></i></a>
                <a href="#"><i className="fab fa-twitter"></i></a>
                <a href="#"><i className="fab fa-instagram"></i></a>
                <a href="#"><i className="fab fa-linkedin-in"></i></a>
              </div>
            </div>

            <div className="footer-column">
              <h3>Links Rápidos</h3>
              <ul>
                <li><a href="#features">Funcionalidades</a></li>
                <li><a href="#about">Sobre o Projeto</a></li>
                <li><a href="#testimonials">Depoimentos</a></li>
                <li><a href="privacy.php">Política de Privacidade</a></li>
                <li><a href="terms.php">Termos de Serviço</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Contactos</h3>
              <ul>
                <li><i className="fas fa-envelope"></i> geral@ciclolog.pt</li>
                <li><i className="fas fa-phone"></i> +351 966 414 065</li>
                <li><i className="fas fa-map-marker-alt"></i> Universidade Aberta, Lisboa</li>
              </ul>
            </div>

            <div className="footer-column">
              <h3>Newsletter</h3>
              <p>Subscreva para receber as últimas novidades sobre o Ciclolog.</p>
              <form>
                <input type="email" placeholder="O seu email" required />
                <button type="submit" className="btn">Subscrever</button>
              </form>
            </div>
          </div>

          <div className="copyright">
            <p>&copy; 2025 Ciclolog. Todos os direitos reservados. Desenvolvido por Daniel Santos e Fernando Espírito Santo.</p>
          </div>
        </div>
      </footer>
    </>
  );
}

export default MainLayout