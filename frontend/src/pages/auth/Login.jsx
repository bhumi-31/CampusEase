import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Building2, LogIn, AlertCircle, Shield, User } from 'lucide-react';

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
        'Invalid credentials. Please verify your username and password.'
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
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4 bg-slate-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-200 mb-4">
            <Building2 className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Welcome to CampusEase
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Sign in to book campus facilities and laboratories
          </p>
        </div>

        {/* Demo Credentials Helper Pill */}
        <div className="mb-6 p-3 bg-indigo-50/70 border border-indigo-100 rounded-xl">
          <p className="text-xs font-semibold text-indigo-900 mb-2">
            🚀 Quick Demo Credentials (Click to Autofill):
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setDemoCredentials('student')}
              className="flex-1 py-1.5 px-2.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <User className="w-3.5 h-3.5" /> Student Demo
            </button>
            <button
              type="button"
              onClick={() => setDemoCredentials('admin')}
              className="flex-1 py-1.5 px-2.5 bg-white border border-indigo-200 text-indigo-700 hover:bg-indigo-50 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Demo
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-sm flex items-start gap-2.5">
            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Username
            </label>
            <input
              type="text"
              required
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. rahul_sharma or admin"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold rounded-xl text-sm shadow-md shadow-indigo-200 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" /> Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500">
          New student?{' '}
          <Link to="/register" className="font-semibold text-indigo-600 hover:text-indigo-500 underline underline-offset-2">
            Create an account
          </Link>
        </p>

      </div>
    </div>
  );
};

export default Login;
