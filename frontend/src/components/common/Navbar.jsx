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
  GraduationCap
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout, isAdmin, isStudent } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-8">
            <Link 
              to={isAuthenticated ? (isAdmin ? '/admin/dashboard' : '/student/dashboard') : '/login'} 
              className="flex items-center gap-2.5 group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200 group-hover:scale-105 transition-transform">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-indigo-600 transition-colors">
                  Campus<span className="text-indigo-600">Ease</span>
                </span>
                <span className="hidden sm:block text-[10px] font-semibold uppercase tracking-wider text-slate-600 -mt-1">
                  Resource & Facility Booking
                </span>
              </div>
            </Link>

            {/* Navigation Links */}
            {isAuthenticated && (
              <nav className="hidden md:flex items-center gap-1">
                {isStudent && (
                  <>
                    <NavLink
                      to="/student/dashboard"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/resources"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Layers className="w-4 h-4" />
                      Resource Catalog
                    </NavLink>
                    <NavLink
                      to="/student/bookings"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <CalendarDays className="w-4 h-4" />
                      My Bookings
                    </NavLink>
                  </>
                )}

                {isAdmin && (
                  <>
                    <NavLink
                      to="/admin/dashboard"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Overview
                    </NavLink>
                    <NavLink
                      to="/admin/approvals"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <ClipboardCheck className="w-4 h-4" />
                      Booking Requests
                    </NavLink>
                    <NavLink
                      to="/admin/resources"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Layers className="w-4 h-4" />
                      Manage Resources
                    </NavLink>
                    <NavLink
                      to="/admin/users"
                      className={({ isActive }) =>
                        `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                          isActive
                            ? 'bg-indigo-50 text-indigo-700 font-semibold'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                        }`
                      }
                    >
                      <Users className="w-4 h-4" />
                      Users
                    </NavLink>
                  </>
                )}
              </nav>
            )}
          </div>

          {/* Right Action Profile & Logout */}
          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex flex-col text-right">
                  <span className="text-xs font-semibold text-slate-800">
                    {user?.name || user?.username}
                  </span>
                  <span className="text-[11px] text-slate-600 flex items-center justify-end gap-1">
                    {isAdmin ? (
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-medium">
                        <ShieldCheck className="w-3 h-3" /> Admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-slate-600">
                        <GraduationCap className="w-3 h-3" /> {user?.department || 'Student'}
                      </span>
                    )}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-slate-100 border border-slate-200 flex items-center justify-center font-bold text-sm text-indigo-700">
                  {(user?.name || user?.username || 'U')[0].toUpperCase()}
                </div>

                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-sm shadow-indigo-200 transition-all"
                >
                  Student Register
                </Link>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;
