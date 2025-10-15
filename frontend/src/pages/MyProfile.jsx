import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Users, LogOut, User, Mail, Phone, Home, Filter, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRole, setSelectedRole] = useState('all');
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUserDetails();
    fetchUserEvents();
  }, []);

  useEffect(() => {
    filterEventsByRole();
  }, [selectedRole, events]);

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/my-profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error('Failed to load user data');
    }
  };

  const fetchUserEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get('/event/user-events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(response.data.events || []);
      setFilteredEvents(response.data.events || []);
    } catch (error) {
      console.error('Error fetching user events:', error);
      toast.error('Failed to load your events');
    } finally {
      setIsLoading(false);
    }
  };

  const filterEventsByRole = () => {
    if (selectedRole === 'all') {
      setFilteredEvents(events);
    } else {
      const filtered = events.filter(event => {
        const userRsvp = event.rsvp.find(r => r.userId === user?._id);
        return userRsvp?.eventRole === selectedRole;
      });
      setFilteredEvents(filtered);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/login'), 1500);
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'organizer':
        return 'bg-purple-100 text-purple-700';
      case 'volunteer':
        return 'bg-blue-100 text-blue-700';
      case 'attendee':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getUserRoleForEvent = (event) => {
    const userRsvp = event.rsvp.find(r => r.userId === user?._id);
    return userRsvp?.eventRole || 'unknown';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />
      
      <nav className="border-b border-gray-200 sticky top-0 bg-white z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigate('/')}>
              <Sparkles className="h-8 w-8 text-black" />
              <span className="ml-2 text-2xl font-bold text-black">CrowdFuse</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/home')}
                className="px-4 py-2 border-2 border-gray-300 text-black rounded-lg hover:border-black transition cursor-pointer"
              >
                Home
              </button>
              <button
                onClick={() => navigate('/my-events')}
                className="px-4 py-2 border-2 border-black text-black rounded-lg hover:bg-gray-50 transition cursor-pointer"
              >
                My Events
              </button>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-black hover:text-gray-600 transition flex items-center cursor-pointer"
              >
                <LogOut className="h-5 w-5 mr-2" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="bg-gray-50 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="text-4xl font-bold text-black mb-2">My Profile</h1>
          <p className="text-gray-600">Manage your account and view your events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {user && (
          <div className="bg-white border-2 border-gray-200 rounded-xl p-8 mb-8">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 bg-black rounded-full flex items-center justify-center text-white text-3xl font-bold">
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div className="ml-6">
                <h2 className="text-3xl font-bold text-black">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-gray-600 mt-1">{user.role}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-center text-gray-600">
                <Mail className="h-5 w-5 mr-3 text-black" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Email</p>
                  <p className="font-medium text-black">{user.email}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Phone className="h-5 w-5 mr-3 text-black" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Contact Number</p>
                  <p className="font-medium text-black">{user.contactNumber}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <Home className="h-5 w-5 mr-3 text-black" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">City</p>
                  <p className="font-medium text-black">{user.city}</p>
                </div>
              </div>

              <div className="flex items-center text-gray-600">
                <User className="h-5 w-5 mr-3 text-black" />
                <div>
                  <p className="text-xs text-gray-500 mb-1">Account Status</p>
                  <p className="font-medium text-black">
                    {user.isLoginAllowed ? 'Active' : 'Inactive'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-black">Your Events</h2>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-600" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-4 py-2 border-2 border-gray-200 rounded-lg text-black focus:border-black outline-none cursor-pointer"
              >
                <option value="all">All Roles</option>
                <option value="organizer">Organizer</option>
                <option value="volunteer">Volunteer</option>
                <option value="attendee">Attendee</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 text-lg">
                  {selectedRole === 'all' 
                    ? 'You haven\'t registered for any events yet' 
                    : `No events found as ${selectedRole}`}
                </p>
              </div>
            ) : (
              filteredEvents.map((event) => {
                const userRole = getUserRoleForEvent(event);
                return (
                  <div
                    key={event._id}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition cursor-pointer"
                    onClick={() => openModal(event)}
                  >
                    <div className="mb-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="text-xl font-bold text-black flex-1">{event.title}</h3>
                        <span className={`px-3 py-1 text-xs rounded-full font-semibold ${getRoleColor(userRole)}`}>
                          {userRole}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">{event.description}</p>
                    </div>

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

      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <div className="flex-1 pr-8">
                <h2 className="text-2xl font-bold text-black mb-2">{selectedEvent.title}</h2>
                <span className={`px-3 py-1 text-sm rounded-full font-semibold ${getRoleColor(getUserRoleForEvent(selectedEvent))}`}>
                  Your role: {getUserRoleForEvent(selectedEvent)}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto max-h-[calc(90vh-88px)]">
              <div className="space-y-4">
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
                        {selectedEvent.location.address && (
                          <p>{selectedEvent.location.address}</p>
                        )}
                        <p>{selectedEvent.location.city}, {selectedEvent.location.state}</p>
                        <p>{selectedEvent.location.country}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-black mb-2">Attendees</h3>
                  <div className="flex items-center text-gray-600">
                    <Users className="h-5 w-5 mr-2" />
                    {selectedEvent.rsvp.length} people registered
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}