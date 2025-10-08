import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Users, ArrowLeft, UserCheck, UserCog, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, organizing, volunteering, attending

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const user = JSON.parse(localStorage.getItem('user'));
      
      const response = await api.get('/event/user-events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data.events);
    } catch (error) {
      toast.error('Failed to fetch your events');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = (event) => {
    const user = JSON.parse(localStorage.getItem('user'));
    const userRsvp = event.rsvp.find(r => r.userId._id === user._id || r.userId === user._id);
    return userRsvp?.eventRole || 'unknown';
  };

  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    return events.filter(event => getUserRole(event) === filter.replace('ing', '').replace('attend', 'attendee'));
  };

  const getRoleIcon = (role) => {
    switch (role) {
      case 'organizer':
        return <Star className="h-4 w-4" />;
      case 'volunteer':
        return <UserCog className="h-4 w-4" />;
      case 'attendee':
        return <UserCheck className="h-4 w-4" />;
      default:
        return <Users className="h-4 w-4" />;
    }
  };

  const getRoleBadge = (role) => {
    const styles = {
      organizer: 'bg-black text-white',
      volunteer: 'bg-blue-100 text-blue-800',
      attendee: 'bg-green-100 text-green-800'
    };

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${styles[role] || 'bg-gray-100 text-gray-800'}`}>
        {getRoleIcon(role)}
        {role.charAt(0).toUpperCase() + role.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your events...</p>
        </div>
      </div>
    );
  }

  const filteredEvents = getFilteredEvents();

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-black" />
              <span className="ml-2 text-2xl font-bold text-black">CrowdFuse</span>
            </div>
            <button
              onClick={() => navigate('/home')}
              className="flex items-center text-black hover:text-gray-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Events</h1>
          <p className="text-gray-600">Events you're organizing, volunteering for, or attending</p>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-wrap gap-3 mb-8">
          <button
            onClick={() => setFilter('all')}
            className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'all'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            All Events ({events.length})
          </button>
          <button
            onClick={() => setFilter('organizing')}
            className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'organizing'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            Organizing ({events.filter(e => getUserRole(e) === 'organizer').length})
          </button>
          <button
            onClick={() => setFilter('volunteering')}
            className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'volunteering'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            Volunteering ({events.filter(e => getUserRole(e) === 'volunteer').length})
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'attending'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            Attending ({events.filter(e => getUserRole(e) === 'attendee').length})
          </button>
        </div>

        {/* Events List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const userRole = getUserRole(event);
              return (
                <div
                  key={event._id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition cursor-pointer"
                  onClick={() => navigate(`/event/${event._id}`)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-black flex-1">{event.title}</h3>
                    {getRoleBadge(userRole)}
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{event.description}</p>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-gray-600 text-sm">
                      <Calendar className="h-4 w-4 mr-2" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2" />
                      {event.location.city}, {event.location.state}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.rsvp.length} people registered
                    </div>
                  </div>

                  {event.labels && event.labels.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {event.labels.map((label, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}