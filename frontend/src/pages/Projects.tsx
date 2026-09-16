import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { FolderKanban, Clock, Users, ArrowRight, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

export function Projects() {
  const { toast } = useToast();

  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await api.get('/api/projects/my');
        setProjects(response.data);
      } catch (error) {
        console.error('Failed to fetch projects', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">My Projects</h1>
            <p className="text-gray-500 mt-2 text-lg">Track your current assignments and past contributions.</p>
          </div>
          
          <Button 
            className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2"
            onClick={() => toast("Your request for a project change has been submitted to your manager.")}
          >
            <Plus className="w-4 h-4" /> Request Project Change
          </Button>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {loading ? (
            <div className="col-span-full text-center py-10 text-gray-500">Loading projects...</div>
          ) : projects.length === 0 ? (
            <div className="col-span-full text-center py-10 text-gray-500 bg-white rounded-3xl border border-dash-border">
              <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>You are not currently assigned to any projects.</p>
            </div>
          ) : projects.map(project => (
            <div key={project.id} className="bg-white rounded-3xl border border-dash-border p-6 shadow-sm hover:shadow-md transition-shadow flex flex-col h-full">
              
              <div className="flex justify-between items-start mb-4">
                <div className="p-3 bg-indigo-50 rounded-xl text-[#635BFF]">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                  project.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                  project.status === 'Planning' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                  'bg-gray-50 text-gray-600 border-gray-200'
                }`}>
                  {project.status}
                </span>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-1">{project.name}</h3>
              <p className="text-sm text-gray-500 font-medium mb-6">Role: {project.role}</p>

              {/* Progress */}
              <div className="mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-gray-500 font-medium">Progress</span>
                  <span className="font-semibold text-gray-900">{project.progress}%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2">
                  <div 
                    className="bg-[#635BFF] h-2 rounded-full transition-all" 
                    style={{ width: `${project.progress}%` }} 
                  />
                </div>
              </div>

              <div className="mt-auto pt-6 border-t border-dash-border flex justify-between items-center text-sm text-gray-500">
                <div className="flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {project.deadline || 'No deadline'}
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="w-4 h-4" /> {project.teamSize || 0} members
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
