import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Users, Plus, Search, Filter, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

export default function HomePage() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCity, setFilterCity] = useState('');
  const [showUpcoming, setShowUpcoming] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [searchTerm, filterCity, showUpcoming, events]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      await api.get(`/event/all`, 
      
      { headers: { Authorization: `Bearer ${token}` }},

      );
      setEvents(response.data.events);
      setFilteredEvents(response.data.events);
    } catch (error) {
      toast.error('Failed to fetch events');
      console.error('Error fetching events:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(event =>
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterCity) {
      filtered = filtered.filter(event =>
        event.location.city.toLowerCase().includes(filterCity.toLowerCase())
      );
    }

    if (showUpcoming) {
      const today = new Date().toISOString().split('T')[0];
      filtered = filtered.filter(event => event.date >= today);
    }

    setFilteredEvents(filtered);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    setTimeout(() => navigate('/login'), 1500);
  };

  const handleRSVP = async (eventId, role) => {
    try {
      const token = localStorage.getItem('token');
      await api.post(`/event/${eventId}/rsvp`, 
        { eventRole: role },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success(`RSVP successful as ${role}!`);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'RSVP failed');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
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
            <div className="flex items-center">
              <Sparkles className="h-8 w-8 text-black" />
              <span className="ml-2 text-2xl font-bold text-black">CrowdFuse</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/create-event')}
                className="px-4 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition flex items-center cursor-pointer"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Event
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
          <h1 className="text-4xl font-bold text-black mb-2">
            Welcome back, {user?.firstName || 'User'}!
          </h1>
          <p className="text-gray-600">Discover and join amazing events</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search events..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition"
            />
          </div>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Filter by city..."
              value={filterCity}
              onChange={(e) => setFilterCity(e.target.value)}
              className="w-full md:w-64 pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-black focus:outline-none transition"
            />
          </div>
          <button
            onClick={() => setShowUpcoming(!showUpcoming)}
            className={`px-6 py-3 rounded-lg font-semibold transition cursor-pointer flex items-center justify-center ${
              showUpcoming
                ? 'bg-black text-white'
                : 'border-2 border-black text-black hover:bg-gray-50'
            }`}
          >
            <Filter className="h-5 w-5 mr-2" />
            Upcoming Only
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No events found</p>
            </div>
          ) : (
            filteredEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition cursor-pointer"
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <div className="mb-4">
                  <h3 className="text-xl font-bold text-black mb-2">{event.title}</h3>
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
                  <div className="flex flex-wrap gap-2 mb-4">
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

                <div className="flex gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRSVP(event._id, 'attendee');
                    }}
                    className="flex-1 py-2 bg-black text-white rounded-lg text-sm font-semibold hover:bg-gray-800 transition cursor-pointer"
                  >
                    Attend
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRSVP(event._id, 'volunteer');
                    }}
                    className="flex-1 py-2 border-2 border-black text-black rounded-lg text-sm font-semibold hover:bg-gray-50 transition cursor-pointer"
                  >
                    Volunteer
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}