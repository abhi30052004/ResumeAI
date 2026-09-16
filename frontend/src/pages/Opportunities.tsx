import React, { useState, useEffect } from 'react';
import { Search, Filter, Sparkles, Building2, MapPin, Briefcase, ArrowRight, Clock } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export function Opportunities() {
  const [searchTerm, setSearchTerm] = useState('');
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [selectedOpp, setSelectedOpp] = useState<any | null>(null);

  useEffect(() => {
    const fetchOpportunities = async () => {
      try {
        const response = await api.get('/api/manager/jds/all');
        setOpportunities(response.data);
      } catch (error) {
        console.error('Failed to fetch opportunities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchOpportunities();
  }, []);

  const handleApply = async (id: string) => {
    try {
      setApplying(id);
      await api.post(`/api/manager/jds/${id}/apply`);
      alert('Successfully applied!');
    } catch (error: any) {
      alert(error.response?.data?.detail || 'Failed to apply. You may have already applied.');
    } finally {
      setApplying(null);
    }
  };

  const filtered = opportunities.filter(opp => 
    opp.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    opp.team.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Internal Opportunities</h1>
            <p className="text-gray-500 mt-2 text-lg">Find your next role within the company based on your ProfileIQ matches.</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search roles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 bg-white border border-dash-border rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] w-full md:w-64 transition-all"
              />
            </div>
            <Button 
              variant="outline" 
              className="border-dash-border bg-white gap-2"
              onClick={() => alert('Advanced filters are coming soon.')}
            >
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Job Listings */}
        <div className="grid gap-6">
          {loading ? (
            <div className="text-center py-10 text-gray-500">Loading opportunities...</div>
          ) : filtered.map(opp => (
            <div key={opp.id} className="bg-white p-6 rounded-3xl border border-dash-border shadow-sm hover:shadow-md transition-all flex flex-col md:flex-row gap-6">
              
              <div className="flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{opp.title}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                      <Building2 className="w-4 h-4" /> <span>{opp.team}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
                      <MapPin className="w-4 h-4" /> <span>{opp.location}</span>
                    </div>
                  </div>
                  <div className="hidden md:flex">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                      <Sparkles className="w-4 h-4" /> {opp.match}% AI Match
                    </span>
                  </div>
                </div>

                <p className="text-gray-600 line-clamp-2">{opp.description}</p>

                <div className="flex flex-col gap-2 mt-4">
                  {opp.matched_skills && opp.matched_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-1 rounded-lg border border-emerald-100 flex items-center gap-1">
                        <Sparkles className="w-3 h-3" /> Matched Skills
                      </span>
                      {opp.matched_skills.map((skill: string) => (
                        <span key={`matched-${skill}`} className="px-2.5 py-1 text-xs font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                  {opp.missing_skills && opp.missing_skills.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs font-semibold text-orange-700 bg-orange-50 px-2 py-1 rounded-lg border border-orange-100 flex items-center gap-1">
                        Upskill Path
                      </span>
                      {opp.missing_skills.map((skill: string) => (
                        <span key={`missing-${skill}`} className="px-2.5 py-1 text-xs font-medium bg-gray-50 text-gray-500 rounded-lg border border-gray-200">
                          {skill}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex md:flex-col justify-between items-center md:items-end md:w-48 border-t md:border-t-0 md:border-l border-dash-border pt-4 md:pt-0 md:pl-6">
                <div className="md:hidden">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    <Sparkles className="w-3 h-3" /> {opp.match}% Match
                  </span>
                </div>
                
                <div className="flex flex-col items-end gap-2 w-full">
                  <span className="text-xs text-gray-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> Posted {opp.posted}
                  </span>
                  <Button 
                    className="w-full bg-[#635BFF] hover:bg-[#5046e5] text-white"
                    onClick={() => handleApply(opp.id)}
                    disabled={applying === opp.id}
                  >
                    {applying === opp.id ? 'Applying...' : 'Apply Now'}
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="w-full text-gray-500 hover:text-gray-900"
                    onClick={() => setSelectedOpp(opp)}
                  >
                    View Details
                  </Button>
                </div>
              </div>

            </div>
          ))}

          {!loading && filtered.length === 0 && (
            <div className="text-center py-20 bg-white rounded-3xl border border-dash-border">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No opportunities found</h3>
              <p className="text-gray-500 mt-1">Try adjusting your search terms</p>
            </div>
          )}
        </div>

      </div>

      {selectedOpp && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-xl border border-gray-200">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">{selectedOpp.title}</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-2">
                  <Building2 className="w-4 h-4" /> <span>{selectedOpp.team}</span>
                  <span className="w-1 h-1 rounded-full bg-gray-300 mx-1" />
                  <MapPin className="w-4 h-4" /> <span>{selectedOpp.location}</span>
                </div>
              </div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 text-sm font-semibold border border-emerald-100">
                <Sparkles className="w-4 h-4" /> {selectedOpp.match}% AI Match
              </span>
            </div>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-wrap">{selectedOpp.description}</p>
              </div>

              <div>
                <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider mb-2">Required Skills Match</h3>
                
                <div className="flex flex-col gap-4">
                  {selectedOpp.matched_skills && selectedOpp.matched_skills.length > 0 && (
                    <div>
                      <h4 className="text-xs font-semibold text-emerald-600 mb-2 flex items-center gap-1"><Sparkles className="w-3.5 h-3.5" /> Your Matches</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedOpp.matched_skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1 text-sm font-medium bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-100">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedOpp.missing_skills && selectedOpp.missing_skills.length > 0 && (
                    <div className="p-4 bg-orange-50/50 rounded-xl border border-orange-100">
                      <h4 className="text-xs font-semibold text-orange-600 mb-2">Upskill Path for this Role</h4>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {selectedOpp.missing_skills.map((skill: string) => (
                          <span key={skill} className="px-3 py-1 text-sm font-medium bg-white text-gray-600 rounded-lg border border-gray-200">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-orange-700">Acquiring these skills will significantly improve your chances of being selected for this role.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-6 mt-8 border-t border-gray-100">
              <Button type="button" variant="outline" onClick={() => setSelectedOpp(null)} className="flex-1">Close</Button>
              <Button 
                className="flex-1 bg-[#635BFF] hover:bg-[#5046e5] text-white"
                onClick={() => {
                  handleApply(selectedOpp.id);
                  setSelectedOpp(null);
                }}
                disabled={applying === selectedOpp.id}
              >
                Apply Now
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
