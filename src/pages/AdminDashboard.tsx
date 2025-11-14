import { useEffect, useState } from 'react';
import { Users, Calendar, DollarSign, TrendingUp, UserPlus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { Modal } from '../components/Modal';

export const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalVendors: 0,
    totalClients: 0,
    totalRevenue: 0,
  });
  const [showAddVendor, setShowAddVendor] = useState(false);
  const [vendorForm, setVendorForm] = useState({
    name: '',
    category: 'catering',
    description: '',
    rating: '4.5',
    price_range: '$$',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [eventsCount, vendorsCount, profilesCount] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }),
      supabase.from('vendors').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      totalEvents: eventsCount.count || 0,
      totalVendors: vendorsCount.count || 0,
      totalClients: profilesCount.count || 0,
      totalRevenue: 0,
    });
    setLoading(false);
  };

  const handleAddVendor = async (e: React.FormEvent) => {
    e.preventDefault();

    const { error } = await supabase.from('vendors').insert([
      {
        ...vendorForm,
        rating: parseFloat(vendorForm.rating),
        services: [
          { name: 'Basic Package', price: 2500 },
          { name: 'Premium Package', price: 5000 },
        ],
      },
    ]);

    if (!error) {
      setShowAddVendor(false);
      setVendorForm({
        name: '',
        category: 'catering',
        description: '',
        rating: '4.5',
        price_range: '$$',
      });
      loadStats();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6 animate-fade-in">
      <div className="flex items-center justify-between animate-slide-down">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform operations and analytics</p>
        </div>
        <button
          onClick={() => setShowAddVendor(true)}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
        >
          <UserPlus className="w-5 h-5" />
          Add Vendor
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center justify-between mb-3">
            <Calendar className="w-8 h-8 opacity-90" />
            <TrendingUp className="w-5 h-5 opacity-75" />
          </div>
          <h3 className="text-3xl font-bold mb-1">{stats.totalEvents}</h3>
          <p className="text-blue-100 text-sm">Total Events</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalVendors}</h3>
          <p className="text-gray-600 text-sm">Total Vendors</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-3">
            <Users className="w-8 h-8 text-blue-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{stats.totalClients}</h3>
          <p className="text-gray-600 text-sm">Total Users</p>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-3">
            <DollarSign className="w-8 h-8 text-green-600" />
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <h3 className="text-3xl font-bold text-gray-900 mb-1">${stats.totalRevenue.toLocaleString()}</h3>
          <p className="text-gray-600 text-sm">Total Revenue</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Event Distribution</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Weddings</span>
                <span className="text-sm font-bold text-gray-900">45%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-full rounded-full" style={{ width: '45%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Corporate Events</span>
                <span className="text-sm font-bold text-gray-900">30%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-full rounded-full" style={{ width: '30%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Birthdays</span>
                <span className="text-sm font-bold text-gray-900">15%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-full rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600">Other</span>
                <span className="text-sm font-bold text-gray-900">10%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gradient-to-r from-blue-600 to-blue-800 h-full rounded-full" style={{ width: '10%' }} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-slide-up" style={{ animationDelay: '250ms' }}>
          <h2 className="text-xl font-bold text-gray-900 mb-6">Monthly Revenue</h2>
          <div className="space-y-4">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => {
              const value = 20 + Math.random() * 60;
              return (
                <div key={month}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-600">{month}</span>
                    <span className="text-sm font-bold text-gray-900">${(value * 1000).toFixed(0)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-gradient-to-r from-green-500 to-green-600 h-full rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <Modal
        isOpen={showAddVendor}
        onClose={() => setShowAddVendor(false)}
        title="Add New Vendor"
      >
        <form onSubmit={handleAddVendor} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Vendor Name</label>
            <input
              type="text"
              value={vendorForm.name}
              onChange={(e) => setVendorForm({ ...vendorForm, name: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Category</label>
            <select
              value={vendorForm.category}
              onChange={(e) => setVendorForm({ ...vendorForm, category: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
            >
              <option value="catering">Catering</option>
              <option value="photography">Photography</option>
              <option value="decoration">Decoration</option>
              <option value="venue">Venue</option>
              <option value="entertainment">Entertainment</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Description</label>
            <textarea
              value={vendorForm.description}
              onChange={(e) => setVendorForm({ ...vendorForm, description: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none"
              rows={3}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Rating</label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="5"
                value={vendorForm.rating}
                onChange={(e) => setVendorForm({ ...vendorForm, rating: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Price Range</label>
              <select
                value={vendorForm.price_range}
                onChange={(e) => setVendorForm({ ...vendorForm, price_range: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
              >
                <option value="$">$</option>
                <option value="$$">$$</option>
                <option value="$$$">$$$</option>
                <option value="$$$$">$$$$</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]"
          >
            Add Vendor
          </button>
        </form>
      </Modal>
    </div>
  );
};