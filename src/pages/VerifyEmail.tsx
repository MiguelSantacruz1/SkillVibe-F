import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Loader2, Mail } from 'lucide-react';
import api from '../services/api';

type Status = 'loading' | 'success' | 'error';

const VerifyEmail: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('El enlace de verificación no es válido.');
      return;
    }

    api.get(`/auth/verify-email?token=${token}`)
      .then(() => {
        setStatus('success');
        setMessage('¡Tu cuenta ha sido verificada exitosamente!');
      })
      .catch((err: any) => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'El enlace expiró o no es válido. Solicita uno nuevo.');
      });
  }, [searchParams]);

  return (
    <div style={{
      minHeight: '80vh', display: 'flex', justifyContent: 'center',
      alignItems: 'center', padding: '2rem'
    }}>
      <div className="glass-card animate-scale-in" style={{
        maxWidth: '480px', width: '100%', padding: '3rem',
        textAlign: 'center', border: '1px solid rgba(168,85,247,0.2)'
      }}>

        {status === 'loading' && (
          <>
            <Loader2 size={64} className="animate-spin" style={{ color: 'var(--accent-primary)', margin: '0 auto 1.5rem' }} />
            <h2 style={{ marginBottom: '0.5rem' }}>Verificando tu correo...</h2>
            <p style={{ color: 'var(--text-muted)' }}>Por favor espera un momento.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'rgba(16,185,129,0.1)', display: 'flex',
              justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem'
            }}>
              <CheckCircle2 size={56} color="#10b981" />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Acción Válida</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
              {message} Ya puedes iniciar sesión con tu cuenta.
            </p>
            <Link to="/login" className="btn btn-primary" style={{
              display: 'inline-block', padding: '0.9rem 2.5rem', textDecoration: 'none'
            }}>
              Iniciar Sesión
            </Link>
          </>
        )}

        {status === 'error' && (
          <>
            <div style={{
              width: '96px', height: '96px', borderRadius: '50%',
              background: 'rgba(239,68,68,0.1)', display: 'flex',
              justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem'
            }}>
              <XCircle size={56} color="#ef4444" />
            </div>
            <h2 style={{ marginBottom: '0.75rem' }}>Enlace Inválido</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{message}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-primary" style={{
                display: 'block', padding: '0.9rem', textDecoration: 'none', textAlign: 'center'
              }}>
                Ir al inicio de sesión
              </Link>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                ¿El enlace expiró?{' '}
                <Link to="/resend-verification" style={{ color: 'var(--accent-primary)' }}>
                  Solicitar uno nuevo
                </Link>
              </p>
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

export default VerifyEmail;
