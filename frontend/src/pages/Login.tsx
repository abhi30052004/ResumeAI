import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Eye, EyeOff, Sparkles, UserPlus, ArrowLeft, Building2, Briefcase } from 'lucide-react';
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
  const [regEmployeeId, setRegEmployeeId] = useState('');
  const [regRole, setRegRole] = useState('employee'); // Default role

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
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
    setLoading(true); setError(''); setSuccess('');
    try {
      await api.post('/api/auth/register', { 
        email: regEmail, 
        password: regPassword, 
        full_name: regName,
        employee_id: regEmployeeId,
        role: regRole
      });
      
      if (regRole === 'manager') {
        setSuccess('Registration successful. Account pending admin approval.');
        setTimeout(() => setIsFlipped(false), 3000);
      } else {
        const loginResponse = await api.post('/api/auth/login', { email: regEmail, password: regPassword });
        await login(loginResponse.data.access_token);
        navigate('/dashboard');
      }
    } catch (err: any) {
      setError(err.response?.data?.detail || 'Failed to register.');
    } finally { setLoading(false); }
  };

  return (
    <div className="flex-1 relative flex items-center justify-center min-h-screen overflow-hidden bg-[#F8FAFC] py-20 px-4">
      
      {/* Back Button */}
      <Link 
        to="/" 
        className="absolute top-6 left-6 md:top-10 md:left-10 z-50 flex items-center gap-2 text-slate-500 hover:text-[#635BFF] transition-colors font-medium bg-white/80 backdrop-blur-md px-4 py-2 rounded-full shadow-sm border border-slate-200"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      {/* ── PROFILEIQ BACKGROUND ── */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden flex justify-center">
        {/* Soft ambient glow matching Hero */}
        <div className="absolute top-[-10%] left-[10%] w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-[#635BFF]/20 to-[#A07CFF]/20 blur-[100px] mix-blend-multiply opacity-70" />
        <div className="absolute bottom-[-10%] right-[10%] w-[500px] h-[500px] rounded-full bg-gradient-to-bl from-[#FF3366]/20 to-[#FF8A8A]/20 blur-[100px] mix-blend-multiply opacity-70" />
        
        {/* Particle Canvas */}
        <NetworkBackground />
        
        {/* Subtle grid on top */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 w-full max-w-md perspective-1000 h-[750px]"
      >
        <div className={`w-full h-full relative transition-transform duration-[800ms] preserve-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
          
          {/* ════ FRONT (LOGIN) ════ */}
          <div className="absolute inset-0 backface-hidden flex flex-col justify-center">
            <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#635BFF]/10 relative overflow-hidden h-[600px] flex flex-col justify-center">

              <div className="text-center mb-8">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#635BFF]/10 text-[#635BFF] mb-4 shadow-sm border border-[#635BFF]/20">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 tracking-tight uppercase">PROFILEIQ</h2>
                <p className="text-slate-500 mt-2 font-medium">Log in to your professional workspace</p>
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
                    placeholder="you@company.com"
                    className="w-full bg-white border-slate-200 focus:border-[#635BFF] focus:ring-[#635BFF]/20 py-6 rounded-xl font-medium"
                  />
                </div>
                
                <div className="space-y-1 text-left">
                  <div className="flex justify-between items-center mb-1">
                    <label className="block text-sm font-medium text-gray-700">Password</label>
                    <a href="#" className="text-xs font-bold text-[#635BFF] hover:text-[#A07CFF] transition-colors">Forgot password?</a>
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-slate-200 focus:border-[#635BFF] focus:ring-[#635BFF]/20 py-6 rounded-xl pr-12 font-medium"
                    />
                    <button
                      type="button"
                      className="absolute right-4 top-[14px] text-slate-400 hover:text-[#635BFF] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-4 py-6 text-base font-bold rounded-xl bg-gradient-to-r from-[#635BFF] to-[#A07CFF] border-none text-white shadow-[0_10px_30px_-6px_rgba(99,91,255,0.4)] hover:shadow-[0_15px_40px_-6px_rgba(99,91,255,0.5)] transition-all hover:-translate-y-0.5" disabled={loading}>
                  {loading ? 'Signing in...' : 'Sign in'}
                </Button>
              </form>
              
              <div className="mt-8 text-center text-sm font-medium text-slate-500">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsFlipped(true); setError(''); navigate('/register', { replace: true }); }}
                  className="text-[#635BFF] hover:text-[#A07CFF] transition-colors font-bold"
                >
                  Create one now
                </button>
              </div>
            </div>
          </div>

          {/* ════ BACK (REGISTER) ════ */}
          <div className="absolute inset-0 backface-hidden rotate-y-180 flex flex-col justify-center">
             <div className="bg-white/90 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 sm:p-10 shadow-2xl shadow-[#FF3366]/10 relative overflow-hidden h-full flex flex-col justify-center">

              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-[#FF3366]/10 text-[#FF3366] mb-3 shadow-sm border border-[#FF3366]/20">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">JOIN PROFILEIQ</h2>
              </div>

              <form onSubmit={handleRegister} className="space-y-4">
                {isFlipped && error && (
                  <div className="bg-rose-50 text-rose-600 p-3 rounded-xl text-sm font-medium text-center animate-scale-in border border-rose-100">
                    {error}
                  </div>
                )}
                {isFlipped && success && (
                  <div className="bg-emerald-50 text-emerald-600 p-3 rounded-xl text-sm font-medium text-center animate-scale-in border border-emerald-100">
                    {success}
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 text-left">
                    <Input
                      label="Full Name"
                      type="text"
                      required
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full bg-white border-slate-200 focus:border-[#635BFF] py-3 rounded-xl font-medium"
                    />
                  </div>
                  <div className="space-y-1 text-left">
                    <Input
                      label="Employee ID"
                      type="text"
                      required
                      value={regEmployeeId}
                      onChange={(e) => setRegEmployeeId(e.target.value)}
                      placeholder="EMP-1001"
                      className="w-full bg-white border-slate-200 focus:border-[#635BFF] py-3 rounded-xl font-medium"
                    />
                  </div>
                </div>
                
                <div className="space-y-1 text-left">
                  <Input
                    label="Email address"
                    type="email"
                    required
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full bg-white border-slate-200 focus:border-[#635BFF] py-3 rounded-xl font-medium"
                  />
                </div>

                <div className="space-y-1 text-left">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Account Role</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button type="button" onClick={() => setRegRole('employee')} className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${regRole === 'employee' ? 'bg-[#635BFF]/10 border-[#635BFF] text-[#635BFF]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <Briefcase className="w-4 h-4" /> Employee
                    </button>
                    <button type="button" onClick={() => setRegRole('manager')} className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${regRole === 'manager' ? 'bg-[#FF3366]/10 border-[#FF3366] text-[#FF3366]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <Building2 className="w-4 h-4" /> Manager
                    </button>
                    <button type="button" onClick={() => setRegRole('admin')} className={`py-2 px-2 text-xs font-bold rounded-lg border flex flex-col items-center gap-1 transition-all ${regRole === 'admin' ? 'bg-[#27C93F]/10 border-[#27C93F] text-[#27C93F]' : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                      <Sparkles className="w-4 h-4" /> Admin
                    </button>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1 relative text-left">
                    <Input
                      label="Password"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-slate-200 focus:border-[#635BFF] py-3 rounded-xl pr-10 font-medium"
                    />
                  </div>
                  <div className="space-y-1 text-left relative">
                    <Input
                      label="Confirm"
                      type={showPassword ? 'text' : 'password'}
                      required
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-white border-slate-200 focus:border-[#635BFF] py-3 rounded-xl font-medium pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-[32px] text-slate-400 hover:text-[#635BFF] transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                
                <Button type="submit" className="w-full mt-2 py-4 text-base font-bold rounded-xl bg-gradient-to-r from-[#FF3366] to-[#FF8A8A] border-none text-white shadow-[0_10px_30px_-6px_rgba(255,51,102,0.4)] hover:shadow-[0_15px_40px_-6px_rgba(255,51,102,0.5)] transition-all hover:-translate-y-0.5" disabled={loading}>
                  {loading ? 'Creating...' : 'Create account'}
                </Button>
              </form>
              
              <div className="mt-6 text-center text-sm font-medium text-slate-500">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => { setIsFlipped(false); setError(''); navigate('/login', { replace: true }); }}
                  className="text-[#635BFF] hover:text-[#A07CFF] transition-colors font-bold"
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
