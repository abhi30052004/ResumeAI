import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, Sparkles } from 'lucide-react';
import api from '../lib/api';

export function Register() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await api.post('/api/auth/register', { email, password, full_name: fullName });
      // Auto login after register
      const loginResponse = await api.post('/api/auth/login', { email, password });
      await login(loginResponse.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 relative flex items-center justify-center min-h-screen overflow-hidden bg-white">
      {/* ── AMBIENT BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute inset-0 bg-grid opacity-50"></div>
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-indigo-300 rounded-full blur-[150px] opacity-20 animate-blob" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-emerald-300 rounded-full blur-[150px] opacity-20 animate-blob animation-delay-2000" />
      </div>

      <div className="relative z-10 w-full max-w-md px-4 sm:px-6 animate-fade-in-up pt-24 pb-12">
        <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 relative overflow-hidden group hover:border-indigo-200 transition-colors">
          
          {/* Subtle gradient border top */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 via-indigo-500 to-purple-500 opacity-80" />

          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm border border-indigo-100 group-hover:scale-110 transition-transform">
              <Sparkles className="w-7 h-7" />
            </div>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">Create an account</h2>
            <p className="text-slate-500 mt-2 font-medium">Start optimizing your resume today</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium text-center border border-rose-100 animate-scale-in">
                {error}
              </div>
            )}
            
            <div className="space-y-1 text-left">
              <Input
                label="Full Name"
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 py-5 rounded-xl font-medium"
              />
            </div>
            
            <div className="space-y-1 text-left">
              <Input
                label="Email address"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 py-5 rounded-xl font-medium"
              />
            </div>
            
            <div className="space-y-1 relative text-left">
              <div className="relative">
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 py-5 rounded-xl pr-12 font-medium"
                />
                <button
                  type="button"
                  className="absolute right-4 top-[35px] text-slate-400 hover:text-indigo-600 transition-colors"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            
            <div className="space-y-1 text-left">
              <Input
                label="Confirm Password"
                type={showPassword ? 'text' : 'password'}
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 py-5 rounded-xl font-medium"
              />
            </div>
            
            <Button type="submit" className="w-full mt-4 py-6 text-base font-bold rounded-xl magnetic-btn shadow-[0_8px_30px_-6px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(99,102,241,0.5)]" disabled={loading}>
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>
          
          <div className="mt-8 text-center text-sm font-medium text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-indigo-600 hover:text-indigo-700 transition-colors font-bold">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
