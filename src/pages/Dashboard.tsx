import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, Filter, BookOpen, DollarSign, Star, Code, Globe, PenTool, Sparkles, TrendingUp, ChevronRight, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classesApi, tutorApi, type TutoringClass, type TutorProfile } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<TutoringClass[]>([]);
  const [profile, setProfile] = useState<TutorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedClassForReview, setSelectedClassForReview] = useState<{ id: number, tutorName: string } | null>(null);
  const [featuredTutors, setFeaturedTutors] = useState<TutorProfile[]>([]);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    tutorApi
      .search({ size: 3, sort: 'averageRating,desc', onlyVerified: false })
      .then((res) => {
        const data = res.data as any;
        const list: TutorProfile[] = data?.content ?? (Array.isArray(data) ? data : []);
        setFeaturedTutors(list.slice(0, 3));
      })
      .catch(() => setFeaturedTutors([]))
      .finally(() => setLoadingTutors(false));
  }, []);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchBoard = async () => {
      try {
        setLoading(true);
        const { data } = await classesApi.getMyBoard(user.id);
        setClasses(data);
        if (user.role === 'TUTOR') {
          const profileRes = await tutorApi.getMyProfile();
          setProfile(profileRes.data);
        }
      } catch {
        setError('No se pudo cargar el tablero. Verifica si el backend está en ejecución.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [user, navigate]);


  const handleFinalize = async (id: number) => {
    try {
      const { data } = await classesApi.finalize(id);
      setClasses((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch {
      alert('No tienes permiso para finalizar esta clase.');
    }
  };

  const filtered = classes.filter((t) =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const statusColor: Record<string, string> = {
    PROGRAMMED: '#6366f1',
    IN_PROGRESS: '#f59e0b',
    COMPLETED: '#10b981',
  };

  const statusText: Record<string, string> = {
    PROGRAMMED: 'PROGRAMADA',
    IN_PROGRESS: 'EN PROGRESO',
    COMPLETED: 'COMPLETADA',
  };

  return (
    <div className="container animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>¡Hola, {user?.fullName ?? 'Usuario'}! 👋</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Rol: <span style={{ color: '#a855f7', fontWeight: 600 }}>{user?.role === 'STUDENT' ? 'ESTUDIANTE' : 'TUTOR'}</span>
            &nbsp;·&nbsp; Saldo:{' '}
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              ${user?.balance?.toLocaleString('es-CO') ?? '0'} COP
            </span>
          </p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <BookOpen size={28} color="#a855f7" />
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total de Clases</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{classes.length}</p>
          </div>
        </div>
        <div
          className="glass-card"
          onClick={() => navigate('/wallet')}
          style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center', cursor: 'pointer', transition: 'all 0.3s ease', position: 'relative', border: '1px solid rgba(16, 185, 129, 0.2)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(16, 185, 129, 0.1)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.2)';
            e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.2)';
          }}
        >
          <DollarSign size={28} color="#10b981" />
          <div style={{ flex: 1 }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
              Saldo
              <span style={{ color: '#10b981', fontSize: '0.7rem', fontWeight: 600, padding: '0.1rem 0.4rem', background: 'rgba(16,185,129,0.1)', borderRadius: '50px', marginLeft: '0.3rem' }}>
                + Recargar
              </span>
            </p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>${user?.balance?.toLocaleString('es-CO') ?? '0'}</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Calendar size={28} color="#f59e0b" />
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Programadas</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>
              {classes.filter((t) => t.status === 'PROGRAMMED').length}
            </p>
          </div>
        </div>
      </div>

      {/* Search bar */}
      <div className="glass-card" style={{ marginBottom: '2rem', padding: '1.25rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '280px', position: 'relative' }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Buscar por materia o descripción..."
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn" style={{ padding: '0.75rem 1.25rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)', display: 'flex', gap: '0.5rem' }}>
          <Filter size={18} /> Filtros
        </button>
      </div>

      {/* States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          Cargando tus clases...
        </div>
      )}

      {error && !loading && (
        <div style={{
          background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.4)',
          borderRadius: '12px', padding: '2rem', textAlign: 'center', color: '#f87171'
        }}>
          ⚠️ {error}
        </div>
      )}

      {!loading && !error && (
        <>
          <div className="grid">
            {filtered.map((tutoringClass) => (
              <div key={tutoringClass.id} className="glass-card item-card">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <span className="item-badge">{tutoringClass.subject}</span>
                  <span style={{
                    fontSize: '0.8rem', fontWeight: 600, padding: '0.2rem 0.6rem',
                    borderRadius: '9999px', background: `${statusColor[tutoringClass.status] ?? '#64748b'}22`,
                    color: statusColor[tutoringClass.status] ?? '#94a3b8',
                    border: `1px solid ${statusColor[tutoringClass.status] ?? '#64748b'}44`
                  }}>
                    {statusText[tutoringClass.status] || tutoringClass.status}
                  </span>
                </div>

                <h3 style={{ margin: '0.5rem 0' }}>{tutoringClass.description}</h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <User size={15} />
                    <span>Tutor: {tutoringClass.tutor?.fullName ?? '—'}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Calendar size={15} />
                    <span>{new Date(tutoringClass.fechaHora).toLocaleDateString('es-CO', { dateStyle: 'medium' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={15} />
                    <span>{new Date(tutoringClass.fechaHora).toLocaleTimeString('es-CO', { timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
                    ${tutoringClass.price?.toLocaleString('es-CO')}
                  </span>
                  {user?.role === 'TUTOR' && tutoringClass.status !== 'COMPLETED' && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => handleFinalize(tutoringClass.id)}
                    >
                      Completar
                    </button>
                  )}
                  {user?.role === 'STUDENT' && tutoringClass.status === 'COMPLETED' && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem', background: '#eab308', borderColor: '#eab308' }}
                      onClick={() => {
                        setSelectedClassForReview({ id: tutoringClass.id, tutorName: tutoringClass.tutor?.fullName || 'Tutor' });
                        setReviewModalOpen(true);
                      }}
                    >
                      Calificar
                    </button>
                  )}
                  {tutoringClass.meetingLink && tutoringClass.status !== 'COMPLETED' && (
                    <button
                      onClick={() => navigate(`/classroom/${tutoringClass.id}`)}
                      className="btn btn-primary"
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      Unirse
                    </button>
                  )}
                </div>
              </div>
            ))}

            {filtered.length === 0 && user?.role === 'STUDENT' && (
              <div style={{ gridColumn: '1 / -1', display: 'flex', flexDirection: 'column', gap: '2rem', animation: 'fadeIn 0.5s ease-out' }}>

                {/* Hero Banner */}
                <div style={{
                  background: 'linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 100%)',
                  border: '1px solid rgba(168,85,247,0.3)',
                  borderRadius: '16px', padding: '3rem 2rem', textAlign: 'center', position: 'relative', overflow: 'hidden'
                }}>
                  <div style={{ position: 'absolute', top: '-10%', left: '-5%', width: '150px', height: '150px', background: '#a855f7', filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }}></div>
                  <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '150px', height: '150px', background: '#ec4899', filter: 'blur(80px)', opacity: 0.3, borderRadius: '50%' }}></div>

                  <Sparkles size={48} color="#ec4899" style={{ margin: '0 auto 1rem auto' }} />
                  <h2 style={{ fontSize: '2.5rem', marginBottom: '1rem', background: 'linear-gradient(to right, #e879f9, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Desata tu máximo potencial
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    Aún no tienes clases programadas. Conecta con expertos de todo el mundo y lleva tus habilidades al siguiente nivel.
                  </p>
                  <button
                    className="btn btn-primary"
                    onClick={() => navigate('/browse')}
                    style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center', borderRadius: '9999px', boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)' }}
                  >
                    Buscar Tutores <ChevronRight size={18} />
                  </button>
                </div>

                {/* Popular Subjects */}
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <TrendingUp size={24} color="#a855f7" /> Materias Populares
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      { name: 'Programación', icon: <Code size={24} color="#3b82f6" />, color: '#3b82f6' },
                      { name: 'Matemáticas', icon: <TrendingUp size={24} color="#10b981" />, color: '#10b981' },
                      { name: 'Idiomas', icon: <Globe size={24} color="#f59e0b" />, color: '#f59e0b' },
                      { name: 'Diseño UX/UI', icon: <PenTool size={24} color="#ec4899" />, color: '#ec4899' },
                    ].map((materia) => (
                      <div key={materia.name} className="glass-card" style={{
                        padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer',
                        transition: 'all 0.3s ease', border: '1px solid rgba(255,255,255,0.05)'
                      }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div style={{ padding: '1rem', borderRadius: '12px', background: `${materia.color}15` }}>
                          {materia.icon}
                        </div>
                        <span style={{ fontWeight: 600 }}>{materia.name}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Featured Tutors */}
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <Star size={24} color="#eab308" /> Tutores Destacados
                  </h3>

                  {loadingTutors ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-muted)', gap: '0.75rem', alignItems: 'center' }}>
                      <Loader size={22} style={{ animation: 'spin 1s linear infinite' }} />
                      Cargando tutores...
                    </div>
                  ) : featuredTutors.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
                      <p>Aún no hay tutores registrados.</p>
                    </div>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                      {featuredTutors.map((tutor) => (
                        <div key={tutor.id} className="glass-card item-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <img src={tutor.profilePictureUrl || `https://ui-avatars.com/api/?name=${tutor.fullName}&background=random`} alt={tutor.fullName} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a855f7' }} />
                          <div style={{ flex: 1 }}>
                            <h4 style={{ margin: '0 0 0.2rem 0' }}>{tutor.fullName}</h4>
                            <span className="item-badge" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>{tutor.subjects?.[0] || 'Varios'}</span>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                              <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                                <Star size={14} fill="#eab308" /> {tutor.averageRating > 0 ? tutor.averageRating.toFixed(1) : 'Nuevo'}
                              </span>
                              <span style={{ color: '#10b981', fontWeight: 700 }}>${tutor.hourlyRate?.toLocaleString('es-CO')}/h</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            )}

            {filtered.length === 0 && user?.role === 'TUTOR' && (
              <div style={{ gridColumn: '1 / -1' }}>
                <div style={{ textAlign: 'center', padding: '5rem 2rem', background: 'rgba(168,85,247,0.05)', borderRadius: '16px', border: '1px dashed rgba(168,85,247,0.3)', marginBottom: '2rem' }}>
                  <BookOpen size={64} color="#a855f7" style={{ margin: '0 auto 1.5rem auto', opacity: 0.8 }} />
                  <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Tu agenda está libre</h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                    Aún no tienes clases programadas con estudiantes. Optimiza tu perfil y prepárate para compartir tu conocimiento.
                  </p>
                  <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }} onClick={() => navigate('/tutor/settings')}>Completar mi perfil</button>
                </div>

                {profile && profile.subjects && profile.subjects.length > 0 && (
                  <div style={{ animation: 'fadeIn 0.5s ease-out' }}>
                    <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                      <Star size={24} color="#a855f7" /> Clases que ofreces
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      {profile.subjects.map((sub, idx) => (
                        <div key={idx} className="glass-card" style={{
                          padding: '1.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', cursor: 'pointer',
                          transition: 'all 0.3s ease', border: '1px solid rgba(255,255,255,0.05)'
                        }}
                          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                          <div style={{ padding: '1rem', borderRadius: '12px', background: 'rgba(168,85,247,0.15)' }}>
                            <BookOpen size={24} color="#a855f7" />
                          </div>
                          <span style={{ fontWeight: 600 }}>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </>
      )}

      {selectedClassForReview && (
        <ReviewModal
          isOpen={reviewModalOpen}
          onClose={() => setReviewModalOpen(false)}
          tutoringClassId={selectedClassForReview.id}
          tutorName={selectedClassForReview.tutorName}
          onSuccess={() => {
            // Refresh dashboard
            classesApi.getMyBoard(user!.id).then(res => setClasses(res.data));
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;

