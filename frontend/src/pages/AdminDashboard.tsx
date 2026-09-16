import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Users, Building, FolderKanban, CheckCircle, Activity, ArrowRight, UserPlus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export function AdminDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    total_employees: 0,
    pending_managers: 0,
    active_clients: 0,
    benched_employees: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, usersRes] = await Promise.all([
          api.get('/api/projects/stats'),
          api.get('/api/admin/users')
        ]);
        setStats(statsRes.data);
        
        // Mock activity feed using recent users
        const recentUsers = usersRes.data.slice(0, 4).map((u: any) => ({
          user: u.name,
          action: `registered as ${u.role}`,
          time: u.status === 'active' ? 'Recently' : 'Pending Approval',
          status: u.status === 'active' ? 'success' : 'pending'
        }));
        setActivities(recentUsers);
      } catch (error) {
        console.error('Failed to fetch admin dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);
  
  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-gradient-to-br from-[#635BFF] to-[#A07CFF] rounded-2xl flex items-center justify-center text-white shadow-sm">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Admin Overview</h1>
              <p className="text-gray-500 mt-1">Platform administration and resource management.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to="/admin/managers">
              <Button className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2">
                <UserPlus className="w-4 h-4" /> Pending Approvals
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">+12 this month</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Total Employees</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.total_employees}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <ShieldAlert size={24} />
              </div>
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Requires action</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Pending Managers</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.pending_managers}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 group-hover:scale-110 transition-transform">
                <Building size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">4 industries</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Active Clients</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.active_clients}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <CheckCircle size={24} />
              </div>
              <span className="text-sm font-medium text-gray-500 bg-gray-50 px-2 py-1 rounded-lg">Ready to allocate</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Benched Employees</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.benched_employees}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#635BFF]" /> Platform Activity
              </h3>
            </div>
            
            <div className="bg-white rounded-3xl border border-dash-border p-6 shadow-sm">
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-2.5 h-2.5 rounded-full ${
                          log.status === 'pending' ? 'bg-orange-500' :
                          log.status === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                        }`} />
                        {i !== activities.length - 1 && <div className="w-px h-full bg-gray-200 my-1" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm text-gray-800">
                          <span className="font-semibold">{log.user}</span> {log.action}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">{log.time}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No recent activity found.</p>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-gray-900">Quick Links</h3>
            
            <div className="bg-white rounded-3xl border border-dash-border p-4 shadow-sm flex flex-col gap-2">
              <Link to="/admin/employees" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100"><Users className="w-5 h-5" /></div>
                  <span className="font-semibold text-gray-700">Manage Employees</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              
              <Link to="/admin/projects" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-50 text-blue-600 rounded-lg group-hover:bg-blue-100"><FolderKanban className="w-5 h-5" /></div>
                  <span className="font-semibold text-gray-700">Global Projects</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>

              <Link to="/admin/clients" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100"><Building className="w-5 h-5" /></div>
                  <span className="font-semibold text-gray-700">Client Directory</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
