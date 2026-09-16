import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { Users, Briefcase, FileText, FolderKanban, ArrowRight, Activity, TrendingUp } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import api from '../lib/api';

export function ManagerDashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    direct_reports: 0,
    active_projects: 0,
    active_jds: 0,
    pending_applications: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, appsRes] = await Promise.all([
          api.get('/api/manager/stats'),
          api.get('/api/manager/applications')
        ]);
        setStats(statsRes.data);
        
        // Use recent applications as activity feed
        const recentApps = appsRes.data.slice(0, 3).map((app: any) => ({
          title: 'New Application',
          desc: `${app.applicant} applied for ${app.role}`,
          time: app.applied,
          type: 'application'
        }));
        setActivities(recentApps);
      } catch (error) {
        console.error('Failed to fetch manager dashboard data', error);
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
            <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white shadow-sm">
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Manager Dashboard</h1>
              <p className="text-gray-500 mt-1">Manage your team, projects, and internal hiring.</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Link to="/manager/jds">
              <Button className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2">
                <FileText className="w-4 h-4" /> Post New Role
              </Button>
            </Link>
          </div>
        </div>
        
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 transition-transform">
                <Users size={24} />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Direct Reports</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.direct_reports}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 group-hover:scale-110 transition-transform">
                <FolderKanban size={24} />
              </div>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Active Projects</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.active_projects}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                <FileText size={24} />
              </div>
              <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">1 closing soon</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Active Job Posts</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.active_jds}</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm flex flex-col gap-4 group hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-orange-50 flex items-center justify-center text-orange-600 group-hover:scale-110 transition-transform">
                <Briefcase size={24} />
              </div>
              <span className="text-sm font-semibold text-orange-600 bg-orange-50 px-2 py-1 rounded-lg">Needs review</span>
            </div>
            <div>
              <h3 className="font-medium text-gray-500 mb-1">Pending Applications</h3>
              <p className="text-4xl font-bold text-gray-900">{loading ? '-' : stats.pending_applications}</p>
            </div>
          </div>
        </div>

        {/* Two Column Layout for Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Activity className="w-5 h-5 text-[#635BFF]" /> Team & Hiring Updates
              </h3>
            </div>
            
            <div className="bg-white rounded-3xl border border-dash-border p-6 shadow-sm">
              <div className="space-y-6">
                {activities.length > 0 ? (
                  activities.map((log, i) => (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          log.type === 'application' ? 'bg-orange-50 text-orange-600' :
                          log.type === 'project' ? 'bg-emerald-50 text-emerald-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {log.type === 'application' ? <Briefcase className="w-5 h-5" /> : log.type === 'project' ? <FolderKanban className="w-5 h-5" /> : <TrendingUp className="w-5 h-5" />}
                        </div>
                        {i !== activities.length - 1 && <div className="w-px h-full bg-gray-100 my-2" />}
                      </div>
                      <div className="pb-4 pt-2">
                        <p className="text-sm font-bold text-gray-900">{log.title}</p>
                        <p className="text-sm text-gray-600 mt-1">{log.desc}</p>
                        <p className="text-xs text-gray-400 mt-1.5">{log.time}</p>
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
              <Link to="/manager/applications" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-50 text-orange-600 rounded-lg group-hover:bg-orange-100"><Briefcase className="w-5 h-5" /></div>
                  <span className="font-semibold text-gray-700">Review Applications</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>

              <Link to="/manager/team" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-100"><Users className="w-5 h-5" /></div>
                  <span className="font-semibold text-gray-700">Team Directory</span>
                </div>
                <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
              </Link>
              
              <Link to="/manager/projects" className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors group">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg group-hover:bg-emerald-100"><FolderKanban className="w-5 h-5" /></div>
                  <span className="font-semibold text-gray-700">Manage Projects</span>
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
