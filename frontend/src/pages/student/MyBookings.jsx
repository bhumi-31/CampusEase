import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  CalendarDays, 
  Clock, 
  MapPin, 
  AlertCircle, 
  Ban, 
  MessageSquare, 
  CheckCircle2,
  Calendar
} from 'lucide-react';

const STATUS_FILTERS = [
  { id: 'all', label: 'All Requests' },
  { id: 'pending', label: 'Pending' },
  { id: 'approved', label: 'Approved' },
  { id: 'rejected', label: 'Rejected' },
  { id: 'cancelled', label: 'Cancelled' },
];

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState('all');
  const [cancelModalId, setCancelModalId] = useState(null);
  const [actionMessage, setActionMessage] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [activeFilter]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (activeFilter !== 'all') params.status = activeFilter;
      const res = await api.get('/bookings/', { params });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    try {
      await api.delete(`/bookings/${id}/`);
      setActionMessage('Your booking has been cancelled and the time slot is now released.');
      setCancelModalId(null);
      fetchBookings();
      setTimeout(() => setActionMessage(''), 5000);
    } catch (err) {
      alert(err.response?.data?.error || 'Could not cancel booking.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
          My Booking History
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor the approval status of your resource requests and manage active reservations.
        </p>
      </div>

      {actionMessage && (
        <div className="mb-6 p-4 rounded-xl bg-slate-100 border border-slate-300 text-slate-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-6">
        {STATUS_FILTERS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white rounded-2xl p-6 border border-slate-200 animate-pulse h-32"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <CalendarDays className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No bookings found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            You do not have any bookings matching the current filter.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((item) => {
            const isEligibleForCancel = item.status === 'pending' || item.status === 'approved';
            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs hover:shadow-xs transition-shadow"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  
                  {/* Left Column: Resource & Schedule */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-base font-bold text-slate-900">
                        {item.resource_details?.name || 'Campus Resource'}
                      </h3>
                      <StatusBadge status={item.status} />
                    </div>

                    <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {item.resource_details?.location}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                        {item.booking_date}
                      </span>
                      <span className="flex items-center gap-1 font-semibold text-slate-700">
                        <Clock className="w-3.5 h-3.5 text-indigo-600" />
                        {item.start_time} - {item.end_time}
                      </span>
                    </div>

                    <div className="text-xs text-slate-600 pt-1">
                      <span className="font-semibold text-slate-700">Purpose: </span>
                      <span>{item.purpose}</span>
                    </div>

                    {/* Admin remarks if present */}
                    {item.approval_details?.remarks && (
                      <div className="mt-2 text-xs p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-slate-700 flex items-start gap-2">
                        <MessageSquare className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold">Administrator Note: </span>
                          <span>{item.approval_details.remarks}</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Cancellation action */}
                  {isEligibleForCancel && (
                    <div className="flex items-center">
                      <button
                        onClick={() => setCancelModalId(item.id)}
                        className="px-3.5 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
                      >
                        <Ban className="w-3.5 h-3.5" />
                        Cancel Booking
                      </button>
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Confirmation Modal for Cancellation */}
      {cancelModalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-2xl border border-slate-100">
            <h3 className="text-base font-bold text-slate-900">Confirm Cancellation</h3>
            <p className="text-xs text-slate-500 mt-2">
              Are you sure you want to cancel this booking? Once cancelled, this time slot will be released for other students to book.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setCancelModalId(null)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
              >
                Nevermind
              </button>
              <button
                onClick={() => handleCancelBooking(cancelModalId)}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-xl transition-colors"
              >
                Yes, Cancel Booking
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default MyBookings;
