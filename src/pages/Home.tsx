import { ArrowRight, BookOpen, Users, Star, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="container animate-fade-in">

      {/* ── Hero ────────────────────────────────────────────────── */}
      <section className="hero">
        <div style={{
          display: 'inline-block', background: 'rgba(168,85,247,0.15)',
          border: '1px solid rgba(168,85,247,0.3)', borderRadius: '9999px',
          padding: '0.4rem 1.2rem', fontSize: '0.9rem', color: '#c084fc',
          marginBottom: '1.5rem', fontWeight: 500
        }}>
          ✨ Online tutoring platform
        </div>

        <h1>Learn with the best.<br />Vibe with knowledge.</h1>

        <p>
          Connect with expert tutors, master new skills, and join a
          community dedicated to your professional growth.
        </p>

        {isAuthenticated ? (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/dashboard" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              My Classes <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <p style={{ color: 'var(--text-muted)', alignSelf: 'center' }}>
              Welcome back, <strong style={{ color: '#c084fc' }}>{user?.fullName}</strong>
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/register" className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }}>
              Start for free <ArrowRight size={20} style={{ marginLeft: '0.5rem' }} />
            </Link>
            <Link to="/login" className="btn" style={{
              padding: '1rem 2rem', fontSize: '1.1rem',
              border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)'
            }}>
              Login
            </Link>
          </div>
        )}
      </section>

      {/* ── Features ────────────────────────────────────────────── */}
      <section style={{ padding: '4rem 0' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.75rem' }}>Why choose SkillVibes?</h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '3rem' }}>
          Everything you need to learn and teach in one place
        </p>
        <div className="grid">
          <div className="glass-card item-card">
            <Users size={40} color="#a855f7" />
            <h3>Expert Tutors</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Learn from the best mentors, selected for their experience and methodology.
            </p>
          </div>
          <div className="glass-card item-card">
            <BookOpen size={40} color="#6366f1" />
            <h3>Varied Subjects</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              From programming to arts, find the perfect class for you.
            </p>
          </div>
          <div className="glass-card item-card">
            <Star size={40} color="#f59e0b" />
            <h3>Guaranteed Quality</h3>
            <p style={{ color: 'var(--text-muted)' }}>
              Top-rated sessions with proven results. Your success is our priority.
            </p>
          </div>
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────── */}
      <section style={{ padding: '2rem 0 5rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '3rem' }}>How does it work?</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2rem' }}>
          {[
            { step: '01', title: 'Register', desc: 'Create your account as a student or tutor in minutes.' },
            { step: '02', title: 'Explore', desc: 'Browse available classes and find what you\'re looking for.' },
            { step: '03', title: 'Connect', desc: 'Schedule a session with your favorite tutor in real time.' },
            { step: '04', title: 'Learn', desc: 'Join the class and take your skills to the next level.' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{
                fontSize: '0.8rem', fontWeight: 700, color: '#a855f7',
                letterSpacing: '0.1em', marginBottom: '0.75rem'
              }}>STEP {step}</div>
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
