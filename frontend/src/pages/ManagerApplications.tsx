import React, { useState, useEffect } from 'react';
import { Search, Briefcase, Filter, Check, X, Sparkles, MapPin, Mail, Calendar } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export function ManagerApplications() {
  const [searchQuery, setSearchQuery] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/manager/applications');
      setApplications(response.data);
    } catch (error) {
      console.error('Failed to fetch applications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'Applied' ? 'Under Review' : 
                       currentStatus === 'Under Review' ? 'Interview' : 
                       'Offer';
    if (currentStatus === 'Offer') return;

    try {
      await api.patch(`/api/manager/applications/${appId}`, { status: nextStatus });
      fetchApplications();
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const filteredApps = applications.filter(app => 
    app.applicant.toLowerCase().includes(searchQuery.toLowerCase()) || 
    app.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Application Review</h1>
            <p className="text-gray-500 mt-2 text-lg">Review internal candidates applying for your open roles.</p>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <Briefcase size={20} className="text-[#635BFF]" /> Candidates
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search candidates..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-gray-50/50">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">Loading applications...</div>
            ) : filteredApps.map(app => (
              <div key={app.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
                
                {app.match >= 90 && (
                  <div className="absolute top-0 right-0 bg-emerald-500 text-white text-[10px] font-bold px-3 py-1 rounded-bl-lg flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Top Match
                  </div>
                )}

                <div className="flex items-start gap-4 mb-4 mt-2">
                  <img 
                    src={`https://api.dicebear.com/7.x/notionists/svg?seed=${app.applicant}&backgroundColor=F0F0EA`} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border border-gray-200 bg-slate-100"
                  />
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#635BFF] transition-colors">{app.applicant}</h3>
                    <p className="text-sm text-gray-500 font-medium">{app.currentRole}</p>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-2">Applied For</p>
                  <div className="font-semibold text-gray-800 bg-gray-50 px-3 py-2 rounded-lg border border-gray-100">
                    {app.role}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                       Status
                    </div>
                    <span className={`text-sm font-bold ${
                      app.status === 'Applied' ? 'text-gray-700' :
                      app.status === 'Under Review' ? 'text-blue-600' :
                      'text-emerald-600'
                    }`}>
                      {app.status}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Sparkles className="w-3.5 h-3.5" /> Match Score
                    </div>
                    <span className={`text-sm font-bold ${app.match >= 90 ? 'text-emerald-600' : 'text-gray-900'}`}>{app.match}%</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-200 gap-2 h-9 text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      if (app.email) window.location.href = `mailto:${app.email}`;
                      else alert('Email address not found for this applicant.');
                    }}
                  >
                    <Mail className="w-4 h-4" /> Message
                  </Button>
                  <Button 
                    className="flex-1 bg-[#635BFF] hover:bg-[#5046e5] h-9 gap-2"
                    onClick={() => handleUpdateStatus(app.id, app.status)}
                    disabled={app.status === 'Offer'}
                  >
                    {app.status === 'Applied' ? 'Review' : 
                     app.status === 'Under Review' ? 'Interview' : 
                     app.status === 'Interview' ? 'Offer' : 'Done'}
                  </Button>
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredApps.length === 0 && (
            <div className="p-12 text-center border-t border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No applications found matching "{searchQuery}"</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
