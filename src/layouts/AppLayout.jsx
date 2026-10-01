import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';

export default function AppLayout() {
  const { user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-base)', position: 'relative' }}>
      {/* Aurora background layer */}
      <div className="aurora-bg" aria-hidden="true">
        <div className="aurora-orb aurora-orb-1" />
        <div className="aurora-orb aurora-orb-2" />
      </div>

      {/* Subtle mesh overlay */}
      <div style={{
        position: 'fixed',
        inset: 0,
        backgroundImage: [
          'radial-gradient(at 15% 25%, rgba(14,165,233,0.06) 0px, transparent 55%)',
          'radial-gradient(at 85% 10%, rgba(99,102,241,0.06) 0px, transparent 55%)',
          'radial-gradient(at 40% 80%, rgba(139,92,246,0.05) 0px, transparent 55%)',
          'radial-gradient(at 75% 65%, rgba(6,182,212,0.04) 0px, transparent 45%)',
        ].join(','),
        pointerEvents: 'none',
        zIndex: 0,
      }} aria-hidden="true" />

      {/* Sidebar */}
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

      {/* Topbar */}
      <TopBar sidebarCollapsed={collapsed} />

      {/* Main Content */}
      <main
        className="transition-all"
        style={{
          paddingLeft: collapsed ? 'var(--sidebar-collapsed)' : 'var(--sidebar-width)',
          paddingTop: 'var(--topbar-height)',
          minHeight: '100vh',
          position: 'relative',
          zIndex: 1,
          transitionDuration: '300ms',
          transitionTimingFunction: 'cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        <div style={{ padding: '28px', maxWidth: '1600px' }} className="animate-fade-in">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
