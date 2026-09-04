import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Save } from 'lucide-react';
import api from '../lib/api';

export function Profile() {
  const { user, login } = useAuth();
  
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [targetRole, setTargetRole] = useState(user?.target_role || '');
  const [experienceLevel, setExperienceLevel] = useState(user?.experience_level || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await api.put('/api/users/profile', {
        full_name: fullName,
        target_role: targetRole,
        experience_level: experienceLevel
      });
      
      // Update local context manually or re-fetch me
      const meResponse = await api.get('/api/auth/me');
      
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile', error);
      setMessage('Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account details and preferences.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSave} className="space-y-6">
              
              {message && (
                <div className={`p-4 rounded-md text-sm ${message.includes('success') ? 'bg-emerald-50 text-emerald-600' : 'bg-red-50 text-red-600'}`}>
                  {message}
                </div>
              )}
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                />
                
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm text-gray-500 cursor-not-allowed"
                    value={user?.email || ''}
                    disabled
                  />
                  <p className="text-xs text-gray-500 mt-1">Email cannot be changed.</p>
                </div>
              </div>
              
              <hr className="border-gray-200" />
              
              <h3 className="text-lg font-medium text-gray-900">Career Goals</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <Input
                  label="Target Job Title"
                  placeholder="e.g. Full Stack Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
                
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Experience Level
                  </label>
                  <select
                    className="flex h-10 w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
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

              <div className="pt-4 flex justify-end">
                <Button type="submit" disabled={loading} className="gap-2">
                  <Save className="w-4 h-4" />
                  {loading ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
