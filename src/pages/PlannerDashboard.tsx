import { useEffect, useState } from 'react';
import { Calendar, CheckCircle, Clock, AlertCircle, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Event } from '../lib/supabase';
import { Modal } from '../components/Modal';

export const PlannerDashboard = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadEvents();
    }
  }, [profile]);

  const loadEvents = async () => {
    const { data } = await supabase
      .from('events')
      .select('*')
      .eq('planner_id', profile!.id)
      .order('date', { ascending: true });

    if (data) setEvents(data);
    setLoading(false);
  };

  const getProgressPercentage = (status: string) => {
    switch (status) {
      case 'planning': return 25;
      case 'in_progress': return 60;
      case 'completed': return 100;
      default: return 0;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return CheckCircle;
      case 'in_progress': return Clock;
      case 'planning': return AlertCircle;
      default: return Calendar;
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
      <div className="animate-slide-down">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Event Planner Dashboard</h1>
        <p className="text-gray-600">Manage and coordinate all your assigned events</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-slide-up" style={{ animationDelay: '0ms' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Total Events</h3>
            <Calendar className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">{events.length}</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-slide-up" style={{ animationDelay: '50ms' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Planning</h3>
            <AlertCircle className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {events.filter(e => e.status === 'planning').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">In Progress</h3>
            <Clock className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {events.filter(e => e.status === 'in_progress').length}
          </p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 animate-slide-up" style={{ animationDelay: '150ms' }}>
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-medium text-gray-600">Completed</h3>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-gray-900">
            {events.filter(e => e.status === 'completed').length}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-bold text-gray-900">Assigned Events</h2>
        {events.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
            <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No events assigned</h3>
            <p className="text-gray-600">You'll see events here once they're assigned to you</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {events.map((event, index) => {
              const StatusIcon = getStatusIcon(event.status);
              const progress = getProgressPercentage(event.status);

              return (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 border border-gray-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                        <StatusIcon className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">{event.title}</h3>
                        <p className="text-sm text-gray-600">{event.event_type}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-blue-600 to-blue-800 h-full rounded-full transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(event.date).toLocaleDateString()}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedEvent(event);
                        setShowTaskModal(true);
                      }}
                      className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                    >
                      Update Task
                    </button>
                    <button className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200">
                      <MessageCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedEvent(null);
        }}
        title="Update Task"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
              <p className="text-sm text-gray-600">Update the event status and progress</p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Status</label>
              <select className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 bg-white">
                <option value="planning">Planning</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 mb-2">Task Note</label>
              <textarea
                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none"
                rows={4}
                placeholder="Add notes about this task..."
              />
            </div>
            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium transition-colors duration-200">
              Update Task
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
};