import { useState, useEffect } from 'react';
import { CreditCard, DollarSign, History, Loader2, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { paymentApi } from '../services/api';
import { useAuth } from '../context/AuthContext';

const AddBalance = () => {
  const { user, fetchUserData } = useAuth();
  const [amount, setAmount] = useState<number>(50000);
  const [loading, setLoading] = useState(false);
  const [history, setHistory] = useState<unknown[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const loadHistory = async () => {
    try {
      const { data } = await paymentApi.getHistory();
      setHistory(data);
    } catch (err) {
      console.error("Error al cargar el historial", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadHistory();
     
    fetchUserData();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRecharge = async () => {
    setLoading(true);
    try {
      await paymentApi.createCheckout(amount);
      toast.success(`Recarga simulada exitosa por $${amount.toLocaleString('es-CO')} COP`);
      await fetchUserData(); // Refresh balance
      await loadHistory();   // Refresh history
    } catch {
      toast.error("Error al procesar la recarga.");
    } finally {
      setLoading(false);
    }
  };

  const amounts = [20000, 50000, 100000, 200000];

  return (
    <div className="container animate-fade-in" style={{ maxWidth: '1000px', paddingTop: '3rem' }}>
      <div style={{ marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Billetera SkillVibe</h1>
        <p style={{ color: 'var(--text-muted)' }}>Agrega saldo para reservar tus clases o revisa tu historial de transacciones.</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        
        {/* Recharge Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, rgba(168,85,247,0.1) 0%, rgba(236,72,153,0.1) 100%)' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Saldo Disponible</p>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
              ${user?.balance?.toLocaleString('es-CO')} COP
            </h2>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <CreditCard size={20} color="var(--accent-primary)" /> Recargar Saldo
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.5rem' }}>
              {amounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt)}
                  style={{
                    padding: '1rem',
                    borderRadius: '12px',
                    border: amount === amt ? '2px solid var(--accent-primary)' : '1px solid rgba(255,255,255,0.1)',
                    background: amount === amt ? 'rgba(168,85,247,0.1)' : 'transparent',
                    color: amount === amt ? 'var(--accent-primary)' : 'var(--text-color)',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  ${amt.toLocaleString('es-CO')}
                </button>
              ))}
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>Monto Personalizado (COP)</label>
              <div style={{ position: 'relative' }}>
                <DollarSign size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="number" 
                  className="form-input" 
                  style={{ paddingLeft: '3rem' }}
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value))}
                />
              </div>
            </div>

            <button 
              onClick={handleRecharge}
              disabled={loading || amount <= 0}
              className="btn btn-primary" 
              style={{ width: '100%', padding: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <><DollarSign size={20} /> Recargar Ahora</>}
            </button>
            
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center', marginTop: '1rem' }}>
              Pago procesado mediante <strong>Simulación (Sin cobro real)</strong>.
            </p>
          </div>
        </div>

        {/* History Card */}
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
          <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <History size={20} color="var(--accent-primary)" /> Historial de Transacciones
          </h3>

          <div style={{ flex: 1, overflowY: 'auto', maxHeight: '500px' }}>
            {loadingHistory ? (
              <div style={{ display: 'flex', justifyContent: 'center', padding: '3rem' }}>
                <Loader2 className="animate-spin" color="var(--accent-primary)" />
              </div>
            ) : history.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                Aún no tienes transacciones.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {history.map((tx) => (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      display: 'flex', justifyContent: 'center', alignItems: 'center',
                      background: tx.type === 'LOAD' || tx.type === 'EARNING' ? 'rgba(16,185,129,0.1)' : 'rgba(248,113,113,0.1)',
                      color: tx.type === 'LOAD' || tx.type === 'EARNING' ? '#10b981' : '#f87171'
                    }}>
                      {tx.type === 'LOAD' || tx.type === 'EARNING' ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.1rem' }}>{tx.description}</p>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {new Date(tx.timestamp).toLocaleDateString('es-CO')} · {new Date(tx.timestamp).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ 
                        fontWeight: 700, 
                        color: tx.type === 'LOAD' || tx.type === 'EARNING' ? '#10b981' : '#f87171' 
                      }}>
                        {tx.type === 'LOAD' || tx.type === 'EARNING' ? '+' : '-'}${tx.amount.toLocaleString('es-CO')} COP
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBalance;
