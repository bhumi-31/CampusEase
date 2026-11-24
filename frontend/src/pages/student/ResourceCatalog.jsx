import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import BookingModal from './BookingModal';
import { 
  Search, 
  Filter, 
  MapPin, 
  Users, 
  CheckCircle2, 
  Calendar, 
  Monitor, 
  Sparkles,
  Layers,
  ArrowRight,
  School,
  Building,
  CheckCircle,
  Clock
} from 'lucide-react';

const CATEGORY_TABS = [
  { id: 'all', label: 'All Campus Facilities' },
  { id: 'computer_lab', label: 'Computer Laboratories' },
  { id: 'classroom', label: 'Smart Classrooms' },
  { id: 'seminar_hall', label: 'Auditoriums & Halls' },
  { id: 'sports_facility', label: 'Sports Complex' },
  { id: 'meeting_room', label: 'Conference Suites' },
];

const DEFAULT_IMAGES = {
  computer_lab: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80',
  classroom: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
  seminar_hall: 'https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80',
  sports_facility: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80',
  meeting_room: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
};

const ResourceCatalog = () => {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minCapacity, setMinCapacity] = useState('');
  
  // Modal state
  const [selectedResource, setSelectedResource] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [bookingSuccessMessage, setBookingSuccessMessage] = useState('');

  useEffect(() => {
    fetchResources();
  }, [selectedCategory, minCapacity]);

  const fetchResources = async (searchQuery = search) => {
    setLoading(true);
    try {
      const params = {};
      if (selectedCategory && selectedCategory !== 'all') params.category = selectedCategory;
      if (searchQuery) params.search = searchQuery;
      if (minCapacity) params.min_capacity = minCapacity;

      const res = await api.get('/resources/', { params });
      setResources(res.data);
    } catch (err) {
      console.error('Error fetching resources', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchResources(search);
  };

  const handleOpenBooking = (resource) => {
    setSelectedResource(resource);
    setIsModalOpen(true);
  };

  const handleBookingSuccess = () => {
    setBookingSuccessMessage('Your booking request was submitted successfully! It is now pending administrator approval.');
    setTimeout(() => setBookingSuccessMessage(''), 6000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* College Header Section */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
          <School className="w-3.5 h-3.5" /> University Facility Catalogue
        </div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900">
          Campus Infrastructure Directory
        </h1>
        <p className="text-sm text-slate-500 mt-1 max-w-2xl">
          Discover, verify equipment specifications, check occupied time slots, and submit reservations for campus academic & sports spaces.
        </p>
      </div>

      {bookingSuccessMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-semibold flex items-center gap-3 shadow-xs">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{bookingSuccessMessage}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-3xl shadow-xs border border-slate-200/90 p-5 mb-8">
        
        {/* Search & Capacity Row */}
        <div className="flex flex-col md:flex-row gap-3 mb-5">
          <form onSubmit={handleSearchSubmit} className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by lab name, academic block, projector, GPU, audio system..."
              className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all placeholder:text-slate-400"
            />
          </form>

          <div className="flex items-center gap-2">
            <select
              value={minCapacity}
              onChange={(e) => setMinCapacity(e.target.value)}
              className="px-4 py-3 rounded-2xl border border-slate-200 text-slate-700 text-xs font-semibold bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Any Capacity</option>
              <option value="20">Min 20+ Seats</option>
              <option value="40">Min 40+ Seats</option>
              <option value="60">Min 60+ Seats</option>
              <option value="100">100+ Auditorium</option>
            </select>

            <button
              onClick={() => fetchResources(search)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl transition-all shadow-md shadow-indigo-200 shrink-0"
            >
              Filter
            </button>
          </div>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-100 pt-3">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedCategory === tab.id
                  ? 'bg-indigo-600 text-white shadow-xs scale-[1.02]'
                  : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

      </div>

      {/* Resource Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((n) => (
            <div key={n} className="bg-white rounded-3xl h-88 border border-slate-200 p-4 animate-pulse">
              <div className="w-full h-48 bg-slate-200 rounded-2xl mb-4"></div>
              <div className="h-4 bg-slate-200 rounded-md w-3/4 mb-2"></div>
              <div className="h-3 bg-slate-200 rounded-md w-1/2"></div>
            </div>
          ))}
        </div>
      ) : resources.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300">
          <School className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No matching campus facility found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search criteria, clearing the capacity filter, or selecting "All Campus Facilities".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {resources.map((res) => {
            const imgSrc = res.image_url || DEFAULT_IMAGES[res.category] || DEFAULT_IMAGES.classroom;
            return (
              <div
                key={res.id}
                className="bg-white rounded-3xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col group"
              >
                {/* Facility Image with overlay badges */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <img
                    src={imgSrc}
                    alt={res.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/20" />

                  {/* Category Pill Top Left */}
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-white/95 text-slate-900 shadow-md backdrop-blur-md">
                      {res.category_display}
                    </span>
                  </div>

                  {/* Active / Verified Badge Top Right */}
                  <div className="absolute top-3 right-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-500 text-white shadow-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse"></span>
                      Verified
                    </span>
                  </div>

                  {/* Location Overlay Bottom Left */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <p className="text-xs font-semibold flex items-center gap-1 drop-shadow-md">
                      <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                      <span>{res.location}</span>
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-black text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {res.name}
                    </h3>

                    <p className="text-xs text-slate-600 mt-2 line-clamp-2 leading-relaxed">
                      {res.description}
                    </p>

                    {/* Facilities Tags */}
                    {res.facilities_list && res.facilities_list.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3.5">
                        {res.facilities_list.slice(0, 3).map((f, i) => (
                          <span
                            key={i}
                            className="px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-[10px] font-bold"
                          >
                            {f}
                          </span>
                        ))}
                        {res.facilities_list.length > 3 && (
                          <span className="px-2 py-1 text-slate-400 text-[10px] font-semibold">
                            +{res.facilities_list.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Footer & Reserve Action */}
                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700">
                      <Users className="w-4 h-4 text-indigo-600" />
                      <span>{res.capacity} Seats</span>
                    </div>

                    <button
                      onClick={() => handleOpenBooking(res)}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 transition-all group-hover:scale-105"
                    >
                      <span>Reserve Slot</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Booking Modal */}
      <BookingModal
        resource={selectedResource}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleBookingSuccess}
      />

    </div>
  );
};

export default ResourceCatalog;
