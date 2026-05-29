import React, { useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { Lock, Eye, EyeOff, CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import api from '../services/api';

const ResetPassword: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token') || '';

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [tokenInvalid, setTokenInvalid] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPassword });
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch {
      setTokenInvalid(true);
      setError(err.response?.data?.message || 'El enlace expiró o no es válido. Solicita uno nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!token || tokenInvalid) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '2rem' }}>
        <div className="glass-card animate-scale-in" style={{ maxWidth: '460px', width: '100%', padding: '3rem', textAlign: 'center', border: '1px solid rgba(239,68,68,0.2)' }}>
          <div style={{
            width: '96px', height: '96px', borderRadius: '50%',
            background: 'rgba(239,68,68,0.1)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem'
          }}>
            <XCircle size={56} color="#ef4444" />
          </div>
          <h2 style={{ marginBottom: '1rem' }}>Enlace Inválido</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
            {error || 'Este enlace de recuperación expiró o no es válido.'}
          </p>
          <Link to="/forgot-password" className="btn btn-primary" style={{ display: 'block', padding: '0.9rem', textDecoration: 'none' }}>
            Solicitar nuevo enlace
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', justifyContent: 'center',
      alignItems: 'center', padding: '2rem'
    }}>
      <div className="glass-card animate-scale-in" style={{
        maxWidth: '460px', width: '100%', padding: '3rem',
        border: '1px solid rgba(168,85,247,0.2)'
      }}>
        {success ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.1)', display: 'flex',
              justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem'
            }}>
              <CheckCircle2 size={56} color="#10b981" />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Acción Válida</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              Tu contraseña ha sido cambiada con éxito. Serás redirigido al inicio de sesión en unos segundos...
            </p>
            <Link to="/login" className="btn btn-primary" style={{
              display: 'block', padding: '0.9rem', textDecoration: 'none', textAlign: 'center'
            }}>
              Ir al inicio de sesión
            </Link>
          </div>
        ) : (
          <>
            <div style={{ marginBottom: '2rem' }}>
              <div style={{
                width: '72px', height: '72px', borderRadius: '50%',
                background: 'linear-gradient(135deg,rgba(168,85,247,0.2),rgba(236,72,153,0.2))',
                display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '1.5rem'
              }}>
                <Lock size={36} color="var(--accent-primary)" />
              </div>
              <h1 style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>Nueva contraseña</h1>
              <p style={{ color: 'var(--text-muted)' }}>
                Crea una contraseña segura para tu cuenta.
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
                  Nueva contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute', left: '1rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                  }} />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="form-input"
                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{
                      position: 'absolute', right: '1rem', top: '50%',
                      transform: 'translateY(-50%)', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--text-muted)'
                    }}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 600 }}>
                  Confirmar contraseña
                </label>
                <div style={{ position: 'relative' }}>
                  <Lock size={18} style={{
                    position: 'absolute', left: '1rem', top: '50%',
                    transform: 'translateY(-50%)', color: 'var(--text-muted)'
                  }} />
                  <input
                    type={showConfirm ? 'text' : 'password'}
                    required
                    className="form-input"
                    style={{ paddingLeft: '3rem', paddingRight: '3rem' }}
                    placeholder="Repite tu nueva contraseña"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    style={{
                      position: 'absolute', right: '1rem', top: '50%',
                      transform: 'translateY(-50%)', background: 'none', border: 'none',
                      cursor: 'pointer', color: 'var(--text-muted)'
                    }}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {confirmPassword && newPassword !== confirmPassword && (
                  <p style={{ color: '#f87171', fontSize: '0.8rem', marginTop: '0.4rem' }}>
                    Las contraseñas no coinciden
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary"
                style={{ padding: '1rem', display: 'flex', justifyContent: 'center', gap: '0.5rem', alignItems: 'center', marginTop: '0.5rem' }}
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : 'Restablecer contraseña'}
              </button>
            </form>
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

export default ResetPassword;
