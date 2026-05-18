import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import api from '../services/api';

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post('/auth/forgot-password', { email });
      setSent(true);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Ocurrió un error. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', justifyContent: 'center',
      alignItems: 'center', padding: '2rem'
    }}>
      <div className="glass-card animate-scale-in" style={{
        maxWidth: '460px', width: '100%', padding: '3rem',
        border: '1px solid rgba(168,85,247,0.2)'
      }}>
        {sent ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'rgba(168,85,247,0.1)', display: 'flex',
              justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem'
            }}>
              <CheckCircle2 size={56} color="#a855f7" />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>¡Correo enviado!</h2>
            <p style={{ color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Si existe una cuenta con el correo <strong>{email}</strong>, recibirás un enlace
              para restablecer tu contraseña. Revisa también tu carpeta de spam.
            </p>
            <Link to="/login" className="btn btn-primary" style={{
              display: 'block', padding: '0.9rem', textDecoration: 'none', textAlign: 'center'
            }}>
              Volver al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(236,72,153,0.2))',
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem'
              }}>
                <Mail size={36} color="var(--accent-primary)" />
              </div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>¿Olvidaste tu contraseña?</h1>
              <p style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
                Ingresa tu correo y te enviaremos un enlace para crear una nueva contraseña.
              </p>
            </div>

            {error && (
              <div style={{
                background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '12px', padding: '0.75rem 1rem', marginBottom: '1.5rem',
                color: '#f87171', fontSize: '0.9rem'
              }}>
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Correo electrónico
                </label>
                <div style={{ position: 'relative' }}>
                  <Mail size={18} style={{
                    position: 'absolute', left: '1rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                  }} />
                  <input
                    type="email"
                    required
                    className="form-input"
                    style={{ paddingLeft: '3rem' }}
                    placeholder="tuemail@ejemplo.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Enviar enlace de recuperación'}
              </button>
            </form>

            <div style={{ marginTop: '2rem', textAlign: 'center' }}>
              <Link to="/login" style={{
                display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
                color: 'var(--text-muted)', fontSize: '0.9rem', textDecoration: 'none'
              }}>
                <ArrowLeft size={16} /> Volver al inicio de sesión
              </Link>
            </div>
          </>
        )}
      </div>

      <style>{`
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        .animate-scale-in { animation: scaleIn 0.3s ease; }
        @keyframes scaleIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
      `}</style>
    </div>
  );
};

export default ForgotPassword;
