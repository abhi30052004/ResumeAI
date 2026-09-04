import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Spinner } from '../components/ui/Spinner';
import { CheckCircle2, AlertTriangle, ChevronRight, Edit3 } from 'lucide-react';
import api from '../lib/api';

export function AnalysisResults() {
  const { id } = useParams<{ id: string }>();
  const [analysis, setAnalysis] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const response = await api.get(`/api/analysis/${id}`);
        setAnalysis(response.data);
      } catch (err) {
        console.error(err);
        setError('Failed to load analysis results.');
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchAnalysis();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <Spinner className="w-12 h-12" />
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center p-8 bg-white rounded-xl shadow-sm border border-gray-200">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-2">Error</h2>
          <p className="text-gray-600">{error}</p>
          <Link to="/analyze">
            <Button className="mt-6">Try Again</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Analysis</h1>
            <p className="text-gray-600 mt-1">Here is how your resume stacks up against the job description.</p>
          </div>
          <Link to={`/dashboard/improve/${analysis.resume_id}`}>
            <Button size="lg" className="w-full md:w-auto bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700">
              <Edit3 className="w-5 h-5 mr-2" />
              Start Improving
            </Button>
          </Link>
        </div>

        {/* Scores */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <ScoreCard title="ATS Score" score={analysis.ats_score} primary />
          <ScoreCard title="Job Match" score={analysis.job_match_score} />
          <ScoreCard title="Keyword Match" score={analysis.keyword_score} />
          <ScoreCard title="Resume Quality" score={Math.round((analysis.ats_score + analysis.job_match_score) / 2)} />
        </div>

        {/* AI Summary */}
        <Card className="bg-white border-blue-100 shadow-sm overflow-hidden">
          <div className="bg-blue-50/50 p-6 border-b border-blue-100">
            <h3 className="font-semibold text-blue-900 flex items-center">
              <SparklesIcon className="w-5 h-5 mr-2 text-blue-600" />
              AI Summary
            </h3>
          </div>
          <CardContent className="p-6 text-gray-700 leading-relaxed">
            {analysis.ai_summary}
          </CardContent>
        </Card>

        {/* Strengths & Weaknesses */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-emerald-700">
                <CheckCircle2 className="w-5 h-5 mr-2" />
                Strengths
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.strengths.map((strength: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-emerald-500 mr-2 mt-0.5">✓</span>
                    <span className="text-gray-700">{strength}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center text-red-700">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Areas for Improvement
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {analysis.weaknesses.map((weakness: string, i: number) => (
                  <li key={i} className="flex items-start">
                    <span className="text-red-500 mr-2 mt-0.5">⚠</span>
                    <span className="text-gray-700">{weakness}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Keywords */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Missing Keywords</CardTitle>
            <p className="text-sm text-gray-500">Add these keywords to pass ATS filters</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analysis.missing_keywords.map((kw: string, i: number) => (
                <span key={i} className="px-3 py-1 bg-red-50 border border-red-100 text-red-700 rounded-full text-sm font-medium">
                  {kw}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Section Breakdown */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Section Analysis</h2>
          <div className="space-y-4">
            {Object.entries(analysis.section_analysis).map(([section, data]: [string, any]) => {
              if (!data) return null;
              return (
                <SectionExpandable 
                  key={section} 
                  title={section.charAt(0).toUpperCase() + section.slice(1)} 
                  data={data} 
                />
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}

function ScoreCard({ title, score, primary = false }: { title: string, score: number, primary?: boolean }) {
  const getColor = (s: number) => {
    if (s >= 80) return 'text-emerald-500';
    if (s >= 60) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <Card className={`flex flex-col items-center justify-center p-6 text-center ${primary ? 'border-primary shadow-md' : 'shadow-sm'}`}>
      <h3 className="text-sm font-medium text-gray-500 mb-2">{title}</h3>
      <div className="relative inline-flex items-center justify-center">
        <svg className="w-20 h-20 transform -rotate-90">
          <circle cx="40" cy="40" r="36" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
          <circle 
            cx="40" cy="40" r="36" 
            stroke="currentColor" 
            strokeWidth="8" 
            fill="transparent" 
            strokeDasharray={226.2} 
            strokeDashoffset={226.2 - (226.2 * score) / 100} 
            className={`${getColor(score)} transition-all duration-1000 ease-out`} 
          />
        </svg>
        <div className="absolute flex items-center justify-center flex-col">
          <span className={`text-2xl font-bold ${getColor(score)}`}>{score}</span>
        </div>
      </div>
    </Card>
  );
}

function SparklesIcon(props: any) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/>
      <path d="M5 3v4"/><path d="M19 17v4"/><path d="M3 5h4"/><path d="M17 19h4"/>
    </svg>
  );
}

function SectionExpandable({ title, data }: { title: string, data: any }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border border-gray-200 bg-white rounded-lg overflow-hidden">
      <button 
        className="w-full px-6 py-4 flex items-center justify-between bg-white hover:bg-gray-50 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-4">
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-gray-500">Score:</span>
          <span className={`font-bold ${data.score >= 80 ? 'text-emerald-600' : data.score >= 60 ? 'text-yellow-600' : 'text-red-600'}`}>
            {data.score}%
          </span>
        </div>
      </button>
      
      {isOpen && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Feedback</h4>
            <p className="text-gray-700 bg-white p-3 rounded border border-gray-200">{data.feedback}</p>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Suggestion</h4>
            <p className="text-gray-700 bg-blue-50/50 p-3 rounded border border-blue-100">{data.suggestion}</p>
          </div>
        </div>
      )}
    </div>
  );
}
