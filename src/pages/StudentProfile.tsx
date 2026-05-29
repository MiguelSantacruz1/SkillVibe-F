import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { studentApi } from '../services/api';
import { User, BookOpen, Save, Loader, Camera } from 'lucide-react';
import toast from 'react-hot-toast';

const StudentProfilePage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [interests, setInterests] = useState<string>('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const { data } = await studentApi.getProfile();
        const profileData = data as { bio?: string; profilePictureUrl?: string; interests?: string[] };
        setBio(profileData.bio || '');
        setProfilePictureUrl(profileData.profilePictureUrl || '');
        setInterests(profileData.interests?.join(', ') || '');
      } catch (err) {
        toast.error('Error al cargar tu perfil');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const interestsArray = interests.split(',').map(i => i.trim()).filter(i => i);
      await studentApi.updateProfile({
        bio,
        profilePictureUrl,
        interests: interestsArray
      });
      toast.success('Perfil actualizado correctamente');
    } catch (err) {
      toast.error('Error al guardar el perfil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh', color: 'var(--text-muted)' }}>
        <Loader className="spin" size={32} />
        <span style={{ marginLeft: '1rem' }}>Cargando perfil...</span>
      </div>
    );
  }

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '800px' }}>
      <h2 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <User size={28} color="#a855f7" /> Mi Perfil de Estudiante
      </h2>

      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          {/* Avatar Section */}
          <div style={{ flex: '0 0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <div style={{ position: 'relative' }}>
              <img 
                src={profilePictureUrl || `https://ui-avatars.com/api/?name=${user?.fullName}&background=a855f7&color=fff&size=150`} 
                alt="Profile" 
                style={{ width: '150px', height: '150px', borderRadius: '50%', objectFit: 'cover', border: '4px solid rgba(168,85,247,0.3)' }}
              />
              <div style={{ position: 'absolute', bottom: 0, right: 0, background: '#1e293b', padding: '0.5rem', borderRadius: '50%', border: '2px solid #0f172a', cursor: 'pointer' }}>
                <Camera size={18} color="#a855f7" />
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ margin: 0 }}>{user?.fullName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: '0.2rem 0' }}>Estudiante</p>
            </div>
          </div>

          {/* Form Section */}
          <div style={{ flex: 1, minWidth: '300px' }}>
            <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="form-group">
                <label className="form-label">URL de Foto de Perfil</label>
                <input 
                  type="url" 
                  className="form-input" 
                  placeholder="https://ejemplo.com/mifoto.jpg"
                  value={profilePictureUrl}
                  onChange={e => setProfilePictureUrl(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Biografía</label>
                <textarea 
                  className="form-input" 
                  rows={4}
                  placeholder="Cuéntanos sobre ti, qué estudias y cuáles son tus metas..."
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BookOpen size={16} /> Intereses y Materias (separados por coma)
                </label>
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="Ej: Programación, Matemáticas, Inglés"
                  value={interests}
                  onChange={e => setInterests(e.target.value)}
                />
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                disabled={saving}
                style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}
              >
                {saving ? <Loader size={18} className="spin" /> : <Save size={18} />}
                {saving ? 'Guardando...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
