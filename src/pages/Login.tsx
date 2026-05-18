import { useState } from 'react';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import { useNavigate, Link } from 'react-router-dom';
import { authApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login({ email, password });
      login(data.token, data.user);
      toast.success('¡Bienvenido de nuevo!');
      navigate('/dashboard');
    } catch (err: unknown) {
      const message =
        (err as { response?: { data?: { message?: string } } })?.response?.data?.message ??
        'Credenciales inválidas. Verifica tu correo y contraseña.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container animate-fade-in">
      <div className="auth-container glass-card">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <LogIn size={48} color="#a855f7" style={{ marginBottom: '1rem' }} />
          <h2>Bienvenido de nuevo</h2>
          <p style={{ color: 'var(--text-muted)' }}>Inicia sesión en tu cuenta de SkillVibes</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Correo Electrónico</label>
            <input
              type="email"
              id="email"
              className="form-input"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              required
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label className="form-label" htmlFor="password" style={{ margin: 0 }}>Contraseña</label>
              <Link to="/forgot-password" style={{ fontSize: '0.8rem', color: '#a855f7', textDecoration: 'none' }}>
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
            <input
              type="password"
              id="password"
              className="form-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Tu contraseña"
              required
              autoComplete="current-password"
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '1rem' }}
            disabled={loading}
          >
            {loading ? 'Autenticando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <span>
            ¿No tienes una cuenta?{' '}
            <Link to="/register" style={{ color: '#a855f7', textDecoration: 'none' }}>Regístrate aquí</Link>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Login;
