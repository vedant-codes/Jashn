import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Auth } from './pages/Auth';
import { ClientDashboard } from './pages/ClientDashboard';
import { CreateEvent } from './pages/CreateEvent';
import { Vendors } from './pages/Vendors';
import { PlannerDashboard } from './pages/PlannerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Sidebar } from './components/Sidebar';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user || !profile) {
    return <Auth />;
  }

  const renderPage = () => {
    if (profile.role === 'planner') {
      return <PlannerDashboard />;
    }

    if (profile.role === 'admin') {
      if (currentPage === 'admin') {
        return <AdminDashboard />;
      }
    }

    switch (currentPage) {
      case 'dashboard':
        return <ClientDashboard />;
      case 'create-event':
        return <CreateEvent onEventCreated={() => setCurrentPage('dashboard')} />;
      case 'vendors':
        return <Vendors />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <ClientDashboard />;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentPage={currentPage} onNavigate={setCurrentPage} />
      <main className="flex-1 overflow-y-auto">
        {renderPage()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
