import { useState } from 'react';
import { UserPlus, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';

const Register = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState<'STUDENT' | 'TUTOR'>('STUDENT');

  // Extra fields for Tutor
  const [bio, setBio] = useState('');
  const [profilePictureUrl, setProfilePictureUrl] = useState('');
  const [identityCardUrl, setIdentityCardUrl] = useState('');
  const [degreeUrl, setDegreeUrl] = useState('');
  const [hourlyRate, setHourlyRate] = useState<number | ''>('');
  const [yearsOfExperience, setYearsOfExperience] = useState<number | ''>('');
  const [subjects, setSubjects] = useState('');

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (role === 'TUTOR') {
        const subjectList = subjects.split(',').map(s => s.trim()).filter(s => s !== '');

        await authApi.registerTutor({
          fullName, email, password,
          bio, profilePictureUrl, identityCardUrl, degreeUrl,
          hourlyRate: Number(hourlyRate),
          yearsOfExperience: Number(yearsOfExperience),
          subjects: subjectList
        });

        toast.success('¡Registro exitoso! Se ha enviado un mensaje a tu correo para su verificación y tu perfil de tutor está pendiente de revisión.', { duration: 8000 });
        setTimeout(() => navigate('/login'), 4000);
      } else {
        await authApi.register({ fullName, email, password, role });
        toast.success('¡Registro exitoso! Se ha enviado un mensaje a tu correo para su verificación. Revisa tu bandeja de entrada o spam.', { duration: 6000 });
        navigate('/login');
      }
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Error al registrarse. Verifica los datos o es posible que el correo ya esté en uso.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1rem' }}>
      <div className="auth-container glass-card" style={{ maxWidth: '540px', margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <UserPlus size={48} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h2>Crear cuenta</h2>
          <p style={{ color: 'var(--text-muted)' }}>Únete a la comunidad de SkillVibes</p>
        </div>

        <form onSubmit={handleRegister}>
          <div className="form-group">
            <label className="form-label">¿Cómo vas a participar?</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <label style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                border: `2px solid ${role === 'STUDENT' ? '#a855f7' : 'var(--border-color)'}`,
                background: role === 'STUDENT' ? 'rgba(168,85,247,0.1)' : 'transparent',
                textAlign: 'center', transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio" value="STUDENT" name="role"
                  checked={role === 'STUDENT'}
                  onChange={() => setRole('STUDENT')}
                  style={{ display: 'none' }}
                />
                🎓 Estudiante
              </label>
              <label style={{
                flex: 1, padding: '0.75rem', borderRadius: '8px', cursor: 'pointer',
                border: `2px solid ${role === 'TUTOR' ? '#a855f7' : 'var(--border-color)'}`,
                background: role === 'TUTOR' ? 'rgba(168,85,247,0.1)' : 'transparent',
                textAlign: 'center', transition: 'all 0.2s ease'
              }}>
                <input
                  type="radio" value="TUTOR" name="role"
                  checked={role === 'TUTOR'}
                  onChange={() => setRole('TUTOR')}
                  style={{ display: 'none' }}
                />
                👨‍🏫 Tutor
              </label>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="fullName">Nombre Completo</label>
            <input
              type="text" id="fullName" className="form-input"
              value={fullName} onChange={(e) => setFullName(e.target.value)}
              placeholder="Tu nombre completo" required maxLength={70}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-email">Correo Electrónico</label>
            <input
              type="email" id="reg-email" className="form-input"
              value={email} onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com" required autoComplete="email" maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="reg-password">Contraseña</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"} id="reg-password" className="form-input"
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres" minLength={6} maxLength={50} required autoComplete="new-password"
                style={{ paddingRight: '2.5rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '0.75rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                  padding: 0,
                  display: 'flex'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {role === 'TUTOR' && (
            <div style={{
              background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border-color)',
              padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem', marginTop: '0.5rem'
            }}>
              <h4 style={{ marginBottom: '1rem', color: '#a855f7' }}>📋 Perfil Profesional</h4>

              <div className="form-group">
                <label className="form-label" htmlFor="bio">Biografía Profesional (Mín. 50 caracteres)</label>
                <textarea
                  id="bio" className="form-input" rows={3}
                  value={bio} onChange={(e) => setBio(e.target.value)}
                  placeholder="Cuéntanos sobre ti, tu metodología y por qué los estudiantes deberían elegirte."
                  required={role === 'TUTOR'} minLength={50} maxLength={200}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="hourlyRate">Tarifa por Hora ($ COP)</label>
                  <input
                    type="number" id="hourlyRate" className="form-input"
                    value={hourlyRate}
                    onChange={(e) => {
                      if (e.target.value.length <= 10) {
                        setHourlyRate(e.target.value ? Number(e.target.value) : '');
                      }
                    }}
                    placeholder="Ej. 15500" required={role === 'TUTOR'} min="1" step="0.1"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="yearsOfExperience">Años de Exp.</label>
                  <input
                    type="number" id="yearsOfExperience" className="form-input"
                    value={yearsOfExperience} onChange={(e) => setYearsOfExperience(e.target.value ? Number(e.target.value) : '')}
                    placeholder="Ej. 3" required={role === 'TUTOR'} min="0"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="subjects">Materias (separadas por coma)</label>
                <input
                  type="text" id="subjects" className="form-input"
                  value={subjects} onChange={(e) => setSubjects(e.target.value)}
                  placeholder="Ej. Matemáticas, Física, Programación" required={role === 'TUTOR'}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profilePictureUrl">URL de Foto de Perfil</label>
                <input
                  type="url" id="profilePictureUrl" className="form-input"
                  value={profilePictureUrl} onChange={(e) => setProfilePictureUrl(e.target.value)}
                  placeholder="https://ejemplo.com/mifoto.jpg" required={role === 'TUTOR'}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="identityCardUrl">URL de Documento de Identidad</label>
                <input
                  type="url" id="identityCardUrl" className="form-input"
                  value={identityCardUrl} onChange={(e) => setIdentityCardUrl(e.target.value)}
                  placeholder="https://ejemplo.com/documento.pdf" required={role === 'TUTOR'}
                />
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="degreeUrl">URL de Título o Soporte Académico</label>
                <input
                  type="url" id="degreeUrl" className="form-input"
                  value={degreeUrl} onChange={(e) => setDegreeUrl(e.target.value)}
                  placeholder="https://ejemplo.com/certificado.pdf" required={role === 'TUTOR'}
                />
              </div>
            </div>
          )}

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Procesando...' : 'Registrarse'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          ¿Ya tienes una cuenta?{' '}
          <Link to="/login" style={{ color: '#a855f7', textDecoration: 'none' }}>Inicia Sesión</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;


