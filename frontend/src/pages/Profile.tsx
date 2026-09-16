import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, User, Lock, Bell, Eye, EyeOff, Camera } from 'lucide-react';
import api from '../lib/api';

export function Profile() {
  const { user } = useAuth();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'skills'>('profile');

  const skills = ['React.js', 'TypeScript', 'Node.js', 'System Design', 'Figma', 'Python'];

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      await api.put('/api/users/profile', { full_name: fullName, target_role: targetRole, experience_level: experienceLevel });
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to update profile. Please try again.' });
    } finally {
      setLoading(false);
      setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'skills', label: 'Skills & Goals', icon: Bell },
  ];

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Settings</h1>
          <p className="text-gray-500 mt-2 text-lg">Manage your account details, security, and career preferences.</p>
        </div>

        {/* Profile Card */}
        <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#A07CFF] p-0.5 shadow-lg">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={user?.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name || 'User'}&backgroundColor=F0F0EA`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <button className="absolute -bottom-1 -right-1 w-7 h-7 bg-[#635BFF] text-white rounded-full flex items-center justify-center shadow-sm hover:bg-[#5046e5] transition-colors">
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">{user?.full_name}</h2>
            <p className="text-gray-500">{user?.email}</p>
            <span className="mt-1 inline-block px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-100 capitalize">
              {user?.role}
            </span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-2xl w-fit">
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                activeTab === tab.key 
                  ? 'bg-white text-[#635BFF] shadow-sm' 
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'profile' && (
          <div className="bg-white p-8 rounded-3xl border border-dash-border shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Personal Information</h3>
            <form onSubmit={handleSaveProfile} className="space-y-6">
              
              {message.text && (
                <div className={`p-4 rounded-xl text-sm font-medium ${message.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {message.text}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Full Name</label>
                  <input 
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    required 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email Address</label>
                  <input
                    type="email"
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-gray-400 mt-1">Email cannot be changed.</p>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Employee ID</label>
                <input
                  className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-100 px-4 py-2 text-sm text-gray-400 cursor-not-allowed"
                  value={user?.employee_id || '—'}
                  disabled
                />
              </div>

              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={loading} className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'security' && (
          <div className="bg-white p-8 rounded-3xl border border-dash-border shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-6">Change Password</h3>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Current Password</label>
                <div className="relative">
                  <input 
                    type={showCurrentPw ? 'text' : 'password'}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all pr-12"
                    value={currentPassword} 
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowCurrentPw(!showCurrentPw)}>
                    {showCurrentPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">New Password</label>
                <div className="relative">
                  <input 
                    type={showNewPw ? 'text' : 'password'}
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all pr-12"
                    value={newPassword} 
                    onChange={(e) => setNewPassword(e.target.value)} 
                  />
                  <button type="button" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" onClick={() => setShowNewPw(!showNewPw)}>
                    {showNewPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2">
                  <Lock className="w-4 h-4" /> Update Password
                </Button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'skills' && (
          <div className="bg-white p-8 rounded-3xl border border-dash-border shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Career Goals & Skills</h3>
            <p className="text-gray-500 mb-6 text-sm">Keep this updated to improve your AI Match Score on internal opportunities.</p>
            
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Target Job Title</label>
                  <input 
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
                    placeholder="e.g. Senior Frontend Developer"
                    value={targetRole} 
                    onChange={(e) => setTargetRole(e.target.value)} 
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Experience Level</label>
                  <select
                    className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
                    value={experienceLevel}
                    onChange={(e) => setExperienceLevel(e.target.value)}
                  >
                    <option value="">Select level...</option>
                    <option value="Entry Level (0-2 years)">Entry Level (0-2 years)</option>
                    <option value="Mid Level (3-5 years)">Mid Level (3-5 years)</option>
                    <option value="Senior Level (5-10 years)">Senior Level (5-10 years)</option>
                    <option value="Executive / Lead (10+ years)">Executive / Lead (10+ years)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Verified Skills</label>
                <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-[60px]">
                  {skills.map(skill => (
                    <span key={skill} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-[#635BFF]/30 hover:text-[#635BFF] transition-colors cursor-pointer">
                      {skill}
                      <span className="text-gray-400 hover:text-red-500 ml-1 leading-none">&times;</span>
                    </span>
                  ))}
                </div>
                <p className="text-xs text-gray-400 mt-2">Click a skill to remove it. Your manager can also add verified skills to your profile.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2" onClick={handleSaveProfile} disabled={loading}>
                  <Save className="w-4 h-4" /> Save Goals & Skills
                </Button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
