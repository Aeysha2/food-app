import React, { useState } from 'react';
import { X, Lock, Mail, User, Phone, MapPin, Sparkles, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AuthModal = ({ isOpen, onClose }) => {
  const { login, register, quickDemoLogin, loading, authError, setAuthError } = useAuth();
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (mode === 'login') {
      const res = await login(email, password);
      if (res.success) onClose();
    } else {
      const res = await register({ name, email, password, phone, address });
      if (res.success) onClose();
    }
  };

  const handleDemo = async (role) => {
    const res = await quickDemoLogin(role);
    if (res.success) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div onClick={onClose} className="fixed inset-0 bg-white/60 backdrop-blur-xs" />

      <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl overflow-hidden border border-slate-200">
        
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-rose-500 to-red-600 text-white flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black tracking-tight">
              {mode === 'login' ? 'Welcome Back! 👋' : 'Join CraveDash 🚀'}
            </h2>
            <p className="text-xs text-rose-100 mt-0.5">
              {mode === 'login' ? 'Sign in to place orders & track delivery' : 'Create an account to save addresses & points'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch */}
        <div className="flex border-b border-slate-100 bg-slate-50 text-xs font-bold text-center">
          <button
            onClick={() => { setMode('login'); setAuthError(null); }}
            className={`flex-1 py-3 border-b-2 transition-all ${
              mode === 'login' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-slate-400'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setMode('register'); setAuthError(null); }}
            className={`flex-1 py-3 border-b-2 transition-all ${
              mode === 'register' ? 'border-rose-500 text-rose-600 bg-white' : 'border-transparent text-slate-400'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* 1-Click Demo Logins */}
        <div className="p-5 bg-slate-50mber-50/50 border-b border-amber-100/60">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-red-600" />
            <span>Instant Demo Access (No Typing Needed):</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleDemo('user')}
              type="button"
              className="px-3 py-2 bg-white hover:bg-slate-100mber-100/50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95 text-left"
            >
              👤 Demo Customer
            </button>
            <button
              onClick={() => handleDemo('admin')}
              type="button"
              className="px-3 py-2 bg-white hover:bg-slate-100mber-100/50 border border-amber-200 text-amber-900 text-xs font-bold rounded-xl shadow-2xs transition-all active:scale-95 text-left"
            >
              🛡️ Demo Admin
            </button>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-3.5">
          {authError && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-600 text-xs font-medium rounded-xl">
              {authError}
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {mode === 'register' && (
            <>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 012-3456"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Delivery Address</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="123 Food Street, Apt 4"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 outline-none focus:border-rose-500"
                  />
                </div>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-rose-500 hover:bg-rose-600 disabled:bg-rose-300 text-white font-black text-xs rounded-xl shadow-md shadow-rose-500/25 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>{mode === 'login' ? 'Sign In' : 'Create Account'}</span>
          </button>
        </form>

      </div>
    </div>
  );
};
