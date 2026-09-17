import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Save, User, Lock, Bell, Eye, EyeOff, Camera } from 'lucide-react';
import api from '../lib/api';

export function Profile() {
  const { user, updateUser } = useAuth();
  const { toast } = useToast();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [employeeId, setEmployeeId] = useState(user?.employee_id || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'security' | 'skills' | 'resume'>('profile');
  const [uploadingResume, setUploadingResume] = useState(false);

  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  const PREDEFINED_SKILLS = [
    'React', 'Node.js', 'Python', 'TypeScript', 'JavaScript', 'AWS', 'Docker',
    'Kubernetes', 'Java', 'C++', 'Go', 'Rust', 'SQL', 'NoSQL', 'MongoDB',
    'PostgreSQL', 'GraphQL', 'REST API', 'Figma', 'UI/UX', 'Machine Learning',
    'Data Science', 'FastAPI', 'Express', 'Django', 'Spring Boot', 'Angular', 'Vue.js'
  ];

  const handleAddSkill = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newSkill.trim()) {
      e.preventDefault();
      if (!skills.includes(newSkill.trim())) {
        setSkills([...skills, newSkill.trim()]);
      }
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(s => s !== skillToRemove));
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await api.put('/api/users/profile', { 
        full_name: fullName,
        employee_id: employeeId,
        target_role: targetRole, 
        experience_level: experienceLevel,
        skills: skills 
      });
      updateUser(response.data);
      toast('Profile updated successfully!', 'success');
    } catch (error) {
      toast('Failed to update profile. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword || !newPassword) {
      toast('Please fill in both password fields', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await api.put('/api/users/password', {
        current_password: currentPassword,
        new_password: newPassword
      });
      toast('Password updated successfully!', 'success');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast(error.response?.data?.detail || 'Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { key: 'profile', label: 'Profile', icon: User },
    { key: 'security', label: 'Security', icon: Lock },
    { key: 'skills', label: 'Skills & Goals', icon: Bell },
    { key: 'resume', label: 'Resume', icon: Save },
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
                  className="flex h-11 w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 transition-all"
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  placeholder="e.g. EMP-1234"
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
            <form onSubmit={handlePasswordChange} className="space-y-6">
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
                <Button type="submit" disabled={loading} className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2">
                  <Lock className="w-4 h-4" /> {loading ? 'Updating...' : 'Update Password'}
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
                <div className="flex flex-col gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 min-h-[60px]">
                  <div className="flex flex-wrap gap-2">
                    {skills.map(skill => (
                      <span key={skill} onClick={() => handleRemoveSkill(skill)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white text-gray-700 rounded-lg text-sm font-medium border border-gray-200 hover:border-red-200 hover:text-red-600 transition-colors cursor-pointer group">
                        {skill}
                        <span className="text-gray-400 group-hover:text-red-500 ml-1 leading-none">&times;</span>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2 relative">
                    <input
                      type="text"
                      list="skills-suggestions"
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      onKeyDown={handleAddSkill}
                      placeholder="Type a skill and press Enter to add..."
                      className="flex h-10 w-full rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm focus:border-[#635BFF] focus:outline-none focus:ring-1 focus:ring-[#635BFF] transition-all"
                    />
                    <datalist id="skills-suggestions">
                      {PREDEFINED_SKILLS.filter(s => !skills.includes(s)).map(s => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                    <Button 
                      type="button"
                      onClick={(e) => handleAddSkill({ key: 'Enter', preventDefault: () => {} } as any)} 
                      className="h-10 bg-[#635BFF] hover:bg-[#5046e5] text-white px-4 shrink-0 rounded-lg"
                    >
                      Add
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-2">Click a skill to remove it. You can select from suggestions or type your own. These skills are used for AI Matching.</p>
              </div>

              <div className="flex justify-end pt-2">
                <Button className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2" onClick={handleSaveProfile} disabled={loading}>
                  <Save className="w-4 h-4" /> Save Goals & Skills
                </Button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'resume' && (
          <div className="bg-white p-8 rounded-3xl border border-dash-border shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-2">Resume Document</h3>
            <p className="text-gray-500 mb-6 text-sm">Upload your latest resume (PDF or DOCX). AI will use this to match you with internal opportunities.</p>
            
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-2xl p-10 bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer relative"
                 onClick={() => document.getElementById('resume-upload')?.click()}>
              {user?.has_resume ? (
                <>
                  <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                    <Save className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Resume Active</h4>
                  <p className="text-sm text-gray-500 mt-1 text-center">Your resume is uploaded and being used for AI matching.</p>
                  <p className="text-sm font-medium text-[#635BFF] mt-4">Click to upload a newer version</p>
                </>
              ) : (
                <>
                  <div className="w-16 h-16 bg-[#635BFF]/10 text-[#635BFF] rounded-full flex items-center justify-center mb-4">
                    <Camera className="w-8 h-8" />
                  </div>
                  <h4 className="text-lg font-bold text-gray-900">Upload Resume</h4>
                  <p className="text-sm text-gray-500 mt-1 text-center">Click to browse or drag and drop your PDF/DOCX file here.</p>
                </>
              )}
              
              {uploadingResume && (
                <div className="absolute inset-0 bg-white/80 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <div className="animate-spin w-8 h-8 border-4 border-[#635BFF] border-t-transparent rounded-full" />
                </div>
              )}
              
              <input 
                id="resume-upload" 
                type="file" 
                accept=".pdf,.docx" 
                className="hidden" 
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  
                  setUploadingResume(true);
                  const formData = new FormData();
                  formData.append('file', file);
                  
                  try {
                    const response = await api.post('/api/users/resume', formData, {
                      headers: { 'Content-Type': 'multipart/form-data' }
                    });
                    updateUser(response.data);
                    toast('Resume uploaded successfully!', 'success');
                  } catch (error) {
                    toast('Failed to upload resume. Please try a valid PDF or DOCX file.', 'error');
                  } finally {
                    setUploadingResume(false);
                    if (e.target) e.target.value = '';
                  }
                }}
              />
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
