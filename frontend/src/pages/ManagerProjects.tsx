import React, { useState, useEffect } from 'react';
import { Search, FolderKanban, Plus, Filter, Users, Calendar, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../lib/api';

export function ManagerProjects() {
  const [searchQuery, setSearchQuery] = useState('');
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    description: '',
    deadline: ''
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const response = await api.get('/api/projects/managed');
      setProjects(response.data);
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/projects/', newProject);
      setShowCreateModal(false);
      setNewProject({ name: '', client: '', description: '', deadline: '' });
      fetchProjects();
    } catch (error) {
      console.error('Failed to create project:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    p.client.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Projects</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage projects you are responsible for.</p>
          </div>
          
          <Button 
            className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Create Project
          </Button>
        </div>

        {/* Filters and List */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <FolderKanban size={20} className="text-[#635BFF]" /> Tracker
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-72">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search projects or clients..."
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
                  <th className="px-6 py-4">Project Details</th>
                  <th className="px-6 py-4">Status & Progress</th>
                  <th className="px-6 py-4">Team</th>
                  <th className="px-6 py-4">Deadline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-12 text-center text-gray-500">Loading projects...</td>
                  </tr>
                ) : filteredProjects.map(project => (
                  <tr key={project.id} className="hover:bg-gray-50/80 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900 group-hover:text-[#635BFF] transition-colors">{project.name}</div>
                      <div className="text-gray-500 mt-1 flex flex-col gap-1 text-xs">
                        <span>Client: <span className="font-medium text-gray-700">{project.client || 'None'}</span></span>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 min-w-[200px]">
                      <div className="flex justify-between items-center mb-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                          project.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                          project.status === 'At Risk' ? 'bg-red-50 text-red-700 border-red-100 gap-1' :
                          project.status === 'Completed' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                          'bg-amber-50 text-amber-700 border-amber-100'
                        }`}>
                          {project.status === 'At Risk' && <AlertCircle className="w-3 h-3" />}
                          {project.status}
                        </span>
                        <span className="text-xs font-bold text-gray-700">{project.progress || 0}%</span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-1.5 rounded-full ${project.status === 'At Risk' ? 'bg-red-500' : project.status === 'Completed' ? 'bg-blue-500' : 'bg-[#635BFF]'}`} 
                          style={{ width: `${project.progress || 0}%` }} 
                        />
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Users className="w-4 h-4 text-gray-400" />
                        {project.teamSize || 0} Allocated
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {project.deadline || 'No deadline'}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {!loading && filteredProjects.length === 0 && (
            <div className="p-12 text-center border-t border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No projects found matching "{searchQuery}"</p>
            </div>
          )}
          
        </div>

      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Create New Project</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Project Name"
                required
                value={newProject.name}
                onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                placeholder="e.g. Mobile App Redesign"
              />
              <Input
                label="Client (Optional)"
                value={newProject.client}
                onChange={(e) => setNewProject({ ...newProject, client: e.target.value })}
                placeholder="e.g. Acme Corp"
              />
              <Input
                label="Deadline"
                type="date"
                value={newProject.deadline}
                onChange={(e) => setNewProject({ ...newProject, deadline: e.target.value })}
              />
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                <textarea
                  rows={3}
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#635BFF]/20 focus:border-[#635BFF] transition-all"
                  placeholder="Project details..."
                />
              </div>
              
              <div className="flex gap-3 pt-4 mt-6 border-t border-gray-100">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setShowCreateModal(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  className="flex-1 bg-[#635BFF] hover:bg-[#5046e5] text-white"
                  disabled={submitting}
                >
                  {submitting ? 'Creating...' : 'Create Project'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
