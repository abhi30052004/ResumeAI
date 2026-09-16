import React, { useState, useEffect } from 'react';
import { Search, Users, Filter, Briefcase, TrendingUp, Mail, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export function ManagerTeam() {
  const [searchQuery, setSearchQuery] = useState('');
  const [team, setTeam] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const response = await api.get('/api/manager/team');
        setTeam(response.data);
      } catch (error) {
        console.error('Failed to fetch team data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  const filteredTeam = team.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Team</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage your direct reports and view their ProfileIQ analytics.</p>
          </div>
        </div>

        {/* Directory */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <Users size={20} className="text-[#635BFF]" /> Team Directory
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search team..."
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
              <div className="col-span-full text-center py-10 text-gray-500">Loading team data...</div>
            ) : filteredTeam.length === 0 ? (
              <div className="col-span-full text-center py-10 text-gray-500">
                No team members found.
              </div>
            ) : filteredTeam.map(member => (
              <div key={member.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col group">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <img 
                      src={`https://api.dicebear.com/7.x/notionists/svg?seed=${member.name}&backgroundColor=F0F0EA`} 
                      alt="Profile" 
                      className="w-12 h-12 rounded-full border border-gray-200 bg-slate-100"
                    />
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#635BFF] transition-colors">{member.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{member.role}</p>
                    </div>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="flex flex-wrap gap-1.5">
                    {member.skills && member.skills.map((skill: string) => (
                      <span key={skill} className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-600 rounded-md">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Briefcase className="w-3.5 h-3.5" /> Status
                    </div>
                    <span className={`text-sm font-bold ${member.status === 'Allocated' ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {member.status}
                    </span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <TrendingUp className="w-3.5 h-3.5" /> Profile Score
                    </div>
                    <span className="text-sm font-bold text-gray-900">{member.score || 0}/100</span>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-200 gap-2 h-9 text-gray-600 hover:text-gray-900"
                    onClick={() => {
                      if (member.email) window.location.href = `mailto:${member.email}`;
                      else alert('Email address not found for this user.');
                    }}
                  >
                    <Mail className="w-4 h-4" /> Message
                  </Button>
                  <Button 
                    variant="outline" 
                    className="flex-1 border-gray-200 gap-2 h-9 text-[#635BFF] hover:bg-indigo-50 border-[#635BFF]/30"
                    onClick={() => alert(`Profile view for ${member.name} is coming soon!`)}
                  >
                    Profile <ExternalLink className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
