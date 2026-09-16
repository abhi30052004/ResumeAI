import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { Briefcase, Target, TrendingUp, Sparkles, User, MapPin, ChevronRight, FolderKanban, FileText } from 'lucide-react';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    profile_completeness: 0,
    match_score: 0,
    active_applications: 0,
    projects_completed: 0
  });
  const [opportunities, setOpportunities] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, oppsRes] = await Promise.all([
          api.get('/api/dashboard/stats'),
          api.get('/api/manager/jds/all')
        ]);
        
        setStats({
          profile_completeness: statsRes.data.profile_completeness || 0,
          match_score: statsRes.data.best_match_score || 0,
          active_applications: statsRes.data.active_applications || 0,
          projects_completed: statsRes.data.projects_completed || 0
        });
        
        setOpportunities(oppsRes.data.slice(0, 3)); // Show top 3
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center h-full">
        <Spinner className="w-8 h-8 text-[#635BFF]" />
      </div>
    );
  }

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white p-8 rounded-3xl border border-dash-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-[#635BFF]/10 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
          
          <div className="relative z-10 flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#635BFF] to-[#A07CFF] p-0.5 shadow-lg">
              <div className="w-full h-full bg-white rounded-2xl flex items-center justify-center overflow-hidden">
                <img 
                  src={user?.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${user?.full_name || 'User'}&backgroundColor=F0F0EA`} 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                Welcome back, {user?.full_name?.split(' ')[0]} 👋
              </h1>
              <p className="text-gray-500 mt-2 text-lg">
                Software Engineer • Employee ID: {user?.employee_id}
              </p>
            </div>
          </div>
          
          <div className="relative z-10 flex items-center gap-3">
            <Link to="/dashboard/settings">
              <Button variant="outline" className="border-dash-border">Edit Profile</Button>
            </Link>
            <Link to="/dashboard/opportunities">
              <Button className="bg-[#635BFF] hover:bg-[#5046e5] text-white">Find Projects</Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard 
            icon={<User className="w-5 h-5 text-[#635BFF]" />} 
            title="Profile Completeness" 
            value={`${stats.profile_completeness}%`} 
            trend="+5% this week"
          />
          <StatCard 
            icon={<Target className="w-5 h-5 text-emerald-500" />} 
            title="Avg Match Score" 
            value={`${stats.match_score}%`} 
            trend="Top 10% in org"
          />
          <StatCard 
            icon={<Briefcase className="w-5 h-5 text-[#FF3366]" />} 
            title="Active Applications" 
            value={stats.active_applications.toString()} 
            trend="1 interviewing"
          />
          <StatCard 
            icon={<FolderKanban className="w-5 h-5 text-blue-500" />} 
            title="Projects Completed" 
            value={stats.projects_completed.toString()} 
            trend="Highly rated"
          />
        </div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Suggested Opportunities */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900">Recommended for You</h3>
              <Link to="/dashboard/opportunities" className="text-[#635BFF] text-sm font-medium hover:underline flex items-center">
                View all <ChevronRight className="w-4 h-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid gap-4">
              {opportunities.map((opp) => (
                <div key={opp.id} className="bg-white p-5 rounded-2xl border border-dash-border shadow-sm hover:shadow-md transition-all group cursor-pointer" onClick={() => navigate('/dashboard/opportunities')}>
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-bold text-gray-900 group-hover:text-[#635BFF] transition-colors">{opp.title}</h4>
                      <p className="text-sm text-gray-500 mt-1">{opp.team}</p>
                    </div>
                    <div className="flex flex-col items-end">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                        <Sparkles className="w-3 h-3" /> {opp.match}% Match
                      </span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {opp.location}</span>
                    <span className="flex items-center gap-1.5"><TrendingUp className="w-4 h-4" /> Actively hiring</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions & Skills */}
          <div className="space-y-8">
            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start border-dash-border hover:bg-dash-bg" onClick={() => navigate('/dashboard/resume')}>
                  <FileText className="w-4 h-4 mr-3 text-gray-400" /> Update Resume
                </Button>
                <Button variant="outline" className="w-full justify-start border-dash-border hover:bg-dash-bg" onClick={() => navigate('/dashboard/applications')}>
                  <Briefcase className="w-4 h-4 mr-3 text-gray-400" /> View Pending Applications
                </Button>
              </div>
            </div>

            {/* Top Skills */}
            <div className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm">
              <h3 className="font-bold text-gray-900 mb-4">Your Verified Skills</h3>
              <div className="flex flex-wrap gap-2">
                {user?.skills?.length ? (
                  user.skills.map((skill: string) => (
                    <span key={skill} className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium border border-gray-200">
                      {skill}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500 text-sm">No skills added yet.</span>
                )}
              </div>
              <Button variant="ghost" className="w-full mt-4 text-[#635BFF] hover:bg-[#635BFF]/10" onClick={() => navigate('/dashboard/settings')}>
                Manage Skills
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatCard({ icon, title, value, trend }: { icon: React.ReactNode, title: string, value: string, trend: string }) {
  return (
    <Card className="rounded-3xl border-dash-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
            {icon}
          </div>
          <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">{trend}</span>
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500 mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-gray-900">{value}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
