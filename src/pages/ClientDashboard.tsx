import { useEffect, useState } from 'react';
import { Calendar, MapPin, Users, DollarSign, MessageCircle, Star, Bell, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase, Event, Notification } from '../lib/supabase';
import { Modal } from '../components/Modal';
import { Drawer } from '../components/Drawer';

export const ClientDashboard = () => {
  const { profile } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showChat, setShowChat] = useState(false);
  const [showReview, setShowReview] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (profile) {
      loadData();
    }
  }, [profile]);

  const loadData = async () => {
    const { data: eventsData } = await supabase
      .from('events')
      .select('*')
      .eq('client_id', profile!.id)
      .order('date', { ascending: true });

    const { data: notificationsData } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', profile!.id)
      .order('created_at', { ascending: false })
      .limit(5);

    if (eventsData) setEvents(eventsData);
    if (notificationsData) setNotifications(notificationsData);
    setLoading(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'in_progress': return 'bg-blue-100 text-blue-700';
      case 'planning': return 'bg-yellow-100 text-yellow-700';
      case 'cancelled': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 animate-slide-down">
            Welcome back, {profile?.full_name}!
          </h1>
          <p className="text-gray-600 mt-1">Manage your events and celebrations</p>
        </div>
        <button className="relative p-3 hover:bg-gray-100 rounded-xl transition-colors duration-200">
          <Bell className="w-6 h-6 text-gray-600" />
          {notifications.filter(n => !n.read).length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] animate-slide-up" style={{ animationDelay: '0ms' }}>
          <Calendar className="w-8 h-8 mb-3 opacity-90" />
          <h3 className="text-3xl font-bold mb-1">{events.length}</h3>
          <p className="text-blue-100">Total Events</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 animate-slide-up" style={{ animationDelay: '100ms' }}>
          <Users className="w-8 h-8 mb-3 text-blue-600" />
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {events.filter(e => e.status === 'in_progress').length}
          </h3>
          <p className="text-gray-600">In Progress</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.02] border border-gray-200 animate-slide-up" style={{ animationDelay: '200ms' }}>
          <Star className="w-8 h-8 mb-3 text-yellow-500" />
          <h3 className="text-3xl font-bold text-gray-900 mb-1">
            {events.filter(e => e.status === 'completed').length}
          </h3>
          <p className="text-gray-600">Completed</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Upcoming Events</h2>
          {events.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
              <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No events yet</h3>
              <p className="text-gray-600 mb-4">Start planning your first celebration!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {events.map((event, index) => (
                <div
                  key={event.id}
                  className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-[1.01] cursor-pointer border border-gray-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                  onClick={() => setSelectedEvent(event)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h3 className="text-lg font-bold text-gray-900 mb-2">{event.title}</h3>
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ').toUpperCase()}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-600">Event Type</p>
                      <p className="text-gray-900 font-semibold">{event.event_type}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm">{formatDate(event.date)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span className="text-sm">{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <Users className="w-4 h-4" />
                      <span className="text-sm">{event.guest_count} guests</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600">
                      <DollarSign className="w-4 h-4" />
                      <span className="text-sm">${event.budget.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setShowChat(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors duration-200"
                    >
                      <MessageCircle className="w-4 h-4" />
                      Chat
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setShowPayment(true);
                      }}
                      className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors duration-200"
                    >
                      <CreditCard className="w-4 h-4" />
                      Payment
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Notifications</h2>
          <div className="space-y-3">
            {notifications.length === 0 ? (
              <div className="bg-white rounded-2xl p-6 text-center border border-gray-200">
                <Bell className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                <p className="text-sm text-gray-600">No notifications</p>
              </div>
            ) : (
              notifications.map((notification, index) => (
                <div
                  key={notification.id}
                  className="bg-white rounded-xl p-4 shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 animate-slide-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-start gap-3">
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-900 text-sm mb-1">{notification.title}</h4>
                      <p className="text-xs text-gray-600">{notification.message}</p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Modal
        isOpen={!!selectedEvent && !showChat && !showPayment}
        onClose={() => setSelectedEvent(null)}
        title="Event Details"
      >
        {selectedEvent && (
          <div className="space-y-4">
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">{selectedEvent.title}</h3>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(selectedEvent.status)}`}>
                {selectedEvent.status.replace('_', ' ').toUpperCase()}
              </span>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Calendar className="w-5 h-5" />
                <span>{formatDate(selectedEvent.date)}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin className="w-5 h-5" />
                <span>{selectedEvent.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <Users className="w-5 h-5" />
                <span>{selectedEvent.guest_count} guests</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <DollarSign className="w-5 h-5" />
                <span>${selectedEvent.budget.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setShowReview(true)}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-xl font-medium transition-colors duration-200"
              >
                <Star className="w-4 h-4" />
                Write Review
              </button>
            </div>
          </div>
        )}
      </Modal>

      <Drawer
        isOpen={showChat}
        onClose={() => {
          setShowChat(false);
          setSelectedEvent(null);
        }}
        title="Chat with Planner"
      >
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-2xl p-4">
            <p className="text-sm text-gray-600">Chat feature coming soon!</p>
          </div>
        </div>
      </Drawer>

      <Modal
        isOpen={showPayment}
        onClose={() => {
          setShowPayment(false);
          setSelectedEvent(null);
        }}
        title="Payment"
      >
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-sm text-blue-800">Payment integration coming soon!</p>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={showReview}
        onClose={() => setShowReview(false)}
        title="Write a Review"
      >
        <div className="space-y-4">
          <div className="text-center">
            <p className="text-gray-600 mb-4">How was your experience?</p>
            <div className="flex justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  className="p-2 hover:scale-110 transition-transform duration-200"
                >
                  <Star className="w-8 h-8 text-gray-300 hover:text-yellow-500" />
                </button>
              ))}
            </div>
          </div>
          <textarea
            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-all duration-200 resize-none"
            rows={4}
            placeholder="Share your experience..."
          />
          <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-medium transition-colors duration-200">
            Submit Review
          </button>
        </div>
      </Modal>
    </div>
  );
};