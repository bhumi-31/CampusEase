import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  LogIn, 
  AlertCircle, 
  Shield, 
  User, 
  GraduationCap, 
  Sparkles, 
  CheckCircle2, 
  Compass, 
  Calendar,
  Lock,
  ArrowRight,
  School
} from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const user = await login(username, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err) {
      setError(
        err.response?.data?.detail || 
        err.response?.data?.error || 
        'Invalid credentials. Please verify your student or faculty account details.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  const setDemoCredentials = (role) => {
    if (role === 'admin') {
      setUsername('admin');
      setPassword('admin123');
    } else {
      setUsername('student');
      setPassword('student123');
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex flex-col lg:flex-row bg-slate-900">
      
      {/* Left Hero: College Campus Visual Showcase */}
      <div className="relative lg:w-7/12 min-h-[420px] lg:min-h-full flex flex-col justify-between p-8 sm:p-12 lg:p-16 overflow-hidden">
        
        {/* Campus Background Image with Deep University Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 transition-transform duration-1000"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=1600&q=80')`,
          }}
        />
        {/* Gradient dark blue/indigo overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/80 to-indigo-950/70" />
        <div className="absolute inset-0 bg-radial-at-t from-indigo-500/20 via-transparent to-transparent" />

        {/* Top University Brand Crest */}
        <div className="relative z-10 flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-xl shadow-black/20">
            <School className="w-6 h-6 text-amber-300" />
          </div>
          <div>
            <h2 className="text-white font-extrabold text-lg tracking-tight flex items-center gap-2">
              National Institute of Technology
              <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-amber-400/20 text-amber-300 border border-amber-400/30 rounded-full">
                Est. 1965
              </span>
            </h2>
            <p className="text-slate-300 text-xs font-medium">
              CampusEase • Central Resource & Infrastructure Booking Portal
            </p>
          </div>
        </div>

        {/* Middle College Mission & Campus Highlights */}
        <div className="relative z-10 my-auto py-12 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold backdrop-blur-sm mb-4">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Empowering 12,000+ Students & 400+ Faculty Members
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
            Reserve Campus Facilities, Labs & Auditoriums <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 to-indigo-300">In Seconds</span>.
          </h1>

          <p className="text-slate-300 text-sm sm:text-base mt-4 leading-relaxed">
            Eliminate paper register queues, conflicting schedules, and manual approvals. 
            Enjoy automated real-time booking for computing labs, smart seminar halls, tutorial studios, and sports complexes.
          </p>

          {/* Key Campus Pillars */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-white/10">
            <div>
              <p className="text-2xl font-black text-white">45+</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Specialized Labs & Studios</p>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-300">100%</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Conflict-Free (ACID Engine)</p>
            </div>
            <div className="col-span-2 sm:col-span-1">
              <p className="text-2xl font-black text-indigo-300">24/7</p>
              <p className="text-xs text-slate-400 font-medium mt-0.5">Online Reservation Queue</p>
            </div>
          </div>
        </div>

        {/* Bottom Student Testimonial / Live Status */}
        <div className="relative z-10 flex items-center justify-between text-xs text-slate-400 pt-6 border-t border-white/10">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Campus Booking Servers: <strong className="text-emerald-400 font-semibold">Active & Healthy</strong></span>
          </div>
          <span className="hidden sm:inline text-slate-400">Academic Year 2026–27</span>
        </div>

      </div>

      {/* Right Form: Sleek University Authentication Card */}
      <div className="lg:w-5/12 flex items-center justify-center p-6 sm:p-10 lg:p-12 bg-slate-50">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 p-8 sm:p-10">
          
          {/* Card Header */}
          <div className="mb-6">
            <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-200 mb-4">
              <Building2 className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Single Sign-On (SSO)
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Log in with your official university student ID or administrative account
            </p>
          </div>

          {/* Quick Demo Credentials Autofill Banner */}
          <div className="mb-6 p-3.5 bg-gradient-to-r from-indigo-50 to-amber-50/50 border border-indigo-100 rounded-2xl">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                Live Demo Accounts
              </span>
              <span className="text-[10px] text-indigo-600 font-semibold">Click to Fill</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setDemoCredentials('student')}
                className="py-2 px-3 bg-white hover:bg-indigo-50/80 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
              >
                <User className="w-3.5 h-3.5 text-indigo-600" />
                Student
              </button>
              <button
                type="button"
                onClick={() => setDemoCredentials('admin')}
                className="py-2 px-3 bg-white hover:bg-indigo-50/80 border border-indigo-200 text-indigo-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-2xs hover:scale-[1.02] active:scale-95"
              >
                <Shield className="w-3.5 h-3.5 text-indigo-600" />
                Admin
              </button>
            </div>
          </div>

          {error && (
            <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
                University ID / Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. student or rahul_sharma"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                  Password
                </label>
                <span className="text-[11px] text-slate-400">Default: student123</span>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your account password"
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {submitting ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <LogIn className="w-4 h-4" /> Sign In to Campus Portal
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500">
              First-year student without portal credentials?{' '}
              <Link 
                to="/register" 
                className="font-bold text-indigo-600 hover:text-indigo-700 underline underline-offset-2"
              >
                Register Student Account
              </Link>
            </p>
          </div>

        </div>
      </div>

    </div>
  );
};

export default Login;
