import React, { useState, useEffect } from 'react';
import { Search, Users, Filter, Sparkles, MapPin, Mail, ArrowLeft, BrainCircuit } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../lib/api';

export function ManagerCandidates() {
  const { jdId } = useParams<{ jdId: string }>();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [jd, setJd] = useState<any>(null);

  useEffect(() => {
    if (jdId) {
      fetchMatches();
    } else {
      // If no JD ID, maybe redirect back
      navigate('/manager/jds');
    }
  }, [jdId]);

  const fetchMatches = async () => {
    try {
      const response = await api.get(`/api/manager/jds/${jdId}/matches`);
      setCandidates(response.data.matches);
      setJd(response.data.jd);
    } catch (error) {
      console.error('Failed to fetch candidates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (appId: string, currentStatus: string) => {
    // For MVP, we can keep the application logic if they "allocate" a candidate.
    console.log("Allocate candidate", appId);
  };

  const filteredCandidates = candidates.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <Link to="/manager/jds" className="inline-flex items-center gap-2 text-gray-500 hover:text-gray-900 transition-colors mb-4 text-sm font-medium">
              <ArrowLeft className="w-4 h-4" /> Back to Requirements
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Candidates Match</h1>
            <p className="text-gray-500 mt-2 text-lg">
              {jd ? `Reviewing internal matches for: ${jd.title}` : 'Reviewing top internal talent matches for your project requirements.'}
            </p>
          </div>
        </div>

        {/* Directory Grid */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4 bg-gradient-to-r from-purple-50 to-indigo-50/30">
            <div className="flex items-center gap-2 text-[#635BFF] font-bold text-lg">
              <BrainCircuit size={24} /> AI Recommendations
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Filter candidates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 text-sm bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all shadow-sm"
                />
              </div>
              <Button variant="outline" className="border-dash-border bg-white shrink-0 shadow-sm">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col p-6 bg-gray-50/50 gap-6">
            {loading ? (
              <div className="text-center py-10 text-gray-500">Running AI match analysis...</div>
            ) : filteredCandidates.map((candidate, index) => (
              <div key={candidate.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col group relative overflow-hidden">
                
                {index === 0 && candidate.match_score >= 90 && (
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-emerald-500 to-teal-400 text-white text-[10px] uppercase tracking-wider font-bold px-4 py-1.5 rounded-bl-xl flex items-center gap-1.5 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5" /> Best Match
                  </div>
                )}

                <div className="flex flex-col md:flex-row gap-6">
                  {/* Left Column: Profile */}
                  <div className="flex flex-col gap-4 md:w-1/4 shrink-0 border-r border-gray-100 pr-6">
                    <div className="flex items-center gap-4">
                      <img 
                        src={candidate.photo_url || `https://api.dicebear.com/7.x/notionists/svg?seed=${candidate.name}&backgroundColor=F0F0EA`} 
                        alt="Profile" 
                        className="w-16 h-16 rounded-full border-2 border-gray-100 bg-slate-100 shadow-sm"
                      />
                      <div>
                        <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#635BFF] transition-colors">{candidate.name}</h3>
                        <p className="text-sm text-gray-500 font-medium">{candidate.role}</p>
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-2 mt-2">
                      <div className="p-3 bg-indigo-50/50 rounded-xl border border-indigo-100 flex justify-between items-center">
                        <div className="flex items-center gap-1.5 text-xs text-indigo-700 font-semibold uppercase tracking-wider">
                          <Sparkles className="w-3.5 h-3.5" /> AI Score
                        </div>
                        <span className="text-xl font-black text-indigo-700">{candidate.match_score}%</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
                        <MapPin className="w-4 h-4 text-gray-400" /> {candidate.location || 'Remote'}
                      </div>
                    </div>
                  </div>

                  {/* Right Column: AI Explanation & Actions */}
                  <div className="flex flex-col flex-1 gap-4">
                    <div className="bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 p-4">
                      <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                        <BrainCircuit className="w-4 h-4 text-purple-500" /> AI Rationale
                      </h4>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        {candidate.ai_explanation}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2 mt-auto">
                      {candidate.matched_skills.map((skill: string) => (
                        <span key={skill} className="px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-lg text-xs font-medium">
                          ✓ {skill}
                        </span>
                      ))}
                      {candidate.missing_skills?.map((skill: string) => (
                        <span key={skill} className="px-2.5 py-1 bg-gray-50 text-gray-500 border border-gray-200 rounded-lg text-xs font-medium">
                          Missing: {skill}
                        </span>
                      ))}
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-gray-100 mt-2">
                      <Button 
                        variant="outline" 
                        className="flex-1 border-gray-200 text-gray-700"
                        onClick={() => window.open(`/dashboard/profile/${candidate.id}`, '_blank')}
                      >
                        View Full Profile
                      </Button>
                      <Button className="flex-1 bg-[#635BFF] hover:bg-[#5046e5]">
                        Request Allocation
                      </Button>
                    </div>
                  </div>
                </div>

              </div>
            ))}
          </div>

          {!loading && filteredCandidates.length === 0 && (
            <div className="p-12 text-center border-t border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No candidate matches found matching "{searchQuery}"</p>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
