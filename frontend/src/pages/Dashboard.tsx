import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { FileText, Plus, Target, TrendingUp, Sparkles, Eye, Trash2 } from 'lucide-react';
import api from '../lib/api';

export function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [resumes, setResumes] = useState<any[]>([]);
  const [stats, setStats] = useState({
    resumes_analyzed: 0,
    average_ats_score: 0,
    best_match_score: 0,
    improvements_made: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resumesRes, statsRes] = await Promise.all([
          api.get('/api/resumes'),
          api.get('/api/dashboard/stats')
        ]);
        setResumes(resumesRes.data);
        setStats(statsRes.data);
      } catch (error) {
        console.error('Failed to fetch dashboard data', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
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

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Good morning, {user?.full_name?.split(' ')[0]}</h1>
            <p className="text-gray-600 mt-1">Optimize your resume for your next opportunity.</p>
          </div>
          <div className="mt-4 md:mt-0">
            <Link to="/dashboard/analysis">
              <Button size="lg" className="gap-2">
                <Plus className="w-5 h-5" />
                Analyze New Resume
              </Button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatCard icon={<FileText className="w-5 h-5 text-blue-500" />} title="Resumes Analyzed" value={stats.resumes_analyzed.toString()} />
          <StatCard icon={<Target className="w-5 h-5 text-emerald-500" />} title="Average ATS Score" value={`${stats.average_ats_score}%`} />
          <StatCard icon={<TrendingUp className="w-5 h-5 text-purple-500" />} title="Best Match Score" value={`${stats.best_match_score}%`} />
          <StatCard icon={<Sparkles className="w-5 h-5 text-yellow-500" />} title="Improvements Made" value={stats.improvements_made.toString()} />
        </div>

        {/* Recent Resumes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Recent Resumes</h3>
          </div>
          
          {loading ? (
            <div className="flex justify-center p-12"><Spinner className="w-8 h-8" /></div>
          ) : resumes.length === 0 ? (
            <div className="text-center p-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">No resumes yet</h4>
              <p className="text-gray-500 mb-4">Upload your first resume to get started.</p>
              <Link to="/dashboard/analysis">
                <Button>Analyze Resume</Button>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Resume Name</th>
                    <th className="px-6 py-4 font-medium">Target Role</th>
                    <th className="px-6 py-4 font-medium">Last Updated</th>
                    <th className="px-6 py-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {resumes.map((resume) => (
                    <tr key={resume.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 font-medium text-gray-900">
                        {resume.name}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {resume.target_role || 'Not specified'}
                      </td>
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(resume.updated_at).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="sm" onClick={() => navigate(`/dashboard/improve/${resume.id}`)}>
                            <Sparkles className="w-4 h-4 mr-1 text-primary" />
                            Improve
                          </Button>
                          <Button variant="ghost" size="sm" onClick={() => handleDelete(resume.id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }: { icon: React.ReactNode, title: string, value: string }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-gray-50 rounded-lg">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h4 className="text-2xl font-bold text-gray-900">{value}</h4>
        </div>
      </CardContent>
    </Card>
  );
}
