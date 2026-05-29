import React, { useEffect, useState } from 'react';
import { adminApi } from '../services/api';
import type { TutorProfile } from '../services/api';
import { Check, X, Shield, Users, BookOpen, Clock } from 'lucide-react';
import toast from 'react-hot-toast';

const AdminDashboard: React.FC = () => {
  const [pendingTutors, setPendingTutors] = useState<TutorProfile[]>([]);
  const [verifiedTutors, setVerifiedTutors] = useState<TutorProfile[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [pendingRes, verifiedRes, statsRes] = await Promise.all([
        adminApi.getPendingTutors(),
        adminApi.getVerifiedTutors(),
        adminApi.getSystemStats()
      ]);
      setPendingTutors(pendingRes.data);
      setVerifiedTutors(verifiedRes.data);
      setStats(statsRes.data);
    } catch {
      toast.error('Error al cargar el panel de administrador');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchData();
  }, []);

  const handleVerify = async (id: number, verified: boolean) => {
    try {
      await adminApi.verifyTutor(id, { verified });
      toast.success(`Tutor ${verified ? 'aprobado' : 'rechazado'} con éxito`);
      fetchData(); // Refresh lists
    } catch {
      toast.error('Error al actualizar el estado del tutor');
    }
  };

  if (loading) return (
    <div className="container" style={{ display: 'flex', justifyContent: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
      <div style={{ textAlign: 'center' }}>
        <Shield size={48} color="#a855f7" style={{ margin: '0 auto 1rem', animation: 'spin 2s linear infinite' }} />
        <p>Cargando panel de administración...</p>
      </div>
    </div>
  );

  return (
    <div className="container animate-fade-in">
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <Shield size={36} color="#a855f7" />
        <div>
          <h2>Panel de Administración</h2>
          <p style={{ color: 'var(--text-muted)' }}>Gestiona la plataforma, usuarios y solicitudes</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(59, 130, 246, 0.15)', borderRadius: '12px' }}>
            <Users size={28} color="#3b82f6" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Usuarios Activos</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats?.totalUsers || 0}</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '12px' }}>
            <Check size={28} color="#10b981" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Tutores Verificados</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{verifiedTutors.length}</p>
          </div>
        </div>

        <div className="glass-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <div style={{ padding: '1rem', background: 'rgba(168, 85, 247, 0.15)', borderRadius: '12px' }}>
            <BookOpen size={28} color="#a855f7" />
          </div>
          <div>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500 }}>Clases Registradas</p>
            <p style={{ fontSize: '2rem', fontWeight: 700 }}>{stats?.totalClasses || 0}</p>
          </div>
        </div>
      </div>

      {/* Pending Tutors Table */}
      <div className="glass-card" style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Clock size={24} color="#f59e0b" />
          <h3 style={{ margin: 0 }}>
            Solicitudes Pendientes
            <span style={{ 
              background: 'rgba(245, 158, 11, 0.15)', 
              color: '#f59e0b', 
              fontSize: '0.8rem', 
              padding: '0.2rem 0.6rem', 
              borderRadius: '9999px', 
              marginLeft: '1rem',
              fontWeight: 600
            }}>
              {pendingTutors.length}
            </span>
          </h3>
        </div>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ background: 'rgba(255, 255, 255, 0.02)', color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Tutor</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Tarifa / Exp</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Materias</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600 }}>Documentos</th>
                <th style={{ padding: '1rem 1.5rem', fontWeight: 600, textAlign: 'right' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pendingTutors.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ padding: '3rem 1.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No hay solicitudes pendientes en este momento.
                  </td>
                </tr>
              ) : (
                pendingTutors.map((tutor) => (
                  <tr key={tutor.id} style={{ borderTop: '1px solid var(--border-color)', transition: 'background 0.2s ease' }} onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)'} onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <img src={tutor.profilePictureUrl || `https://ui-avatars.com/api/?name=${tutor.fullName}&background=random`} alt={tutor.fullName} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(168, 85, 247, 0.3)' }} />
                        <div>
                          <p style={{ fontWeight: 600, margin: 0 }}>{tutor.fullName}</p>
                          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{tutor.email}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <p style={{ fontWeight: 600, color: '#10b981', margin: 0 }}>${tutor.hourlyRate.toLocaleString('es-CO')}/h</p>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', margin: 0 }}>{tutor.yearsOfExperience} años exp.</p>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {tutor.subjects.map((sub, i) => (
                          <span key={i} style={{ background: 'rgba(168, 85, 247, 0.1)', color: '#c084fc', fontSize: '0.75rem', padding: '0.2rem 0.5rem', borderRadius: '6px' }}>
                            {sub}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.5rem' }}>
                      {tutor.credentialsUrl && (
                        <a href={tutor.credentialsUrl} target="_blank" rel="noreferrer" style={{ color: '#3b82f6', textDecoration: 'none', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <Shield size={14} /> Ver Identidad
                        </a>
                      )}
                    </td>
                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleVerify(tutor.userId, true)}
                          style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.2)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                          title="Aprobar"
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(16, 185, 129, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <Check size={18} />
                        </button>
                        <button
                          onClick={() => handleVerify(tutor.userId, false)}
                          style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease' }}
                          title="Rechazar"
                          onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                          onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'; e.currentTarget.style.transform = 'translateY(0)'; }}
                        >
                          <X size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
