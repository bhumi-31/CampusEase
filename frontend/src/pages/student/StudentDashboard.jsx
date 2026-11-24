import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import { useAuth } from '../../context/AuthContext';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight, 
  Layers, 
  Calendar,
  Sparkles
} from 'lucide-react';

const StudentDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/bookings/student/dashboard/');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching student dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = stats?.metrics || {
    total_bookings: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
    cancelled: 0,
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Welcome Hero Banner */}
      <div className="bg-gradient-to-r from-indigo-700 via-indigo-600 to-indigo-800 rounded-3xl p-6 sm:p-8 text-white shadow-xl shadow-indigo-100 mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div>
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 backdrop-blur-md mb-2">
            <Sparkles className="w-3.5 h-3.5 text-indigo-200" />
            Student Workspace
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Hello, {user?.name || user?.username}!
          </h1>
          <p className="text-indigo-100 text-xs sm:text-sm mt-1 max-w-xl">
            Reserve laboratories, smart seminar halls, and project meeting rooms seamlessly with conflict-free instant scheduling.
          </p>
        </div>

        <Link
          to="/resources"
          className="px-5 py-3 bg-white text-indigo-700 hover:bg-indigo-50 font-bold text-xs sm:text-sm rounded-xl shadow-lg transition-transform active:scale-95 flex items-center gap-2 shrink-0"
        >
          <Layers className="w-4 h-4" />
          <span>Browse Resources</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-600">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{metrics.total_bookings}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{metrics.pending}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Approved</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{metrics.approved}</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-rose-600">Rejected</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-rose-600 mt-2">{metrics.rejected}</p>
        </div>
      </div>

      {/* Grid: Upcoming Reservations & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Reservations */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-indigo-600" />
                Upcoming Reservations
              </h2>
              <Link to="/student/bookings" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                View all
              </Link>
            </div>

            {stats?.upcoming_reservations?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No upcoming bookings scheduled.
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.upcoming_reservations?.map((item) => (
                  <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.resource_details?.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.booking_date} • {item.start_time} - {item.end_time}
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-indigo-600" />
                Recent Booking Activity
              </h2>
              <Link to="/student/bookings" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700">
                History
              </Link>
            </div>

            {stats?.recent_activity?.length === 0 ? (
              <p className="text-xs text-slate-400 py-6 text-center">
                No recent booking activities recorded.
              </p>
            ) : (
              <div className="space-y-3">
                {stats?.recent_activity?.map((item) => (
                  <div key={item.id} className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.resource_details?.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {item.purpose?.substring(0, 40)}...
                      </p>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default StudentDashboard;
