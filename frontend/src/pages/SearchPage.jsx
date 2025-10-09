import React, { useState } from 'react';
import { Search, Tag, User, Calendar, MapPin, Users, ArrowLeft, Loader, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../services/api';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchType, setSearchType] = useState('labels'); // 'labels' or 'organizer'
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }

    setIsSearching(true);
    setHasSearched(true);

    try {
      const token = localStorage.getItem('token');
      let response;

      if (searchType === 'labels') {
        // Search by labels - expecting query parameter
        response = await api.get(`/event/search/labels?labels=${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        // Search by organizer username
        response = await api.get(`/event/search/organizer/${encodeURIComponent(searchQuery)}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }

      setSearchResults(response.data.events || []);
      
      if (response.data.events?.length === 0) {
        toast.info('No events found');
      } else {
        toast.success(`Found ${response.data.events.length} event(s)`);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Search failed');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEvent(null);
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
      // Re-run the search to update the results
      handleSearch({ preventDefault: () => {} });
    } catch (error) {
      toast.error(error.response?.data?.message || 'RSVP failed');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <ToastContainer />

      {/* Header */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center h-16">
            <button
              onClick={() => navigate('/')}
              className="flex items-center text-black hover:text-gray-600 transition cursor-pointer"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-black mb-2">Search Events</h1>
          <p className="text-gray-600">Find events by labels or organizer</p>
        </div>

        {/* Search Type Toggle */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => {
              setSearchType('labels');
              setSearchQuery('');
              setSearchResults([]);
              setHasSearched(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition cursor-pointer flex items-center ${
              searchType === 'labels'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            <Tag className="h-5 w-5 mr-2" />
            Search by Labels
          </button>
          <button
            onClick={() => {
              setSearchType('organizer');
              setSearchQuery('');
              setSearchResults([]);
              setHasSearched(false);
            }}
            className={`px-6 py-3 rounded-lg font-semibold transition cursor-pointer flex items-center ${
              searchType === 'organizer'
                ? 'bg-black text-white'
                : 'border-2 border-gray-200 text-black hover:border-black'
            }`}
          >
            <User className="h-5 w-5 mr-2" />
            Search by Organizer
          </button>
        </div>

        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  searchType === 'labels'
                    ? 'Enter label (e.g., tech, music, sports)'
                    : 'Enter organizer username'
                }
                className="w-full pl-12 pr-4 py-4 border-2 border-gray-200 rounded-xl focus:border-black focus:outline-none transition text-lg"
              />
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-8 py-4 bg-black text-white rounded-xl font-semibold hover:bg-gray-800 transition cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center"
            >
              {isSearching ? (
                <>
                  <Loader className="h-5 w-5 mr-2 animate-spin" />
                  Searching...
                </>
              ) : (
                <>
                  <Search className="h-5 w-5 mr-2" />
                  Search
                </>
              )}
            </button>
          </div>
        </form>

        {/* Search Info */}
        {searchType === 'labels' && (
          <div className="mb-8 p-4 bg-gray-50 border border-gray-200 rounded-lg">
            <p className="text-sm text-gray-600">
              <strong>Tip:</strong> Enter a single label to search. Examples: "tech", "music", "sports", "food"
            </p>
          </div>
        )}

        {/* Results */}
        <div>
          {isSearching && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
              <p className="text-gray-600">Searching events...</p>
            </div>
          )}

          {!isSearching && hasSearched && searchResults.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">No events found</h3>
              <p className="text-gray-600">
                Try searching with different {searchType === 'labels' ? 'labels' : 'username'}
              </p>
            </div>
          )}

          {!isSearching && searchResults.length > 0 && (
            <>
              <h2 className="text-2xl font-bold text-black mb-6">
                Found {searchResults.length} event(s)
              </h2>
              <div className="grid gap-6">
                {searchResults.map((event) => (
                  <div
                    key={event._id}
                    onClick={() => handleEventClick(event)}
                    className="bg-white border-2 border-gray-200 rounded-xl p-6 hover:border-black transition cursor-pointer"
                  >
                    <div className="mb-4">
                      <h3 className="text-2xl font-bold text-black mb-2">{event.title}</h3>
                      <p className="text-gray-600">{event.description}</p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2" />
                        {event.date} at {event.time}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2" />
                        {event.location.city}, {event.location.state}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2" />
                        {event.rsvp.length} people registered
                      </div>
                      {searchType === 'organizer' && event.rsvp.length > 0 && (
                        <div className="flex items-center text-gray-600">
                          <User className="h-5 w-5 mr-2" />
                          Organizer: {event.rsvp[0].userId?.email || 'N/A'}
                        </div>
                      )}
                    </div>

                    {event.labels && event.labels.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {event.labels.map((label, idx) => (
                          <span
                            key={idx}
                            className={`px-3 py-1 text-sm rounded-full ${
                              searchType === 'labels' && label.toLowerCase() === searchQuery.toLowerCase()
                                ? 'bg-black text-white'
                                : 'bg-gray-100 text-gray-700'
                            }`}
                          >
                            {label}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}

          {!isSearching && !hasSearched && (
            <div className="text-center py-12">
              <div className="text-gray-300 mb-4">
                <Search className="h-20 w-20 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-black mb-2">
                Start your search
              </h3>
              <p className="text-gray-600">
                Enter a {searchType === 'labels' ? 'label' : 'username'} and click search
              </p>
            </div>
          )}
        </div>
      </div>

      {/* RSVP Modal */}
      {showModal && selectedEvent && (
        <div className="fixed inset-0 bg-gray-9 bg-opacity-40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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