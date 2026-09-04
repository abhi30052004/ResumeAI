import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { FileText, Plus, MoreVertical, Sparkles, Trash2, Edit2 } from 'lucide-react';
import api from '../lib/api';

export function Resumes() {
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchResumes = async () => {
      try {
        const response = await api.get('/api/resumes');
        setResumes(response.data);
      } catch (error) {
        console.error('Failed to fetch resumes', error);
      } finally {
        setLoading(false);
      }
    };
    fetchResumes();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resume?')) {
      try {
        await api.delete(`/api/resumes/${id}`);
        setResumes(resumes.filter(r => r.id !== id));
      } catch (error) {
        console.error('Failed to delete resume', error);
      }
    }
  };

  const filteredResumes = resumes.filter(r => 
    r.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    (r.target_role && r.target_role.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Resumes</h1>
            <p className="text-gray-600 mt-1">Manage and edit your saved resumes.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard/analysis">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                New Resume
              </Button>
            </Link>
          </div>
        </div>

        <div className="mb-6">
          <input 
            type="text" 
            placeholder="Search resumes..." 
            className="w-full md:w-96 rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="flex justify-center p-12"><Spinner className="w-8 h-8" /></div>
        ) : filteredResumes.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-1">No resumes found</h4>
            <p className="text-gray-500 mb-4">Upload a resume or clear your search.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResumes.map((resume) => (
              <div key={resume.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow group">
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                      <FileText className="w-6 h-6" />
                    </div>
                    <button onClick={() => handleDelete(resume.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 truncate mb-1" title={resume.name}>{resume.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">{resume.target_role || 'General Resume'}</p>
                  
                  <div className="flex items-center text-xs text-gray-500 mb-6">
                    Updated {new Date(resume.updated_at).toLocaleDateString()}
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1 text-sm" onClick={() => navigate(`/dashboard/improve/${resume.id}`)}>
                      <Sparkles className="w-4 h-4 mr-1 text-primary" /> Improve
                    </Button>
                    <Link to="/dashboard/resume-builder" className="flex-1">
                      <Button variant="secondary" className="w-full text-sm">
                        <Edit2 className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
