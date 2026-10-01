import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { SidebarProvider, useSidebar } from '../context/SidebarContext';
import Sidebar from '../components/Sidebar';
import TopBar from '../components/TopBar';
import Backdrop from '../components/Backdrop';

function LayoutContent() {
  const { isExpanded, isHovered, isMobileOpen } = useSidebar();

  return (
    <div className="clinical-page min-h-screen transition-colors duration-200">
      <Sidebar />
      <Backdrop />

      <div
        className={`flex-1 transition-[margin] duration-300 ease-in-out ${
          isExpanded || isHovered ? 'xl:ml-72' : 'xl:ml-20'
        } ${isMobileOpen ? 'ml-0' : ''}`}
      >
        <TopBar />
        <main className="mx-auto max-w-[1600px] p-4 sm:p-6 md:p-8">
          <div className="animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}

export default function AppLayout() {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <SidebarProvider>
      <LayoutContent />
    </SidebarProvider>
  );
}
