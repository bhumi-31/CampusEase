import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  X, 
  Calendar, 
  Clock, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  Info,
  MapPin,
  Users
} from 'lucide-react';

const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', 
  '13:00', '14:00', '15:00', '16:00', '17:00', 
  '18:00', '19:00', '20:00'
];

const BookingModal = ({ resource, isOpen, onClose, onSuccess }) => {
  // Tomorrow's date formatted as YYYY-MM-DD
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const minDateStr = tomorrow.toISOString().split('T')[0];

  const [bookingDate, setBookingDate] = useState(minDateStr);
  const [startTime, setStartTime] = useState('10:00');
  const [endTime, setEndTime] = useState('12:00');
  const [purpose, setPurpose] = useState('');
  
  const [availability, setAvailability] = useState([]);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  
  const [submitting, setSubmitting] = useState(false);
  const [conflictError, setConflictError] = useState(null);
  const [generalError, setGeneralError] = useState('');

  // Fetch booked slots whenever resource or date changes
  useEffect(() => {
    if (isOpen && resource && bookingDate) {
      fetchAvailability();
    }
  }, [isOpen, resource, bookingDate]);

  const fetchAvailability = async () => {
    setLoadingAvailability(true);
    setConflictError(null);
    try {
      const res = await api.get(`/resources/${resource.id}/availability/?date=${bookingDate}`);
      setAvailability(res.data.booked_slots || []);
    } catch (err) {
      console.error('Error fetching availability', err);
    } finally {
      setLoadingAvailability(false);
    }
  };

  if (!isOpen || !resource) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setConflictError(null);
    setGeneralError('');

    if (startTime >= endTime) {
      setGeneralError('End time must be later than start time.');
      return;
    }

    setSubmitting(true);
    try {
      await api.post('/bookings/', {
        resource: resource.id,
        booking_date: bookingDate,
        start_time: `${startTime}:00`,
        end_time: `${endTime}:00`,
        purpose: purpose.trim(),
      });
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      if (err.response?.status === 409) {
        setConflictError({
          title: 'Schedule Conflict Detected',
          message: err.response.data?.detail || err.response.data?.error || 'This resource is already booked for the selected time slot.',
        });
      } else {
        const data = err.response?.data;
        const msg = typeof data === 'object' 
          ? Object.values(data).flat().join(' ') 
          : 'Failed to create booking request.';
        setGeneralError(msg);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        {/* Modal Header */}
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
              New Reservation Request
            </span>
            <h3 className="text-lg font-bold text-slate-900">{resource.name}</h3>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 max-h-[80vh] overflow-y-auto">
          
          {/* Resource quick info */}
          <div className="flex flex-wrap gap-4 p-3 bg-slate-50 rounded-xl mb-5 text-xs text-slate-600">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              <span>{resource.location}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Users className="w-4 h-4 text-slate-400" />
              <span>Capacity: {resource.capacity} people</span>
            </div>
          </div>

          {/* Conflict Error Callout */}
          {conflictError && (
            <div className="mb-5 p-4 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-rose-800">{conflictError.title}</h4>
                <p className="text-xs text-rose-700 mt-1">{conflictError.message}</p>
                <p className="text-xs text-rose-600 font-medium mt-2">
                  Tip: Check the booked slots list below and choose an alternative time slot.
                </p>
              </div>
            </div>
          )}

          {generalError && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
              {generalError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Booking Date */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Date of Booking
              </label>
              <div className="relative">
                <input
                  type="date"
                  required
                  min={minDateStr}
                  value={bookingDate}
                  onChange={(e) => setBookingDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Live Availability Viewer */}
            <div className="p-3.5 bg-indigo-50/50 rounded-xl border border-indigo-100">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-bold text-indigo-950 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-indigo-600" />
                  Occupied Slots on {bookingDate}
                </span>
                {loadingAvailability && (
                  <span className="text-[11px] text-indigo-600 animate-pulse">Checking slots...</span>
                )}
              </div>

              {availability.length === 0 ? (
                <p className="text-xs text-emerald-700 font-medium flex items-center gap-1.5">
                  <CheckCircle className="w-3.5 h-3.5" /> Entire day is currently available!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {availability.map((slot) => (
                    <span 
                      key={slot.id} 
                      className="px-2.5 py-1 bg-amber-100 text-amber-900 border border-amber-300 rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Clock className="w-3 h-3 text-amber-700" />
                      {slot.start_time} - {slot.end_time} ({slot.status})
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Time Slot Pickers */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Start Time
                </label>
                <select
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  End Time
                </label>
                <select
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                >
                  {TIME_SLOTS.map((slot) => (
                    <option key={slot} value={slot}>{slot}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Purpose of Booking
              </label>
              <textarea
                required
                rows={3}
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                placeholder="Explain the academic reason, event, workshop, or project session..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Actions */}
            <div className="pt-3 flex items-center justify-end gap-3 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  'Submit Booking Request'
                )}
              </button>
            </div>

          </form>

        </div>

      </div>
    </div>
  );
};

export default BookingModal;
