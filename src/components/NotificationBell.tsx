import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Info } from 'lucide-react';
import { useNotifications } from '../context/NotificationContext';

const NotificationBell: React.FC = () => {
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ position: 'relative' }} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn"
        style={{ 
          position: 'relative', 
          padding: '0.6rem', 
          background: isOpen ? 'rgba(168,85,247,0.15)' : 'transparent', 
          border: 'none', 
          color: isOpen ? 'var(--accent-primary)' : 'var(--text-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '50%',
          transition: 'all 0.3s ease',
          cursor: 'pointer'
        }}
        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
        onMouseLeave={(e) => {
          if (!isOpen) e.currentTarget.style.background = 'transparent';
        }}
        aria-label="Notificaciones"
      >
        <Bell size={20} style={{ transition: 'transform 0.3s', transform: isOpen ? 'rotate(15deg)' : 'rotate(0)' }} />
        {unreadCount > 0 && (
          <span style={{
            position: 'absolute',
            top: '0',
            right: '0',
            background: 'linear-gradient(135deg, #f43f5e 0%, #e11d48 100%)',
            color: 'white',
            fontSize: '0.65rem',
            fontWeight: 'bold',
            padding: '0.15rem 0.4rem',
            borderRadius: '12px',
            transform: 'translate(20%, -20%)',
            boxShadow: '0 0 10px rgba(225, 29, 72, 0.5)',
            border: '2px solid var(--bg-color)'
          }}>
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div style={{
          position: 'absolute',
          right: '0',
          top: 'calc(100% + 0.8rem)',
          width: '360px',
          background: 'rgba(15, 23, 42, 0.85)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '16px',
          boxShadow: '0 20px 40px -10px rgba(0,0,0,0.5), 0 0 20px rgba(168,85,247,0.1)',
          zIndex: 50,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          animation: 'dropdownFade 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards',
          transformOrigin: 'top right'
        }}>
          <style>{`
            @keyframes dropdownFade {
              from { opacity: 0; transform: translateY(-10px) scale(0.95); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
            .notif-item {
              transition: all 0.2s ease;
            }
            .notif-item:hover {
              background: rgba(255,255,255,0.03) !important;
            }
            .notif-list::-webkit-scrollbar {
              width: 6px;
            }
            .notif-list::-webkit-scrollbar-track {
              background: transparent;
            }
            .notif-list::-webkit-scrollbar-thumb {
              background: rgba(255,255,255,0.1);
              border-radius: 10px;
            }
            .notif-list::-webkit-scrollbar-thumb:hover {
              background: rgba(255,255,255,0.2);
            }
          `}</style>

          <div style={{ 
            padding: '1.2rem 1.5rem', 
            borderBottom: '1px solid rgba(255,255,255,0.08)', 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            background: 'linear-gradient(to right, rgba(255,255,255,0.02), transparent)'
          }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, letterSpacing: '-0.3px' }}>Notificaciones</h3>
            {unreadCount > 0 && (
              <button
                onClick={() => markAllAsRead()}
                style={{
                  background: 'rgba(168,85,247,0.1)',
                  border: '1px solid rgba(168,85,247,0.2)',
                  color: '#e879f9',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  cursor: 'pointer',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '20px',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(168,85,247,0.2)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(168,85,247,0.1)'}
              >
                <Check size={14} />
                Marcar leídas
              </button>
            )}
          </div>
          
          <div className="notif-list" style={{ maxHeight: '380px', overflowY: 'auto' }}>
            {notifications.length === 0 ? (
              <div style={{ padding: '4rem 2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div style={{ 
                  width: '64px', height: '64px', borderRadius: '50%', 
                  background: 'rgba(255,255,255,0.03)', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  margin: '0 auto 1.2rem auto'
                }}>
                  <Bell size={28} style={{ opacity: 0.4 }} />
                </div>
                <p style={{ margin: 0, fontSize: '1rem', fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>Estás al día</p>
                <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.85rem', opacity: 0.6 }}>No tienes notificaciones nuevas por ahora.</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className="notif-item"
                    style={{
                      padding: '1.2rem 1.5rem',
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      background: notif.isRead ? 'transparent' : 'rgba(168,85,247,0.04)',
                      display: 'flex',
                      gap: '1rem',
                      cursor: 'pointer',
                      position: 'relative',
                    }}
                    onClick={() => { if (!notif.isRead) markAsRead(notif.id) }}
                  >
                    {!notif.isRead && (
                      <div style={{ 
                        position: 'absolute', left: 0, top: 0, bottom: 0, width: '3px', 
                        background: 'var(--accent-primary)',
                        boxShadow: '0 0 10px rgba(168,85,247,0.5)'
                      }} />
                    )}
                    
                    <div style={{
                      width: '36px', height: '36px', borderRadius: '50%',
                      background: notif.isRead ? 'rgba(255,255,255,0.05)' : 'rgba(168,85,247,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                      color: notif.isRead ? 'rgba(255,255,255,0.4)' : '#e879f9'
                    }}>
                      <Info size={18} />
                    </div>

                    <div style={{ flex: 1 }}>
                      <p style={{ 
                        margin: '0 0 0.3rem 0', 
                        fontSize: '0.95rem', 
                        fontWeight: notif.isRead ? 500 : 600,
                        color: notif.isRead ? 'rgba(255,255,255,0.8)' : '#fff',
                        lineHeight: 1.3
                      }}>
                        {notif.title}
                      </p>
                      <p style={{ 
                        margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.5)',
                        lineHeight: 1.4
                      }}>
                        {notif.message}
                      </p>
                      <p style={{ 
                        margin: '0.6rem 0 0 0', fontSize: '0.75rem', 
                        color: notif.isRead ? 'rgba(255,255,255,0.3)' : 'rgba(168,85,247,0.6)', 
                        fontWeight: 500
                      }}>
                        {new Date(notif.createdAt).toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}
                      </p>
                    </div>
                    
                    {!notif.isRead && (
                      <div style={{ 
                        width: '8px', height: '8px', borderRadius: '50%', 
                        background: 'var(--accent-primary)', marginTop: '0.4rem', flexShrink: 0,
                        boxShadow: '0 0 8px rgba(168,85,247,0.8)'
                      }} />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default NotificationBell;
