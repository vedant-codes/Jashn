import { useEffect, useState } from 'react';
import { Search, Star, DollarSign, Filter, ShoppingCart } from 'lucide-react';
import { supabase, Vendor } from '../lib/supabase';
import { Drawer } from '../components/Drawer';

export const Vendors = () => {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [filteredVendors, setFilteredVendors] = useState<Vendor[]>([]);
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [priceFilter, setPriceFilter] = useState('all');
  const [cart, setCart] = useState<Array<{ vendor: Vendor; service: { name: string; price: number } }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVendors();
  }, []);

  useEffect(() => {
    filterVendors();
  }, [vendors, searchTerm, categoryFilter, priceFilter]);

  const loadVendors = async () => {
    const { data, error } = await supabase
      .from('vendors')
      .select('*')
      .order('rating', { ascending: false });

    if (!error && data) {
      setVendors(data);
      setFilteredVendors(data);
    }
    setLoading(false);
  };

  const filterVendors = () => {
    let filtered = vendors;

    if (searchTerm) {
      filtered = filtered.filter(
        (v) =>
          v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          v.category.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (categoryFilter !== 'all') {
      filtered = filtered.filter((v) => v.category === categoryFilter);
    }

    if (priceFilter !== 'all') {
      filtered = filtered.filter((v) => v.price_range === priceFilter);
    }

    setFilteredVendors(filtered);
  };

  const categories = ['all', 'catering', 'photography', 'decoration', 'venue', 'entertainment'];
  const priceRanges = ['all', '$', '$$', '$$$', '$$$$'];

  const addToCart = (vendor: Vendor, service: { name: string; price: number }) => {
    setCart([...cart, { vendor, service }]);
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const getTotalBudget = () => {
    return cart.reduce((total, item) => total + item.service.price, 0);
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Vendors & Services</h1>
          <p className="text-gray-600">Find and book the perfect vendors for your event</p>
        </div>
        <div className="relative">
          <button className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02]">
            <ShoppingCart className="w-5 h-5" />
            Cart ({cart.length})
          </button>
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-yellow-500 text-white text-xs font-bold rounded-full flex items-center justify-center animate-pulse">
              {cart.length}
            </span>
          )}
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 space-y-4 animate-slide-up">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search vendors or services..."
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
          />
        </div>

        <div className="flex gap-3 flex-wrap">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-500" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-sm"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 focus:border-blue-500 outline-none transition-all duration-200 bg-white text-sm"
          >
            {priceRanges.map((range) => (
              <option key={range} value={range}>
                {range === 'all' ? 'All Prices' : range}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length === 0 ? (
          <div className="col-span-full bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your filters</p>
          </div>
        ) : (
          filteredVendors.map((vendor, index) => (
            <div
              key={vendor.id}
              onClick={() => setSelectedVendor(vendor)}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] cursor-pointer border border-gray-200 overflow-hidden animate-slide-up"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                {vendor.image_url ? (
                  <img src={vendor.image_url} alt={vendor.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="text-6xl">🎉</div>
                )}
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">{vendor.name}</h3>
                    <p className="text-sm text-gray-600 capitalize">{vendor.category}</p>
                  </div>
                  <span className="text-yellow-500 font-semibold text-sm">{vendor.price_range}</span>
                </div>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                  {vendor.description || 'Professional services for your special event'}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-semibold text-gray-900">{vendor.rating}</span>
                  </div>
                  <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {cart.length > 0 && (
        <div className="fixed bottom-8 right-8 bg-white rounded-2xl shadow-2xl border border-gray-200 p-6 w-80 animate-slide-up">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Budget Estimator</h3>
            <DollarSign className="w-5 h-5 text-blue-600" />
          </div>
          <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
            {cart.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-gray-600">{item.service.name}</span>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">${item.service.price.toLocaleString()}</span>
                  <button
                    onClick={() => removeFromCart(index)}
                    className="text-red-500 hover:text-red-700 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div className="pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-blue-600">${getTotalBudget().toLocaleString()}</span>
            </div>
            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-medium hover:shadow-lg transition-all duration-200">
              Proceed to Booking
            </button>
          </div>
        </div>
      )}

      <Drawer
        isOpen={!!selectedVendor}
        onClose={() => setSelectedVendor(null)}
        title={selectedVendor?.name || ''}
      >
        {selectedVendor && (
          <div className="space-y-6">
            <div className="h-64 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center -mx-6 -mt-6 mb-6">
              {selectedVendor.image_url ? (
                <img src={selectedVendor.image_url} alt={selectedVendor.name} className="w-full h-full object-cover rounded-t-2xl" />
              ) : (
                <div className="text-8xl">🎉</div>
              )}
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-600 capitalize">{selectedVendor.category}</span>
                <span className="text-yellow-500 font-bold">{selectedVendor.price_range}</span>
              </div>
              <div className="flex items-center gap-2 mb-4">
                <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                <span className="text-lg font-bold text-gray-900">{selectedVendor.rating}</span>
                <span className="text-gray-600">• 250+ reviews</span>
              </div>
              <p className="text-gray-700 leading-relaxed">
                {selectedVendor.description || 'Professional services tailored to make your event unforgettable. Our experienced team ensures every detail is perfect.'}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-4">Available Services</h3>
              <div className="space-y-3">
                {selectedVendor.services && Array.isArray(selectedVendor.services) && selectedVendor.services.length > 0 ? (
                  selectedVendor.services.map((service: { name: string; price: number }, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200"
                    >
                      <div>
                        <p className="font-semibold text-gray-900">{service.name}</p>
                        <p className="text-sm text-gray-600">${service.price.toLocaleString()}</p>
                      </div>
                      <button
                        onClick={() => addToCart(selectedVendor, service)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div>
                        <p className="font-semibold text-gray-900">Basic Package</p>
                        <p className="text-sm text-gray-600">$2,500</p>
                      </div>
                      <button
                        onClick={() => addToCart(selectedVendor, { name: 'Basic Package', price: 2500 })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200">
                      <div>
                        <p className="font-semibold text-gray-900">Premium Package</p>
                        <p className="text-sm text-gray-600">$5,000</p>
                      </div>
                      <button
                        onClick={() => addToCart(selectedVendor, { name: 'Premium Package', price: 5000 })}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>

            <button className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200">
              Contact Vendor
            </button>
          </div>
        )}
      </Drawer>
    </div>
  );
};