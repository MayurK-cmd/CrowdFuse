import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Users, ArrowLeft, UserCheck, UserCog, Star, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

export default function MyEventsPage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, organizing, volunteering, attending
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchMyEvents();
  }, []);

  const fetchMyEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const response = await api.get('/event/user-events', {
        headers: { Authorization: `Bearer ${token}` }
      });

      setEvents(response.data.events || []);
    } catch (error) {
      toast.error('Failed to fetch your events');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getUserRole = (event) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user || !event.rsvp) return 'unknown';
    
    const userRsvp = event.rsvp.find(r => {
      const rsvpUserId = typeof r.userId === 'object' ? r.userId._id : r.userId;
      return rsvpUserId === user._id;
    });
    
    return userRsvp?.eventRole || 'unknown';
  };

  const getFilteredEvents = () => {
    if (filter === 'all') return events;
    return events.filter(event => {
      const role = getUserRole(event);
      if (filter === 'organizing') return role === 'organizer';
      if (filter === 'volunteering') return role === 'volunteer';
      if (filter === 'attending') return role === 'attendee';
      return false;
    });
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

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const handleCancelRSVP = async (eventId) => {
    try {
      const token = localStorage.getItem('token');
      await api.delete(`/event/${eventId}/rsvp`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('RSVP cancelled successfully!');
      setShowModal(false);
      setSelectedEvent(null);
      fetchMyEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to cancel RSVP');
    }
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
  const organizingCount = events.filter(e => getUserRole(e) === 'organizer').length;
  const volunteeringCount = events.filter(e => getUserRole(e) === 'volunteer').length;
  const attendingCount = events.filter(e => getUserRole(e) === 'attendee').length;

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
            Organizing ({organizingCount})
          </button>
          <button
            onClick={() => setFilter('volunteering')}
            className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'volunteering'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            Volunteering ({volunteeringCount})
          </button>
          <button
            onClick={() => setFilter('attending')}
            className={`px-6 py-2 rounded-lg font-semibold transition cursor-pointer ${
              filter === 'attending'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            Attending ({attendingCount})
          </button>
        </div>

        {/* Events List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No events found</p>
              <p className="text-gray-500 text-sm mt-2">
                {filter === 'all' 
                  ? "You haven't joined any events yet"
                  : `You're not ${filter.replace('ing', '').replace('attend', 'attending')} any events`}
              </p>
            </div>
          ) : (
            filteredEvents.map((event) => {
              const userRole = getUserRole(event);
              return (
                <div
                  key={event._id}
                  className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition cursor-pointer"
                  onClick={() => openModal(event)}
                >
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-bold text-black flex-1 pr-2">{event.title}</h3>
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
                      {event.location?.city}, {event.location?.state}
                    </div>
                    <div className="flex items-center text-gray-600 text-sm">
                      <Users className="h-4 w-4 mr-2" />
                      {event.rsvp?.length || 0} people registered
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

      {/* Event Details Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div className="flex-1 pr-8">
                <h2 className="text-2xl font-bold text-black mb-2">{selectedEvent.title}</h2>
                {getRoleBadge(getUserRole(selectedEvent))}
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
              <div className="space-y-4 mb-6">
                <div>
                  <h3 className="font-semibold text-black mb-2">Description</h3>
                  <p className="text-gray-600">{selectedEvent.description}</p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-semibold text-black mb-2">Date & Time</h3>
                    <div className="flex items-center text-gray-600">
                      <Calendar className="h-5 w-5 mr-2" />
                      {selectedEvent.date} at {selectedEvent.time}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold text-black mb-2">Location</h3>
                    <div className="flex items-start text-gray-600">
                      <MapPin className="h-5 w-5 mr-2 mt-0.5" />
                      <div>
                        {selectedEvent.location?.address && (
                          <p>{selectedEvent.location.address}</p>
                        )}
                        <p>{selectedEvent.location?.city}, {selectedEvent.location?.state}</p>
                        <p>{selectedEvent.location?.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-2">Attendees</h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    {selectedEvent.rsvp?.length || 0} people registered
                  </div>
                </div>

                {selectedEvent.labels && selectedEvent.labels.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-black mb-2">Tags</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedEvent.labels.map((label, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
                        >
                          {label}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="border-t border-gray-200 pt-6">
                {getUserRole(selectedEvent) === 'organizer' ? (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      You are the organizer of this event
                    </p>
                    <button
                      onClick={() => navigate(`/event/${selectedEvent._id}/manage`)}
                      className="w-full py-4 bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
                    >
                      Manage Event
                    </button>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-semibold text-black mb-4 text-center">
                      Your Registration
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                      You are registered as a {getUserRole(selectedEvent)}
                    </p>
                    <button
                      onClick={() => handleCancelRSVP(selectedEvent._id)}
                      className="w-full py-4 border-2 border-red-500 text-red-500 rounded-xl text-lg font-semibold hover:bg-red-50 transition cursor-pointer"
                    >
                      Cancel RSVP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}