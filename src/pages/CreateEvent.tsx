import { useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, Sparkles } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

type CreateEventProps = {
  onEventCreated: () => void;
};

export const CreateEvent = ({ onEventCreated }: CreateEventProps) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    event_type: 'wedding',
    date: '',
    location: '',
    guest_count: '',
    budget: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const eventTypes = [
    'Wedding',
    'Birthday',
    'Corporate Event',
    'Anniversary',
    'Engagement',
    'Baby Shower',
    'Graduation',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase.from('events').insert([
        {
          client_id: profile!.id,
          title: formData.title,
          event_type: formData.event_type,
          date: new Date(formData.date).toISOString(),
          location: formData.location,
          guest_count: parseInt(formData.guest_count),
          budget: parseFloat(formData.budget),
          status: 'planning',
        },
      ]);

      if (error) throw error;

      setSuccess(true);
      setTimeout(() => {
        onEventCreated();
      }, 2000);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  if (success) {
    return (
      <div className="flex items-center justify-center h-full animate-fade-in">
        <div className="text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Created!</h2>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl mx-auto animate-fade-in">
      <div className="mb-8 animate-slide-down">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Event</h1>
        <p className="text-gray-600">Let's start planning your perfect celebration</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 space-y-6 animate-slide-up">
          <div className="animate-fade-in" style={{ animationDelay: '100ms' }}>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Event Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Sarah & John's Wedding"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '150ms' }}>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              Event Type
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white"
              required
            >
              {eventTypes.map((type) => (
                <option key={type} value={type.toLowerCase().replace(' ', '_')}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="animate-fade-in" style={{ animationDelay: '200ms' }}>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                <Calendar className="inline w-4 h-4 mr-2" />
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                required
              />
            </div>

            <div className="animate-fade-in" style={{ animationDelay: '250ms' }}>
              <label className="block text-sm font-semibold text-gray-900 mb-3">
                <Users className="inline w-4 h-4 mr-2" />
                Guest Count
              </label>
              <input
                type="number"
                name="guest_count"
                value={formData.guest_count}
                onChange={handleChange}
                placeholder="e.g., 150"
                min="1"
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '300ms' }}>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <MapPin className="inline w-4 h-4 mr-2" />
              Location
            </label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Grand Ballroom, Downtown"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
              required
            />
          </div>

          <div className="animate-fade-in" style={{ animationDelay: '350ms' }}>
            <label className="block text-sm font-semibold text-gray-900 mb-3">
              <DollarSign className="inline w-4 h-4 mr-2" />
              Estimated Budget
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">
                $
              </span>
              <input
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="e.g., 25000"
                min="0"
                step="100"
                className="w-full pl-8 pr-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200"
                required
              />
            </div>
          </div>
        </div>

        {formData.budget && (
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Budget</p>
                <p className="text-3xl font-bold">
                  ${parseFloat(formData.budget).toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-12 h-12 opacity-50" />
            </div>
          </div>
        )}

        <div className="flex gap-4 animate-slide-up" style={{ animationDelay: '400ms' }}>
          <button
            type="button"
            onClick={() => onEventCreated()}
            className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-all duration-200 hover:scale-[1.02]"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="flex-1 bg-gradient-to-r from-blue-600 to-blue-800 text-white py-3 px-6 rounded-xl font-medium shadow-lg shadow-blue-200 hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating Event...' : 'Create Event'}
          </button>
        </div>
      </form>
    </div>
  );
};