import React, { useState, useEffect } from 'react';
import { Sparkles, Calendar, MapPin, Users, Plus, Search, Filter, LogOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
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
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const eventsPerPage = 10;

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
    fetchEvents();
  }, []);

  useEffect(() => {
    filterEvents();
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterCity, showUpcoming, events]);

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`/event/all`, 
        { headers: { Authorization: `Bearer ${token}` }}
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
      setShowModal(false);
      setSelectedEvent(null);
      fetchEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'RSVP failed');
    }
  };

  const openModal = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
  };

  // Pagination logic
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEvents.slice(indexOfFirstEvent, indexOfLastEvent);
  const totalPages = Math.ceil(filteredEvents.length / eventsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
                onClick={() => navigate('/search')}
                className="px-4 py-2 border-2 border-gray-300 text-black rounded-lg hover:border-black transition flex items-center cursor-pointer"
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </button>
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
          {currentEvents.length === 0 ? (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-600 text-lg">No events found</p>
            </div>
          ) : (
            currentEvents.map((event) => (
              <div
                key={event._id}
                className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition cursor-pointer"
                onClick={() => openModal(event)}
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
            ))
          )}
        </div>

        {/* Pagination */}
        {filteredEvents.length > eventsPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className={`p-2 rounded-lg transition cursor-pointer ${
                currentPage === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-black hover:border-black'
              }`}
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <div className="flex gap-2">
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => handlePageChange(index + 1)}
                  className={`px-4 py-2 rounded-lg font-semibold transition cursor-pointer ${
                    currentPage === index + 1
                      ? 'bg-black text-white'
                      : 'bg-white border-2 border-gray-200 text-black hover:border-black'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`p-2 rounded-lg transition cursor-pointer ${
                currentPage === totalPages
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-white border-2 border-gray-200 text-black hover:border-black'
              }`}
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* RSVP Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-white border-b border-gray-200 p-6 flex justify-between items-start">
              <h2 className="text-2xl font-bold text-black pr-8">{selectedEvent.title}</h2>
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

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-semibold text-black mb-4 text-center">
                  RSVP to this event
                </h3>
                <p className="text-gray-600 text-center mb-6">
                  Choose your role for this event
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleRSVP(selectedEvent._id, 'attendee')}
                    className="py-4 bg-black text-white rounded-xl text-lg font-semibold hover:bg-gray-800 transition cursor-pointer"
                  >
                    Attend
                  </button>
                  <button
                    onClick={() => handleRSVP(selectedEvent._id, 'volunteer')}
                    className="py-4 border-2 border-black text-black rounded-xl text-lg font-semibold hover:bg-gray-50 transition cursor-pointer"
                  >
                    Volunteer
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}