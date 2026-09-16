import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Search, MapPin, DollarSign, Briefcase, Filter, ExternalLink, Sparkles, Clock, Loader2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';

// No mock data - live scrape only

export function Matches() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('Worldwide');
  const [jobs, setJobs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [page, setPage] = useState(1);
  const [trackingJobs, setTrackingJobs] = useState<Record<string, boolean>>({});

  const trackJob = async (job: any) => {
    setTrackingJobs(prev => ({ ...prev, [job.id]: true }));
    try {
      await api.post('/api/applications', {
        title: job.title,
        company: job.company,
        location: job.location,
        salary: job.salary,
        url: job.url,
        logo: job.logo,
        status: 'Applied'
      });
      // Optionally you could show a success toast here
    } catch (error) {
      console.error('Failed to track job', error);
      toast('Failed to track job. Please try again.');
      setTrackingJobs(prev => ({ ...prev, [job.id]: false }));
    }
  };

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    setIsLoading(true);
    setPage(1);
    setJobs([]);
    try {
      const response = await api.post('/api/jobs/search', {
        search_term: searchTerm,
        location: location,
        max_items: 10
      });
      setJobs(response.data);
    } catch (error) {
      console.error('Failed to search jobs', error);
      toast('Failed to search jobs. Please try again later.');
      setJobs([]); // Clear on error
    } finally {
      setIsLoading(false);
    }
  };

  const loadMore = async () => {
    if (!searchTerm.trim()) {
      toast("Please enter a search term first.");
      return;
    }
    setIsLoadingMore(true);
    try {
      const response = await api.post('/api/jobs/search', {
        search_term: searchTerm,
        location: location,
        max_items: (page + 1) * 10
      });
      setJobs(response.data);
      setPage(p => p + 1);
    } catch (error) {
      console.error('Failed to load more jobs', error);
      toast('Failed to load more jobs. Please try again later.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex-1 bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">AI Job Matches</h1>
            <p className="text-gray-500 mt-2">Jobs automatically scored against your primary resume.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:flex-none">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search matches (e.g. React Developer)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64"
              />
            </div>
            <Button 
              onClick={handleSearch}
              disabled={isLoading || !searchTerm.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2 min-w-[100px]"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
            </Button>
            <Button variant="outline" className="gap-2 border-gray-200">
              <Filter className="w-4 h-4" /> Filters
            </Button>
          </div>
        </div>

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm animate-pulse h-[280px]">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 rounded-xl bg-gray-200" />
                  <div className="w-24 h-8 rounded-full bg-gray-200" />
                </div>
                <div className="w-3/4 h-6 bg-gray-200 rounded mb-4" />
                <div className="w-1/2 h-4 bg-gray-200 rounded mb-6" />
                <div className="flex gap-4 mb-6">
                  <div className="w-20 h-4 bg-gray-200 rounded" />
                  <div className="w-20 h-4 bg-gray-200 rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Job Matches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {!isLoading && jobs.length === 0 && (
            <div className="col-span-1 md:col-span-2 py-12 text-center text-gray-500 bg-white border border-gray-200 border-dashed rounded-2xl">
              <Sparkles className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-lg font-medium text-gray-900">Ready to find your next role?</p>
              <p className="mt-1">Enter a job title in the search bar above and our AI will scrape live listings for you.</p>
            </div>
          )}
          {!isLoading && jobs.map((job) => (
            <div 
              key={job.id} 
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden"
            >
              {/* Top Row: Logo & Match Score */}
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 border border-gray-100 flex items-center justify-center text-xl font-bold text-gray-700 shadow-inner">
                  {job.logo}
                </div>
                
                {/* Match Score Badge */}
                <div className="flex flex-col items-end">
                  <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold border ${
                    job.matchScore >= 90 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                    job.matchScore >= 80 ? 'bg-blue-50 text-blue-700 border-blue-200' :
                    'bg-amber-50 text-amber-700 border-amber-200'
                  }`}>
                    <Sparkles className="w-4 h-4" />
                    {job.matchScore}% Match
                  </div>
                </div>
              </div>

              {/* Job Info */}
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-1 group-hover:text-indigo-600 transition-colors">
                  {job.title}
                </h3>
                <div className="text-gray-600 font-medium mb-4">{job.company}</div>
                
                {/* Details */}
                <div className="flex flex-wrap gap-y-2 gap-x-4 mb-6">
                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-1.5 text-gray-400" />
                    {job.location}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <DollarSign className="w-4 h-4 mr-1.5 text-gray-400" />
                    {job.salary}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Briefcase className="w-4 h-4 mr-1.5 text-gray-400" />
                    {job.type}
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1.5 text-gray-400" />
                    {job.postedAt}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-4 pt-4 border-t border-gray-100">
                <Button 
                  className={`flex-1 text-white rounded-lg py-2 ${trackingJobs[job.id] ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                  onClick={() => trackJob(job)}
                  disabled={trackingJobs[job.id]}
                >
                  {trackingJobs[job.id] ? 'Tracked!' : 'Track Job'}
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1 border-gray-200 text-gray-700 rounded-lg py-2 gap-2"
                  onClick={() => window.open(job.url, '_blank')}
                >
                  View Job <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Pagination/Load More */}
        {jobs.length > 0 && (
          <div className="mt-8 flex justify-center">
            <Button 
              variant="outline" 
              className="border-gray-200 text-gray-600 px-8 gap-2"
              onClick={loadMore}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Load More Matches'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
