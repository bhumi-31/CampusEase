import React, { useState, useEffect } from 'react';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  ClipboardCheck, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Filter, 
  MapPin, 
  User, 
  AlertTriangle,
  MessageSquare,
  X
} from 'lucide-react';

const AdminApprovals = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('pending');
  
  // Decision Modal State
  const [activeAction, setActiveAction] = useState(null); // { booking, decision: 'approved' | 'rejected' }
  const [remarks, setRemarks] = useState('');
  const [submittingAction, setSubmittingAction] = useState(false);
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');

  useEffect(() => {
    fetchBookings();
  }, [filterStatus]);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      const res = await api.get('/bookings/', { params });
      setBookings(res.data);
    } catch (err) {
      console.error('Error fetching bookings', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDecisionModal = (booking, decision) => {
    setActiveAction({ booking, decision });
    setRemarks('');
    setActionError('');
  };

  const handleSubmitDecision = async () => {
    if (!activeAction) return;
    setSubmittingAction(true);
    setActionError('');

    try {
      await api.post(`/bookings/${activeAction.booking.id}/decision/`, {
        decision: activeAction.decision,
        remarks: remarks.trim(),
      });
      setActionSuccess(`Booking #${activeAction.booking.id} was successfully ${activeAction.decision}.`);
      setActiveAction(null);
      fetchBookings();
      setTimeout(() => setActionSuccess(''), 5000);
    } catch (err) {
      setActionError(
        err.response?.data?.error || 
        err.response?.data?.detail || 
        'Could not update booking status.'
      );
    } finally {
      setSubmittingAction(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Booking Approval Requests
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review, approve, or reject student requests to access campus laboratories and event venues.
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['pending', 'approved', 'rejected', 'cancelled', 'all'].map((st) => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize transition-all ${
                filterStatus === st
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {st}
            </button>
          ))}
        </div>
      </div>

      {actionSuccess && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm font-medium flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {/* Bookings Table */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((n) => (
            <div key={n} className="bg-white rounded-2xl h-24 border border-slate-200 animate-pulse"></div>
          ))}
        </div>
      ) : bookings.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <ClipboardCheck className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-800">No requests found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            There are no booking requests currently matching the "{filterStatus}" filter.
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50/80 border-b border-slate-200/80 text-slate-500 uppercase tracking-wider font-semibold">
                <tr>
                  <th className="py-3.5 px-4">Booking Info</th>
                  <th className="py-3.5 px-4">Student</th>
                  <th className="py-3.5 px-4">Schedule</th>
                  <th className="py-3.5 px-4">Purpose</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    
                    {/* Booking & Resource */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 text-sm">
                        {b.resource_details?.name}
                      </div>
                      <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        <span>{b.resource_details?.location}</span>
                      </div>
                    </td>

                    {/* Student */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-900">
                        {b.user_details?.name || b.user_details?.username}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.user_details?.department || b.user_details?.email}
                      </div>
                    </td>

                    {/* Schedule */}
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-indigo-700">
                        {b.booking_date}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {b.start_time} - {b.end_time}
                      </div>
                    </td>

                    {/* Purpose */}
                    <td className="py-3.5 px-4 max-w-xs">
                      <p className="line-clamp-2 text-slate-700">
                        {b.purpose}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-4">
                      <StatusBadge status={b.status} />
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right">
                      {b.status === 'pending' ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleOpenDecisionModal(b, 'approved')}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                          </button>
                          <button
                            onClick={() => handleOpenDecisionModal(b, 'rejected')}
                            className="px-3 py-1.5 bg-rose-50 text-rose-700 hover:bg-rose-100 border border-rose-200 rounded-lg text-xs font-bold transition-colors flex items-center gap-1"
                          >
                            <XCircle className="w-3.5 h-3.5" /> Reject
                          </button>
                        </div>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium">
                          Decided
                        </span>
                      )}
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Decision Action Modal */}
      {activeAction && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 bg-slate-50 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900 capitalize">
                {activeAction.decision} Booking Request
              </h3>
              <button 
                onClick={() => setActiveAction(null)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-xs text-slate-600 mb-4">
                You are about to <strong className="uppercase">{activeAction.decision}</strong> the booking for{' '}
                <strong>{activeAction.booking.resource_details?.name}</strong> by{' '}
                <strong>{activeAction.booking.user_details?.name || activeAction.booking.user_details?.username}</strong> on{' '}
                {activeAction.booking.booking_date} ({activeAction.booking.start_time} - {activeAction.booking.end_time}).
              </p>

              {actionError && (
                <div className="mb-4 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs">
                  {actionError}
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                  Remarks / Comments (Optional)
                </label>
                <textarea
                  rows={3}
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  placeholder={activeAction.decision === 'rejected' ? 'Provide reason for rejection (e.g., Department maintenance scheduled)...' : 'Additional instructions for the student...'}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setActiveAction(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={submittingAction}
                  onClick={handleSubmitDecision}
                  className={`px-4 py-2 text-white text-xs font-bold rounded-xl transition-all flex items-center gap-2 ${
                    activeAction.decision === 'approved'
                      ? 'bg-emerald-600 hover:bg-emerald-700'
                      : 'bg-rose-600 hover:bg-rose-700'
                  }`}
                >
                  {submittingAction ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    `Confirm ${activeAction.decision}`
                  )}
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminApprovals;
