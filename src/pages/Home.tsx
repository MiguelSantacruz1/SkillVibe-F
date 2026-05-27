import { ArrowRight, BookOpen, Users, Star, CheckCircle, Loader } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { tutorApi, type TutorProfile } from '../services/api';
import TutorCard from '../components/TutorCard';

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    tutorApi
      .search({ size: 3, sort: 'averageRating,desc' })
      .then((res) => {
        const data = res.data as any;
        const list: TutorProfile[] = data?.content ?? (Array.isArray(data) ? data : []);
        setFeaturedTutors(list.slice(0, 3));
      })
      .catch(() => setFeaturedTutors([]))
      .finally(() => setLoadingTutors(false));
  }, []);

  return (
    <div className="container animate-fade-in">

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

      {/* ── Featured Tutors ──────────────────────────────────────── */}
      <section style={{ padding: '2rem 0 4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <h2 style={{ margin: 0 }}>
            <Star size={22} color="#f59e0b" fill="#f59e0b" style={{ verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Tutores Destacados
          </h2>
          <Link to="/tutors" className="btn" style={{
            padding: '0.5rem 1.2rem', fontSize: '0.9rem',
            border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)'
          }}>
            Ver todos <ArrowRight size={14} style={{ marginLeft: '0.3rem', verticalAlign: 'middle' }} />
          </Link>
        </div>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Los tutores mejor valorados listos para ayudarte
        </p>

        {loadingTutors ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem 0', color: 'var(--text-muted)', gap: '0.75rem', alignItems: 'center' }}>
            <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} />
            Cargando tutores…
          </div>
        ) : featuredTutors.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--text-muted)' }}>
            <Users size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
            <p>Aún no hay tutores registrados.</p>
          </div>
        ) : (
          <div className="grid">
            {featuredTutors.map((tutor) => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
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
