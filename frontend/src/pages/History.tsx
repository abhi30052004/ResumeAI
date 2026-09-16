import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { FileText, ChevronRight, TrendingUp, Target, Activity } from 'lucide-react';
import api from '../lib/api';

export function History() {
  const navigate = useNavigate();
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/api/analysis/history');
        setHistory(response.data);
      } catch (error) {
        console.error('Failed to fetch history', error);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Analysis History</h1>
          <p className="text-gray-500 mt-2 text-lg">Review your past resume analyses and track improvements over time.</p>
        </div>

        {/* History Table */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          <div className="p-6 border-b border-dash-border flex items-center gap-2">
            <Activity className="w-5 h-5 text-[#635BFF]" />
            <h3 className="font-bold text-gray-900 text-lg">Past Analyses</h3>
          </div>

          {loading ? (
            <div className="flex justify-center p-16">
              <Spinner className="w-8 h-8 text-[#635BFF]" />
            </div>
          ) : history.length === 0 ? (
            <div className="text-center p-16">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-2">No analysis history</h4>
              <p className="text-gray-500">Analyze a resume to see your history and track progress here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50/50 border-b border-dash-border text-gray-500 font-semibold">
                  <tr>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">ATS Score</th>
                    <th className="px-6 py-4">Job Match</th>
                    <th className="px-6 py-4">Missing Keywords</th>
                    <th className="px-6 py-4 text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {history.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/80 transition-colors cursor-pointer group"
                      onClick={() => navigate(`/dashboard/analysis/${item.id}`)}
                    >
                      <td className="px-6 py-4 text-gray-600 font-medium">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <span className={`font-bold ${item.ats_score >= 80 ? 'text-emerald-600' : item.ats_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {item.ats_score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-gray-400" />
                          <span className={`font-bold ${item.job_match_score >= 80 ? 'text-emerald-600' : item.job_match_score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
                            {item.job_match_score}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap max-w-[220px]">
                          {item.missing_keywords.slice(0, 3).map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-lg border border-gray-200">
                              {kw}
                            </span>
                          ))}
                          {item.missing_keywords.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded-lg border border-gray-200">
                              +{item.missing_keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-5 h-5 text-gray-400 group-hover:text-[#635BFF] transition-colors inline" />
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
