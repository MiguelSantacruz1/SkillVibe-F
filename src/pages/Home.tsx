import { ArrowRight, BookOpen, Users, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container animate-fade-in" style={{ position: 'relative' }}>
      
      {/* ── Watermark ───────────────────────────────────────────── */}
      <div style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        zIndex: -1,
        opacity: 0.06, // Slightly increased opacity since we are blending
        pointerEvents: 'none', // Allows clicking through it
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        mixBlendMode: 'screen' // Makes the inverted black background transparent
      }}>
        <img 
          src="/logo1.jpg" 
          alt="Watermark" 
          style={{ 
            width: '900px', // Mas grande
            maxWidth: '100vw', 
            filter: 'invert(1) grayscale(100%) contrast(150%)' // Invert to turn white bg into black
          }} 
        />
      </div>

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="hero">
        {isAuthenticated && user && (
          <h2 style={{
            fontSize: '2.5rem',
            marginBottom: '1.5rem',
            fontWeight: 700,
            background: 'linear-gradient(to right, #cb87ceff, #ffffffff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'fadeIn 0.5s ease-out'
          }}>
            Bienvenido de nuevo, {user.fullName}
          </h2>
        )}

        <div style={{
          display: 'inline-block', background: 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.3)', borderRadius: '9999px',
          padding: '0.4rem 1.2rem', fontSize: '0.9rem', color: '#c084fc',
          marginBottom: '1.5rem', fontWeight: 500
        }}>
          ✨ Plataforma de tutorías online
        </div>

        <h1>Aprende con los mejores.<br />Conecta con el conocimiento.</h1>

        <p>
          Conecta con tutores expertos, domina nuevas habilidades y únete a
          una comunidad dedicada a tu crecimiento profesional.
        </p>

        {isAuthenticated ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Mis Clases <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Empieza gratis <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <Link to="/login" className="btn" style={{
              padding: '1rem 2rem', fontSize: '1.1rem',
              border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)'
            }}>
              Iniciar sesión
            </Link>
          </div>
        )}
      </section>


      {/* ── Features ────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>¿Por qué elegir SkillVibes?</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Todo lo que necesitas para aprender y enseñar en un solo lugar
        </p>
        <div className="grid">
          <div className="glass-card item-card">
            <Users size={40} color="#a855f7" />
            <h3>Tutores Expertos</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Aprende de los mejores mentores, seleccionados por su experiencia y metodología.
            </p>
          </div>
          <div className="glass-card item-card">
            <BookOpen size={40} color="#6366f1" />
            <h3>Materias Variadas</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Desde programación hasta arte, encuentra la clase perfecta para ti.
            </p>
          </div>
          <div className="glass-card item-card">
            <Star size={40} color="#f59e0b" />
            <h3>Calidad Garantizada</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Sesiones mejor valoradas con resultados probados. Tu éxito es nuestra prioridad.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>¿Cómo funciona?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
          {[
            { step: '01', title: 'Regístrate', desc: 'Crea tu cuenta como estudiante o tutor en minutos.' },
            { step: '02', title: 'Explora', desc: 'Navega por las clases disponibles y encuentra lo que buscas.' },
            { step: '03', title: 'Conecta', desc: 'Agenda una sesión con tu tutor favorito en tiempo real.' },
            { step: '04', title: 'Aprende', desc: 'Únete a la clase y lleva tus habilidades al siguiente nivel.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{
                fontSize: '0.8rem', fontWeight: 700, color: '#a855f7',
                letterSpacing: '0.1em', marginBottom: '0.75rem'
              }}>PASO {step}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <CheckCircle size={20} color="#a855f7" />
                <h3 style={{ fontSize: '1.15rem' }}>{title}</h3>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>{desc}</p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Home;
