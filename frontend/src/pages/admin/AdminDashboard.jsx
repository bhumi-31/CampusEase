import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';
import StatusBadge from '../../components/common/StatusBadge';
import { 
  Building2, 
  Users, 
  CalendarDays, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Shield,
  Layers,
  BarChart3,
  PieChart as PieIcon
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const fetchAdminStats = async () => {
    try {
      const res = await api.get('/bookings/admin/dashboard/');
      setStats(res.data);
    } catch (err) {
      console.error('Error fetching admin dashboard stats', err);
    } finally {
      setLoading(false);
    }
  };

  const metrics = stats?.metrics || {
    total_resources: 0,
    active_resources: 0,
    total_students: 0,
    total_bookings: 0,
    pending_requests: 0,
    approved_bookings: 0,
    rejected_bookings: 0,
    cancelled_bookings: 0,
  };

  const categoryData = stats?.category_distribution || [];
  const statusData = stats?.status_distribution || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 mb-2">
            <Shield className="w-3.5 h-3.5" /> Administrator Control Center
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
            Campus Operations Overview
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time analytics, pending approvals queue, and resource utilization insights.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/approvals"
            className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-md shadow-indigo-200 flex items-center gap-2 transition-all"
          >
            <Clock className="w-4 h-4" />
            Review Requests ({metrics.pending_requests})
          </Link>
          <Link
            to="/admin/resources"
            className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-bold shadow-2xs flex items-center gap-2 transition-all"
          >
            <Layers className="w-4 h-4" />
            Manage Facilities
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Facilities</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{metrics.total_resources}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">{metrics.active_resources} active facilities</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Registered Students</span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-slate-900 mt-2">{metrics.total_students}</p>
          <p className="text-[11px] text-slate-500 mt-1 font-medium">Campus student accounts</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-600">Pending Requests</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-amber-600 mt-2">{metrics.pending_requests}</p>
          <p className="text-[11px] text-amber-700 mt-1 font-medium">Requires administrator action</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">Approved Bookings</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <p className="text-2xl font-black text-emerald-600 mt-2">{metrics.approved_bookings}</p>
          <p className="text-[11px] text-emerald-700 mt-1 font-medium">Total successful reservations</p>
        </div>

      </div>

      {/* Recharts Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        
        {/* Category Distribution Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-600" />
                Resource Inventory by Category
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Distribution of labs, halls, and rooms</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData} margin={{ top: 10, right: 10, left: -20, bottom: 25 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="category_name" 
                  angle={-15} 
                  textAnchor="end" 
                  tick={{ fontSize: 11, fill: '#64748b' }} 
                />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#64748b' }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }} 
                  itemStyle={{ color: '#818cf8' }}
                />
                <Bar dataKey="count" fill="#4f46e5" radius={[6, 6, 0, 0]} barSize={36} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution Donut/Pie Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-2xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <PieIcon className="w-4 h-4 text-indigo-600" />
                Booking Status Distribution
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Ratio of pending, approved, and rejected bookings</p>
            </div>
          </div>

          <div className="h-64 w-full flex items-center justify-center">
            {metrics.total_bookings === 0 ? (
              <p className="text-xs text-slate-400">No booking requests submitted yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', color: '#fff', fontSize: '12px', border: 'none' }}
                  />
                  <Legend 
                    verticalAlign="bottom" 
                    height={36} 
                    iconType="circle"
                    formatter={(value) => <span className="text-xs font-semibold text-slate-700">{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>

      {/* Recent Activity Table */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <CalendarDays className="w-4 h-4 text-indigo-600" />
            Recent Booking Requests
          </h3>
          <Link to="/admin/approvals" className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1">
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {stats?.recent_activity?.length === 0 ? (
          <p className="text-xs text-slate-400 py-6 text-center">No recent bookings recorded.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 font-semibold uppercase tracking-wider">
                  <th className="pb-3">Student</th>
                  <th className="pb-3">Resource</th>
                  <th className="pb-3">Date & Time</th>
                  <th className="pb-3">Purpose</th>
                  <th className="pb-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-600">
                {stats?.recent_activity?.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 font-semibold text-slate-900">
                      {b.user_details?.name || b.user_details?.username}
                    </td>
                    <td className="py-3 font-medium text-slate-800">
                      {b.resource_details?.name}
                    </td>
                    <td className="py-3 text-slate-500">
                      {b.booking_date} • {b.start_time} - {b.end_time}
                    </td>
                    <td className="py-3 text-slate-500 max-w-xs truncate">
                      {b.purpose}
                    </td>
                    <td className="py-3 text-right">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};

export default AdminDashboard;
