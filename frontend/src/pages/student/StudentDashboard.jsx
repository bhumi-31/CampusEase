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
  Sparkles,
  School,
  MapPin,
  Megaphone,
  BookOpen,
  Compass
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
      
      {/* Official Campus Notice Ticker */}
      <div className="mb-6 p-3.5 bg-gradient-to-r from-amber-50 via-amber-100/60 to-indigo-50 border border-amber-200/80 rounded-2xl flex items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2.5 text-xs text-amber-950 font-medium">
          <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
            <Megaphone className="w-3 h-3" /> Campus Bulletin
          </span>
          <span className="truncate">
            Laboratory reservations for Final Year Capstone Sprints & Hackathons are now prioritized. Please submit requests 24 hours in advance.
          </span>
        </div>
        <Link 
          to="/resources" 
          className="hidden sm:inline-flex items-center gap-1 text-xs font-bold text-amber-900 hover:text-indigo-700 shrink-0"
        >
          <span>Reserve Now</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* University Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-slate-950 text-white shadow-xl shadow-slate-200/50 mb-8 p-8 sm:p-10">
        
        {/* Campus background pattern */}
        <div 
          className="absolute inset-0 opacity-20 bg-cover bg-center"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1200&q=80')`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-indigo-950/80" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-amber-300 border border-white/15 backdrop-blur-md mb-3">
              <School className="w-3.5 h-3.5" />
              <span>{user?.department || 'Department of Computer Science'}</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight">
              Welcome back, {user?.name || user?.username}!
            </h1>
            
            <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
              Your central academic dashboard for scheduling computing laboratories, tiered lecture halls, seminar spaces, and recreation facilities.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            <Link
              to="/resources"
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs sm:text-sm rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <Compass className="w-4 h-4" />
              <span>Explore Facilities</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/student/bookings"
              className="px-4 py-3 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs sm:text-sm rounded-xl border border-white/20 backdrop-blur-md transition-all text-center"
            >
              My Bookings
            </Link>
          </div>
        </div>

      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Total Bookings</span>
            <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700">
              <CalendarDays className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 mt-2">{metrics.total_bookings}</p>
          <span className="text-[11px] text-slate-400 mt-1 block">Lifetime reservations</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-amber-700">Pending Review</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-amber-600 mt-2">{metrics.pending}</p>
          <span className="text-[11px] text-amber-700 mt-1 block">Awaiting admin review</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700">Confirmed Slots</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-emerald-600 mt-2">{metrics.approved}</p>
          <span className="text-[11px] text-emerald-700 mt-1 block">Approved & ready</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-rose-700">Rejected</span>
            <div className="w-9 h-9 rounded-xl bg-rose-50 flex items-center justify-center text-rose-600">
              <XCircle className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-rose-600 mt-2">{metrics.rejected}</p>
          <span className="text-[11px] text-rose-700 mt-1 block">Check remarks note</span>
        </div>

      </div>

      {/* Grid: Upcoming Reservations & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Upcoming Reservations */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Calendar className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Upcoming Reservations</h3>
                  <p className="text-[11px] text-slate-500">Approved and pending sessions on your schedule</p>
                </div>
              </div>
              <Link to="/student/bookings" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                View all
              </Link>
            </div>

            {stats?.upcoming_reservations?.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <CalendarDays className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No upcoming bookings scheduled</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Explore the catalog to schedule your first facility.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.upcoming_reservations?.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50/80 hover:bg-slate-100/70 rounded-2xl border border-slate-200/70 flex items-center justify-between transition-colors">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.resource_details?.name}</h4>
                      <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                        <span className="flex items-center gap-1 font-semibold text-indigo-700">
                          <Calendar className="w-3 h-3 text-indigo-600" />
                          {item.booking_date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {item.start_time} - {item.end_time}
                        </span>
                      </div>
                    </div>
                    <StatusBadge status={item.status} />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">Recent Request History</h3>
                  <p className="text-[11px] text-slate-500">Timeline of your latest submissions</p>
                </div>
              </div>
              <Link to="/student/bookings" className="text-xs font-bold text-indigo-600 hover:text-indigo-700">
                Full Log
              </Link>
            </div>

            {stats?.recent_activity?.length === 0 ? (
              <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-semibold text-slate-700">No recent activity recorded</p>
              </div>
            ) : (
              <div className="space-y-3">
                {stats?.recent_activity?.map((item) => (
                  <div key={item.id} className="p-4 bg-slate-50/80 hover:bg-slate-100/70 rounded-2xl border border-slate-200/70 flex items-center justify-between transition-colors">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{item.resource_details?.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 max-w-xs truncate">
                        {item.purpose}
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
