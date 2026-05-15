import { useState, useEffect } from 'react';
import { Search, Calendar, Clock, User, Filter, LogOut, BookOpen, DollarSign, Star, Code, Globe, PenTool, Sparkles, TrendingUp, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { classesApi, type TutoringClass } from '../services/api';
import { useAuth } from '../context/AuthContext';
import ReviewModal from '../components/ReviewModal';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [classes, setClasses] = useState<TutoringClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [selectedClassForReview, setSelectedClassForReview] = useState<{id: number, tutorName: string} | null>(null);

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
      } catch {
        setError('Could not load the dashboard. Check if the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    fetchBoard();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleFinalize = async (id: number) => {
    try {
      const { data } = await classesApi.finalize(id);
      setClasses((prev) => prev.map((t) => (t.id === id ? data : t)));
    } catch {
      alert('You do not have permission to complete this class.');
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

  return (
    <div className="container animate-fade-in">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Hello, {user?.fullName ?? 'User'}! 👋</h2>
          <p style={{ color: 'var(--text-muted)' }}>
            Role: <span style={{ color: '#a855f7', fontWeight: 600 }}>{user?.role}</span>
            &nbsp;·&nbsp; Balance:{' '}
            <span style={{ color: '#10b981', fontWeight: 600 }}>
              ${user?.balance?.toFixed(2) ?? '0.00'}
            </span>
          </p>
        </div>
        <button className="btn" onClick={handleLogout}
          style={{ display: 'flex', gap: '0.5rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)' }}>
          <LogOut size={18} /> Logout
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <BookOpen size={28} color="#a855f7" />
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Classes</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>{classes.length}</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <DollarSign size={28} color="#10b981" />
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Balance</p>
            <p style={{ fontSize: '1.75rem', fontWeight: 700 }}>${user?.balance?.toFixed(2) ?? '0.00'}</p>
          </div>
        </div>
        <div className="glass-card" style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <Calendar size={28} color="#f59e0b" />
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Programmed</p>
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
            placeholder="Search by subject or description..."
            style={{ paddingLeft: '3rem' }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="btn" style={{ padding: '0.75rem 1.25rem', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-color)', display: 'flex', gap: '0.5rem' }}>
          <Filter size={18} /> Filters
        </button>
      </div>

      {/* States */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
          Loading your classes...
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
                    {tutoringClass.status}
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
                    <span>{new Date(tutoringClass.fechaHora).toLocaleDateString('en-US', { dateStyle: 'medium' })}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Clock size={15} />
                    <span>{new Date(tutoringClass.fechaHora).toLocaleTimeString('en-US', { timeStyle: 'short' })}</span>
                  </div>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: '#10b981', fontWeight: 700, fontSize: '1.1rem' }}>
                    ${tutoringClass.price?.toFixed(2)}
                  </span>
                  {user?.role === 'TUTOR' && tutoringClass.status !== 'COMPLETED' && (
                    <button
                      className="btn btn-primary"
                      style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                      onClick={() => handleFinalize(tutoringClass.id)}
                    >
                      Complete
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
                      Review
                    </button>
                  )}
                  {tutoringClass.meetingLink && tutoringClass.status !== 'COMPLETED' && (
                    <button 
                      onClick={() => navigate(`/classroom/${tutoringClass.id}`)}
                      className="btn btn-primary" 
                      style={{ padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                    >
                      Join
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
                    Unleash your maximum potential
                  </h2>
                  <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '600px', margin: '0 auto 2rem auto' }}>
                    You don't have any programmed classes yet. Connect with experts around the world and take your skills to the next level.
                  </p>
                  <button 
                    className="btn btn-primary" 
                    onClick={() => navigate('/browse')}
                    style={{ padding: '0.8rem 2rem', fontSize: '1.1rem', display: 'inline-flex', gap: '0.5rem', alignItems: 'center', borderRadius: '9999px', boxShadow: '0 4px 14px 0 rgba(168, 85, 247, 0.39)' }}
                  >
                    Browse Tutors <ChevronRight size={18} />
                  </button>
                </div>

                {/* Popular Subjects */}
                <div>
                  <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
                    <TrendingUp size={24} color="#a855f7" /> Popular Subjects
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                    {[
                      { name: 'Programming', icon: <Code size={24} color="#3b82f6" />, color: '#3b82f6' },
                      { name: 'Mathematics', icon: <TrendingUp size={24} color="#10b981" />, color: '#10b981' },
                      { name: 'Languages', icon: <Globe size={24} color="#f59e0b" />, color: '#f59e0b' },
                      { name: 'UX/UI Design', icon: <PenTool size={24} color="#ec4899" />, color: '#ec4899' },
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
                    <Star size={24} color="#eab308" /> Featured Tutors
                  </h3>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {[
                      { name: 'Dra. Elena Gómez', subject: 'Física Cuántica', rate: 25.00, rating: 4.9, img: 'https://i.pravatar.cc/150?img=32' },
                      { name: 'Carlos Ruíz', subject: 'Desarrollo Frontend', rate: 18.50, rating: 4.8, img: 'https://i.pravatar.cc/150?img=11' },
                      { name: 'Sarah Miller', subject: 'Inglés Avanzado', rate: 20.00, rating: 5.0, img: 'https://i.pravatar.cc/150?img=5' },
                    ].map((tutor) => (
                      <div key={tutor.name} className="glass-card item-card" style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <img src={tutor.img} alt={tutor.name} style={{ width: '64px', height: '64px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #a855f7' }} />
                        <div style={{ flex: 1 }}>
                          <h4 style={{ margin: '0 0 0.2rem 0' }}>{tutor.name}</h4>
                          <span className="item-badge" style={{ fontSize: '0.75rem', marginBottom: '0.5rem', display: 'inline-block' }}>{tutor.subject}</span>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                            <span style={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: '0.2rem', fontSize: '0.9rem', fontWeight: 600 }}>
                              <Star size={14} fill="#eab308" /> {tutor.rating}
                            </span>
                            <span style={{ color: '#10b981', fontWeight: 700 }}>${tutor.rate.toFixed(2)}/h</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}

            {filtered.length === 0 && user?.role === 'TUTOR' && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '5rem 2rem', background: 'rgba(168,85,247,0.05)', borderRadius: '16px', border: '1px dashed rgba(168,85,247,0.3)' }}>
                <BookOpen size={64} color="#a855f7" style={{ margin: '0 auto 1.5rem auto', opacity: 0.8 }} />
                <h2 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Your schedule is free</h2>
                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', maxWidth: '500px', margin: '0 auto 2rem auto' }}>
                  You don't have any classes programmed with students yet. Optimize your profile and get ready to share your knowledge.
                </p>
                <button className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>Complete my profile</button>
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
