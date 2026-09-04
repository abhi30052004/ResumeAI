import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, Sparkles, UserPlus, ArrowLeft } from 'lucide-react';
import { NetworkBackground } from '../components/ui/NetworkBackground';
import api from '../lib/api';

export function Login() {
  const location = useLocation();
  const [isFlipped, setIsFlipped] = useState(location.pathname === '/register');

  useEffect(() => {
    setIsFlipped(location.pathname === '/register');
  }, [location.pathname]);

  // Login State
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register State
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const response = await api.post('/api/auth/login', { email: loginEmail, password: loginPassword });
      await login(response.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to login. Please try again.');
    } finally { setLoading(false); }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (regPassword !== regConfirm) { setError('Passwords do not match'); return; }
    setLoading(true); setError('');
    try {
      await api.post('/api/auth/register', { email: regEmail, password: regPassword, full_name: regName });
      const loginResponse = await api.post('/api/auth/login', { email: regEmail, password: regPassword });
      await login(loginResponse.data.access_token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register.');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex-1 relative flex items-center justify-center min-h-screen overflow-hidden bg-white py-20 px-4">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors font-medium bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* ── INTERACTIVE NEURAL NETWORK BACKGROUND (LIGHT) ── */}
      <div className="absolute inset-0 pointer-events-none z-0 bg-[#fafafa] overflow-hidden flex justify-center">
        {/* Soft ambient glow */}
        <div className="absolute top-0 inset-x-0 h-[40rem] bg-gradient-to-b from-indigo-500/10 via-purple-500/5 to-transparent blur-3xl opacity-50" />
        
        {/* Particle Canvas */}
        <NetworkBackground />
        
        {/* Subtle grid on top */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#00000005_1px,transparent_1px),linear-gradient(to_bottom,#00000005_1px,transparent_1px)] bg-[size:24px_24px] mix-blend-overlay" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md perspective-1000 h-[680px]"
      >
        <div className={`w-full h-full relative transition-transform duration-[800ms] preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* ════ FRONT (LOGIN) ════ */}
          <div className="absolute inset-0 backface-hidden flex flex-col justify-center">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-indigo-500/10 relative overflow-hidden h-full flex flex-col justify-center">

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 shadow-sm border border-indigo-100">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Welcome back</h2>
                <p className="text-slate-500 mt-2 font-medium">Enter your details to access your account</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-5">
                {!isFlipped && error && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium text-center animate-scale-in border border-rose-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1 text-left">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 py-6 rounded-xl font-medium"
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs font-bold text-indigo-600 hover:text-indigo-700 transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/20 py-6 rounded-xl pr-12 font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-[14px] text-slate-400 hover:text-indigo-600 transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-4 py-6 text-base font-bold rounded-xl magnetic-btn shadow-[0_8px_30px_-6px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(99,102,241,0.5)]" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
              
              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsFlipped(true); setError(''); navigate('/register', { replace: true }); }}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors font-bold"
                >
                  Sign up for free
                </button>
              </div>
            </div>
          </div>

          {/* ════ BACK (REGISTER) ════ */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center">
             <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-emerald-500/10 relative overflow-hidden h-full flex flex-col justify-center">

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mb-3 shadow-sm border border-emerald-100">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Create Account</h2>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {isFlipped && error && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium text-center animate-scale-in border border-rose-100">
                    {error}
                  </div>
                )}
                
                <div className="space-y-1 text-left">
                  <Input
                    label="Full Name"
                    type="text"
                    required
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="John Doe"
                    className="w-full bg-white border-slate-200 focus:border-indigo-500 py-5 rounded-xl font-medium"
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full bg-white border-slate-200 focus:border-indigo-500 py-5 rounded-xl font-medium"
                  />
                </div>
                
                <div className="space-y-1 relative text-left">
                  <div className="relative">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-slate-200 focus:border-indigo-500 py-5 rounded-xl pr-12 font-medium"
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
                    value={regConfirm}
                    onChange={(e) => setRegConfirm(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-white border-slate-200 focus:border-indigo-500 py-5 rounded-xl font-medium"
                  />
                </div>
                
                <Button type="submit" className="w-full mt-2 py-6 text-base font-bold rounded-xl magnetic-btn shadow-[0_8px_30px_-6px_rgba(99,102,241,0.4)] hover:shadow-[0_12px_40px_-6px_rgba(99,102,241,0.5)]" disabled={loading}>
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm font-medium text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsFlipped(false); setError(''); navigate('/login', { replace: true }); }}
                  className="text-indigo-600 hover:text-indigo-700 transition-colors font-bold"
                >
                  Sign in
                </button>
              </div>
            </div>
          </div>
          
        </div>
      </motion.div>
    </div>
  );
}
