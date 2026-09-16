import React, { useState, useEffect } from 'react';
import { Search, FileText, Plus, Filter, Users, MapPin, MoreHorizontal, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../lib/api';

export function ManagerJDs() {
  const [searchQuery, setSearchQuery] = useState('');
  const [jds, setJds] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  
  const [newJd, setNewJd] = useState({
    title: '',
    project_id: '',
    client_id: '',
    description: '',
    responsibilities: '',
    required_skills: '',
    preferred_skills: '',
    experience: '',
    seniority: 'Mid-Level',
    employment_type: 'Full-time',
    required_hours: 40,
    duration: '',
    location: '',
    deadline: ''
  });

  useEffect(() => {
    fetchJDs();
  }, []);

  const fetchJDs = async () => {
    try {
      const response = await api.get('/api/manager/jds');
      setJds(response.data);
    } catch (error) {
      console.error('Failed to fetch JDs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/manager/jds', {
        ...newJd,
        responsibilities: newJd.responsibilities.split('\n').filter(Boolean),
        required_skills: newJd.required_skills.split(',').map(s => s.trim()).filter(Boolean),
        preferred_skills: newJd.preferred_skills.split(',').map(s => s.trim()).filter(Boolean),
      });
      setShowCreateModal(false);
      setNewJd({
        title: '', project_id: '', client_id: '', description: '',
        responsibilities: '', required_skills: '', preferred_skills: '',
        experience: '', seniority: 'Mid-Level', employment_type: 'Full-time',
        required_hours: 40, duration: '', location: '', deadline: ''
      });
      fetchJDs();
    } catch (error) {
      console.error('Failed to create JD:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;
    try {
      await api.delete(`/api/manager/jds/${id}`);
      fetchJDs();
    } catch (error) {
      console.error('Failed to delete JD:', error);
    }
  };

  const filteredJDs = jds.filter(jd => 
    jd.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    jd.team.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Project Requirements</h1>
            <p className="text-gray-500 mt-2 text-lg">Create requirements for open project roles and find matching talent.</p>
          </div>
          
          <Button 
            className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Create Requirement
          </Button>
        </div>

        {/* Directory Grid */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <FileText size={20} className="text-[#635BFF]" /> Active Postings
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search job posts..."
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
              <div className="col-span-full text-center py-10 text-gray-500">Loading job postings...</div>
            ) : filteredJDs.map(jd => (
              <div key={jd.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col group">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center text-[#635BFF]">
                      <FileText className="w-6 h-6" />
                    </div>
                  </div>
                  <button 
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    onClick={() => handleDelete(jd.id)}
                    title="Delete Job Posting"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>

                <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#635BFF] transition-colors mb-1">{jd.title}</h3>
                
                <div className="flex flex-col gap-1 text-sm text-gray-500 mb-6">
                  {jd.project_id && <span>Project: <span className="font-medium text-gray-700">{jd.project_id}</span></span>}
                  <span className="flex items-center gap-1"><MapPin className="w-3.5 h-3.5" /> {jd.location}</span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4 mt-auto">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                      <Users className="w-3.5 h-3.5" /> Applicants
                    </div>
                    <span className="text-lg font-bold text-gray-900">{jd.applicants || 0}</span>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                       Status
                    </div>
                    <span className={`text-sm font-bold ${jd.status === 'Active' || jd.status === 'Open' ? 'text-emerald-600' : 'text-gray-600'}`}>
                      {jd.status}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2 mb-4 mt-auto">
                  <Link to={`/manager/jds/${jd.id}/matches`} className="w-full">
                    <Button className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 gap-2 border-0 h-9">
                      <Sparkles className="w-4 h-4" /> Find Candidates
                    </Button>
                  </Link>
                </div>

                <div className="text-xs text-gray-400 font-medium">
                  Posted {jd.posted_at ? new Date(jd.posted_at).toLocaleDateString() : (jd.posted || 'recently')}
                </div>
              </div>
            ))}
          </div>

          {!loading && filteredJDs.length === 0 && (
            <div className="p-12 text-center border-t border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No job postings found matching "{searchQuery}"</p>
            </div>
          )}

        </div>

      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-2xl shadow-xl border border-gray-200 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Project Requirement</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Role Title" required value={newJd.title} onChange={(e) => setNewJd({ ...newJd, title: e.target.value })} placeholder="Senior React Developer" />
                <Input label="Project (Optional)" value={newJd.project_id} onChange={(e) => setNewJd({ ...newJd, project_id: e.target.value })} placeholder="Project ID/Name" />
                <Input label="Location" required value={newJd.location} onChange={(e) => setNewJd({ ...newJd, location: e.target.value })} placeholder="Remote, On-site, etc." />
                <Input label="Employment Type" required value={newJd.employment_type} onChange={(e) => setNewJd({ ...newJd, employment_type: e.target.value })} placeholder="Full-time, Contract" />
                <Input label="Seniority Level" required value={newJd.seniority} onChange={(e) => setNewJd({ ...newJd, seniority: e.target.value })} placeholder="Mid-Level, Senior" />
                <Input label="Years of Experience" required value={newJd.experience} onChange={(e) => setNewJd({ ...newJd, experience: e.target.value })} placeholder="5+ years" />
                <Input label="Duration (Optional)" value={newJd.duration} onChange={(e) => setNewJd({ ...newJd, duration: e.target.value })} placeholder="6 months" />
                <Input label="Required Hours/Week" type="number" required value={newJd.required_hours.toString()} onChange={(e) => setNewJd({ ...newJd, required_hours: parseInt(e.target.value) || 40 })} />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  required
                  rows={3}
                  value={newJd.description}
                  onChange={(e) => setNewJd({ ...newJd, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all"
                  placeholder="Describe the role..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Responsibilities (One per line)</label>
                <textarea
                  rows={3}
                  value={newJd.responsibilities}
                  onChange={(e) => setNewJd({ ...newJd, responsibilities: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all"
                  placeholder="Lead development...&#10;Mentorship..."
                />
              </div>

              <Input label="Required Skills (comma separated)" required value={newJd.required_skills} onChange={(e) => setNewJd({ ...newJd, required_skills: e.target.value })} placeholder="React, TypeScript, Node.js" />
              <Input label="Preferred Skills (comma separated)" value={newJd.preferred_skills} onChange={(e) => setNewJd({ ...newJd, preferred_skills: e.target.value })} placeholder="GraphQL, AWS" />
                            
              <div className="flex gap-3 pt-4 mt-6 border-t border-gray-100">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)} className="flex-1">Cancel</Button>
                <Button type="submit" className="flex-1 bg-[#635BFF] hover:bg-[#5046e5] text-white" disabled={submitting}>
                  {submitting ? 'Creating...' : 'Create Requirement'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
