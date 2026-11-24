import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  Building2, 
  CalendarDays, 
  LayoutDashboard, 
  Layers, 
  Users, 
  ClipboardCheck, 
  LogOut, 
  ShieldCheck,
  GraduationCap,
  School,
  Sparkles,
  Bell
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <>
      {/* Top University Campus Announcement Strip */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-4 border-b border-slate-800">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 font-bold text-amber-400">
              <School className="w-3 h-3" /> NIT Campus
            </span>
            <span className="text-slate-600">•</span>
            <span className="hidden sm:inline text-slate-400">
              Department of Academic Infrastructure & Laboratory Planning
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Booking Gateway Active
            </span>
            <span className="hidden md:inline text-slate-600">|</span>
            <span className="hidden md:inline">Helpline: +91 (011) 2659-1000</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Header */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-8">
              <Link 
                to="/" 
                className="flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-700 via-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                  <School className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <span className="text-xl font-black tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                    Campus<span className="text-indigo-600">Ease</span>
                  </span>
                  <span className="hidden sm:block text-[10px] font-bold uppercase tracking-wider text-slate-400 -mt-1">
                    University Facilities & Labs
                  </span>
                </div>
              </Link>

              {/* Navigation Links */}
              <nav className="hidden md:flex items-center gap-1">
                <NavLink
                  to="/"
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                      isActive
                        ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                    }`
                  }
                >
                  Home
                </NavLink>

                {isAuthenticated && isStudent && (
                  <>
                      <NavLink
                        to="/student/dashboard"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Student Portal
                      </NavLink>
                      <NavLink
                        to="/resources"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <Layers className="w-4 h-4" />
                        Explore Facilities
                      </NavLink>
                      <NavLink
                        to="/student/bookings"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <CalendarDays className="w-4 h-4" />
                        My Reservations
                      </NavLink>
                    </>
                  )}

                  {isAdmin && (
                    <>
                      <NavLink
                        to="/admin/dashboard"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <LayoutDashboard className="w-4 h-4" />
                        Command Overview
                      </NavLink>
                      <NavLink
                        to="/admin/approvals"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <ClipboardCheck className="w-4 h-4" />
                        Approval Queue
                      </NavLink>
                      <NavLink
                        to="/admin/resources"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <Layers className="w-4 h-4" />
                        Campus Catalog
                      </NavLink>
                      <NavLink
                        to="/admin/users"
                        className={({ isActive }) =>
                          `flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                            isActive
                              ? 'bg-indigo-50 text-indigo-700 shadow-2xs'
                              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
                          }`
                        }
                      >
                        <Users className="w-4 h-4" />
                        Roster
                      </NavLink>
                    </>
                  )}
                </nav>
            </div>

            {/* Right Action Profile & Logout */}
            <div className="flex items-center gap-3">
              {isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <div className="hidden sm:flex flex-col text-right">
                    <span className="text-xs font-bold text-slate-900 flex items-center justify-end gap-1">
                      {user?.name || user?.username}
                    </span>
                    <span className="text-[11px] text-slate-500 flex items-center justify-end gap-1">
                      {isAdmin ? (
                        <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                          <ShieldCheck className="w-3 h-3 text-indigo-600" /> Facility Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
                          <GraduationCap className="w-3 h-3 text-indigo-600" /> {user?.department || 'Student'}
                        </span>
                      )}
                    </span>
                  </div>

                  <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center font-black text-sm text-indigo-700 shadow-2xs">
                    {(user?.name || user?.username || 'U')[0].toUpperCase()}
                  </div>

                  <button
                    onClick={handleLogout}
                    title="Sign Out"
                    className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-indigo-600 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-sm shadow-indigo-200 transition-all"
                  >
                    New Student
                  </Link>
                </div>
              )}
            </div>

          </div>
        </div>
      </header>
    </>
  );
};

export default Navbar;
