import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import BrowseTutors from './pages/BrowseTutors';
import VirtualClassroom from './pages/VirtualClassroom';
import TutorSettings from './pages/TutorSettings';
import AddBalance from './pages/AddBalance';
import AdminDashboard from './pages/AdminDashboard';
import VerifyEmail from './pages/VerifyEmail';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import CommunityFeed from './pages/CommunityFeed';
import StudentProfile from './pages/StudentProfile';
import { Toaster } from 'react-hot-toast';
import { NotificationProvider } from './context/NotificationContext';
import NotificationBell from './components/NotificationBell';
import './App.css';

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (user?.role !== 'ROLE_ADMIN' && user?.role !== 'ADMIN') return <Navigate to="/" replace />;
  return children;
}

function PublicRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return children;
}

function NavBar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="nav-brand">
        <img src="/logo.png" alt="SkillVibes Logo" className="nav-logo" />
        SkillVibes
      </Link>
      <div className="nav-links" style={{ alignItems: 'center' }}>
        <Link to="/" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Inicio</Link>
        {isAuthenticated ? (
          <>
            {(user?.role !== 'ROLE_ADMIN' && user?.role !== 'ADMIN') && (
              <Link to="/dashboard" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Mis Clases</Link>
            )}
            <Link to="/community" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Comunidad</Link>
            {(user?.role === 'STUDENT' || user?.role === 'ROLE_STUDENT') && (
              <Link to="/student/profile" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Mi Perfil</Link>
            )}
            {user?.role === 'ROLE_STUDENT' && (
              <Link to="/wallet" className="nav-link" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <span style={{ background: 'rgba(168,85,247,0.1)', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
                  ${user?.balance?.toLocaleString('es-CO')}
                </span>
              </Link>
            )}
            {user?.role === 'ROLE_TUTOR' && (
              <Link to="/tutor/settings" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Configuración de Perfil</Link>
            )}
            {(user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN') && (
              <Link to="/admin" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Panel de Admin</Link>
            )}
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', borderLeft: '1px solid var(--border-color)', paddingLeft: '1rem', marginLeft: '0.5rem' }}>
              <NotificationBell />
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.2rem 0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '50px', border: '1px solid rgba(255,255,255,0.05)' }}>
                <img 
                  src={`https://ui-avatars.com/api/?name=${user?.fullName || 'User'}&background=a855f7&color=fff&bold=true`} 
                  alt="Avatar" 
                  style={{ width: '32px', height: '32px', borderRadius: '50%', border: '2px solid rgba(168,85,247,0.4)', boxShadow: '0 2px 8px rgba(168,85,247,0.2)' }}
                />
                <div style={{ display: 'flex', flexDirection: 'column', paddingRight: '0.5rem' }}>
                  <span style={{ fontSize: '0.9rem', fontWeight: 600, lineHeight: '1.2', color: 'var(--text-color)' }}>
                    {user?.fullName}
                  </span>
                  <span style={{ fontSize: '0.7rem', color: '#a855f7', fontWeight: 500, letterSpacing: '0.05em' }}>
                    {user?.role?.replace('ROLE_', '') || 'USUARIO'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleLogout}
                className="btn"
                style={{ 
                  padding: '0.4rem 1rem', 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: '1px solid rgba(239, 68, 68, 0.4)', 
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: '#f87171',
                  borderRadius: '9999px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Cerrar Sesión
              </button>
            </div>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>Iniciar Sesión</Link>
            <Link to="/register" className="btn btn-primary" style={{ padding: '0.5rem 1rem', opacity: 0.75 }}>
              Registrarse
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Toaster position="top-center" reverseOrder={false} />
        <Router>
          <div className="app-container">
            <NavBar />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
                <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/browse" element={<BrowseTutors />} />
                <Route path="/classroom/:id" element={<VirtualClassroom />} />
                <Route path="/tutor/settings" element={<TutorSettings />} />
                <Route path="/wallet" element={<AddBalance />} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/community" element={<CommunityFeed />} />
                <Route path="/student/profile" element={<StudentProfile />} />
              </Routes>
            </main>
          </div>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;
