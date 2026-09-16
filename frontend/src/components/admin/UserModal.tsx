import React, { useState } from 'react';
import { useToast } from '../../context/ToastContext';
import { X, User as UserIcon, Mail, Briefcase, Star, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import api from '../../lib/api';
import { User } from '../../context/AuthContext';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  user?: User | null; // If null, it's a "Create User" mode
}

export function UserModal({ isOpen, onClose, onSuccess, user }: UserModalProps) {
  const { toast } = useToast();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: user?.full_name || '',
    email: user?.email || '',
    role: user?.role || 'employee',
    status: user?.status || 'active',
  });

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (user) {
        // Update user
        await api.put(`/api/admin/users/${user.id}/status`, {
          account_status: user.account_status,
          status: formData.status
        });
        // Note: Full edit endpoint might need to be implemented in backend if we want to change name/email
      } else {
        // Create user (assuming backend has a register endpoint for admin)
        // For now, this is a placeholder as PRD requires creating employees
        toast("Create User API integration needed.");
      }
      onSuccess();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            {user ? 'User Profile & Settings' : 'Create New User'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full text-gray-500 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto">
          {user ? (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
                <img 
                  src={user.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.full_name}&backgroundColor=F0F0EA`} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full bg-slate-100 border-2 border-gray-200"
                />
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{user.full_name}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-1"><Mail className="w-4 h-4" /> {user.email}</p>
                </div>
              </div>

              {/* Status & Role Edit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">System Role</label>
                  <select 
                    value={formData.role}
                    onChange={e => setFormData({ ...formData, role: e.target.value as any })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#635BFF]/20 outline-none"
                    disabled={true} // Disable for MVP unless endpoint exists
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">Account Status</label>
                  <select 
                    value={formData.status}
                    onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#635BFF]/20 outline-none"
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Deactivated</option>
                  </select>
                </div>
              </div>

              {/* Employee specific data (Skills, Projects) */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-[#FFBD2E]" /> Extracted Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skills && user.skills.length > 0 ? (
                    user.skills.map(skill => (
                      <span key={skill} className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded-full text-xs font-semibold border border-indigo-100">
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-sm text-gray-400">No skills identified yet.</span>
                  )}
                </div>
              </div>

              <div>
                <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2"><Briefcase className="w-4 h-4 text-[#27C93F]" /> Project History</h4>
                {user.project_history && user.project_history.length > 0 ? (
                  <div className="space-y-3">
                    {user.project_history.map((proj, idx) => (
                      <div key={idx} className="p-3 border border-gray-100 rounded-xl bg-gray-50/50 text-sm">
                        <div className="font-bold text-gray-900">{proj.project_name}</div>
                        <div className="text-gray-500">{proj.role}</div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <span className="text-sm text-gray-400">No project history available.</span>
                )}
              </div>

            </div>
          ) : (
            <form id="user-form" onSubmit={handleSubmit} className="space-y-4">
              {/* Create User Form */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                <input required type="text" value={formData.full_name} onChange={e => setFormData({...formData, full_name: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Email</label>
                <input required type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">Role</label>
                <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value as any})} className="w-full p-2.5 bg-gray-50 border border-gray-200 rounded-xl">
                  <option value="employee">Employee</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            </form>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            disabled={loading}
            className="bg-[#635BFF] text-white hover:bg-[#5046e5]"
          >
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
