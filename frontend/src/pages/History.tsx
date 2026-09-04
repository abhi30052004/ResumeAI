import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Spinner } from '../components/ui/Spinner';
import { FileText, ChevronRight } from 'lucide-react';
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
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
          <p className="text-gray-600 mt-1">Review your past resume analyses and improvements.</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="flex justify-center p-12"><Spinner className="w-8 h-8" /></div>
          ) : history.length === 0 ? (
            <div className="text-center p-12">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-medium text-gray-900 mb-1">No analysis history</h4>
              <p className="text-gray-500 mb-4">Analyze a resume to see it here.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium">Date</th>
                    <th className="px-6 py-4 font-medium">ATS Score</th>
                    <th className="px-6 py-4 font-medium">Job Match</th>
                    <th className="px-6 py-4 font-medium">Missing Keywords</th>
                    <th className="px-6 py-4 font-medium text-right">View</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((item) => (
                    <tr 
                      key={item.id} 
                      className="hover:bg-gray-50 cursor-pointer transition-colors"
                      onClick={() => navigate(`/dashboard/analysis/${item.id}`)}
                    >
                      <td className="px-6 py-4 text-gray-600">
                        {new Date(item.created_at).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${item.ats_score >= 80 ? 'text-emerald-600' : item.ats_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {item.ats_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`font-bold ${item.job_match_score >= 80 ? 'text-emerald-600' : item.job_match_score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
                          {item.job_match_score}%
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1 flex-wrap max-w-[200px]">
                          {item.missing_keywords.slice(0, 3).map((kw: string, i: number) => (
                            <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded">
                              {kw}
                            </span>
                          ))}
                          {item.missing_keywords.length > 3 && (
                            <span className="px-2 py-0.5 bg-gray-100 text-gray-500 text-xs rounded">
                              +{item.missing_keywords.length - 3} more
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <ChevronRight className="w-5 h-5 text-gray-400 inline" />
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
