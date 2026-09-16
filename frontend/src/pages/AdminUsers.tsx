import React, { useState, useEffect } from 'react';
import api from '../lib/api';
import { User } from '../context/AuthContext';
import { Loader2, Check, X, ShieldAlert, Users, Search, MoreHorizontal, Filter } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/api/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Failed to fetch users', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (userId: string, newAccountStatus: 'approved' | 'rejected', newStatus?: 'active' | 'inactive') => {
    try {
      const payload: any = { account_status: newAccountStatus };
      if (newStatus) payload.status = newStatus;

      await api.put(`/api/admin/users/${userId}/status`, payload);
      fetchUsers(); // Refresh
    } catch (error) {
      console.error('Failed to update status', error);
    }
  };

  const filteredUsers = users.filter(u => 
    u.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const pendingManagers = users.filter(u => u.role === 'manager' && u.account_status === 'pending');

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Loader2 className="w-8 h-8 animate-spin text-[#635BFF]" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Management</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage employees and approve manager accounts.</p>
          </div>
        </div>

        {/* Pending Approvals Section */}
        {pendingManagers.length > 0 && (
          <div className="bg-orange-50 border border-orange-200 rounded-3xl p-6 lg:p-8">
            <div className="flex items-center gap-3 mb-6 text-orange-800">
              <ShieldAlert className="w-7 h-7" />
              <h2 className="text-xl font-bold">Action Required: Pending Manager Approvals</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingManagers.map(manager => (
                <div key={manager.id} className="bg-white p-5 rounded-2xl border border-orange-100 shadow-sm flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={manager.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${manager.full_name}&backgroundColor=F0F0EA`} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full bg-slate-100 border border-gray-200"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{manager.full_name}</p>
                      <p className="text-xs text-gray-500 font-medium">{manager.email}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 mt-auto pt-2 border-t border-gray-100">
                    <Button 
                      onClick={() => handleStatusUpdate(manager.id, 'approved', 'active')}
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white gap-2 py-2"
                    >
                      <Check size={16} /> Approve
                    </Button>
                    <Button 
                      onClick={() => handleStatusUpdate(manager.id, 'rejected')}
                      variant="outline"
                      className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200 py-2 gap-2"
                    >
                      <X size={16} /> Reject
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Users Table */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <Users size={20} className="text-[#635BFF]" /> Directory
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search users..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all"
                />
              </div>
              <Button variant="outline" className="border-dash-border bg-white shrink-0">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/50 border-b border-dash-border text-gray-500 font-semibold">
                <tr>
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user.full_name}&backgroundColor=F0F0EA`} 
                          alt="Profile" 
                          className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200"
                        />
                        <div>
                          <div className="font-bold text-gray-900 group-hover:text-[#635BFF] transition-colors">{user.full_name}</div>
                          <div className="text-gray-500 mt-0.5">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 capitalize">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        user.role === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                        user.role === 'manager' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                        'bg-gray-100 text-gray-700 border-gray-200'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                       <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${
                        user.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 
                        user.status === 'inactive' ? 'bg-red-50 text-red-700 border-red-100' :
                        'bg-orange-50 text-orange-700 border-orange-100'
                      }`}>
                        {user.status || user.account_status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredUsers.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center">
                      <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                        <Search className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-gray-500 font-medium">No users found matching "{searchQuery}"</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          
        </div>

      </div>
    </div>
  );
}
