import { Home, Calendar, Users, Settings, LogOut, Sparkles, BarChart3 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type SidebarProps = {
  currentPage: string;
  onNavigate: (page: string) => void;
};

export const Sidebar = ({ currentPage, onNavigate }: SidebarProps) => {
  const { profile, signOut } = useAuth();

  const menuItems = [
    { id: 'dashboard', icon: Home, label: 'Dashboard' },
    { id: 'create-event', icon: Calendar, label: 'Create Event', roles: ['client'] },
    { id: 'vendors', icon: Users, label: 'Vendors & Services' },
    { id: 'admin', icon: BarChart3, label: 'Admin Panel', roles: ['admin'] },
  ];

  const filteredItems = menuItems.filter(
    item => !item.roles || (profile && item.roles.includes(profile.role))
  );

  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 flex flex-col animate-slide-right">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Jashn</h1>
            <p className="text-xs text-gray-500">Event Management</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {filteredItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="p-4 border-t border-gray-200 space-y-1">
        <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 font-medium transition-all duration-200">
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 font-medium transition-all duration-200"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  );
};