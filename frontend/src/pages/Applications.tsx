import React, { useState, useEffect } from 'react';
import { useToast } from '../context/ToastContext';
import { Search, Plus, Filter, Building2, MapPin, Calendar, ArrowRight, MoreHorizontal, CheckCircle2, Clock, XCircle, Loader2, ExternalLink } from 'lucide-react';
import { Button } from '../components/ui/Button';
import api from '../lib/api';
// Mock data removed in favor of real DB data

const statusStyles = {
  'Applied': 'bg-blue-50 text-blue-700 border-blue-200',
  'Under Review': 'bg-purple-50 text-purple-700 border-purple-200',
  'Interview': 'bg-amber-50 text-amber-700 border-amber-200',
  'Offer': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Rejected': 'bg-red-50 text-red-700 border-red-200'
};

const statusIcons = {
  'Applied': <Clock className="w-3.5 h-3.5" />,
  'Under Review': <Clock className="w-3.5 h-3.5" />,
  'Interview': <Calendar className="w-3.5 h-3.5" />,
  'Offer': <CheckCircle2 className="w-3.5 h-3.5" />,
  'Rejected': <XCircle className="w-3.5 h-3.5" />
};

export function Applications() {
  const { toast } = useToast();

  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await api.get('/api/applications');
      setApplications(res.data);
    } catch (error) {
      console.error('Failed to fetch applications', error);
      // Remove mock data fallback so user sees real DB state (or error)
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusChange = async (appId: string, newStatus: string) => {
    // Optimistic update
    setApplications(prev => prev.map(app => app.id === appId ? { ...app, status: newStatus } : app));
    try {
      await api.patch(`/api/applications/${appId}`, { status: newStatus });
    } catch (error) {
      console.error('Failed to update status', error);
      toast('Failed to update status.');
      // Revert if needed, simple refresh for now
      fetchApplications();
    }
  };

  const filteredApps = applications.filter(app => 
    (app.company?.toLowerCase() || '').includes(searchTerm.toLowerCase()) || 
    (app.title?.toLowerCase() || app.role?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex-1 bg-gray-50/50 py-8 px-4 sm:px-6 lg:px-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Applications</h1>
            <p className="text-gray-500 mt-2">Track and manage your job applications in one place.</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search companies..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 w-full md:w-64"
              />
            </div>
            <Button variant="outline" className="gap-2 border-gray-200">
              <Filter className="w-4 h-4" /> Filters
            </Button>
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white gap-2">
              <Plus className="w-4 h-4" /> Add Manual
            </Button>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          {/* Table Header */}
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-gray-200 bg-gray-50/50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            <div className="col-span-4 pl-2">Job & Company</div>
            <div className="col-span-3">Status</div>
            <div className="col-span-3">Date Applied</div>
            <div className="col-span-2 text-right pr-2">Action</div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-gray-100">
            {isLoading ? (
              <div className="p-8 flex justify-center items-center">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : filteredApps.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                No applications tracked yet. Go to Job Matches to find jobs!
              </div>
            ) : filteredApps.map((app) => (
              <div 
                key={app.id} 
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-gray-50/80 transition-colors group"
              >
                {/* Job & Company */}
                <div className="col-span-4 flex items-center gap-4 pl-2">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 border border-gray-200 flex items-center justify-center font-bold text-gray-600 shadow-sm flex-shrink-0">
                    {app.logo || (app.company ? app.company[0].toUpperCase() : 'J')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{app.title || app.role}</h4>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span className="font-medium text-gray-700">{app.company}</span>
                      <span className="w-1 h-1 rounded-full bg-gray-300" />
                      <span className="truncate">{app.location}</span>
                    </div>
                  </div>
                </div>

                {/* Status Badge Dropdown */}
                <div className="col-span-3">
                  <select 
                    value={app.status}
                    onChange={(e) => handleStatusChange(app.id, e.target.value)}
                    className={`inline-flex items-center gap-1.5 pl-3 pr-8 py-1 rounded-full text-xs font-semibold border focus:outline-none focus:ring-2 focus:ring-indigo-500/20 appearance-none cursor-pointer bg-no-repeat bg-[url('data:image/svg+xml;utf8,<svg fill=\"currentColor\" height=\"24\" viewBox=\"0 0 24 24\" width=\"24\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M7 10l5 5 5-5z\"/></svg>')] bg-[length:16px_16px] bg-[right_8px_center] ${statusStyles[app.status as keyof typeof statusStyles] || statusStyles['Applied']}`}
                  >
                    <option value="Applied">Applied</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Interview">Interview</option>
                    <option value="Offer">Offer</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>

                {/* Date Applied */}
                <div className="col-span-3 text-sm text-gray-600 font-medium flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                  {app.dateApplied || app.created_at?.substring(0, 10) || 'Recently'}
                </div>

                {/* Actions */}
                <div className="col-span-2 flex justify-end items-center pr-2">
                  {app.url && (
                    <Button variant="outline" size="sm" onClick={() => window.open(app.url, '_blank')} className="hidden group-hover:flex border-gray-200 h-8 gap-1 mr-2 text-gray-600 hover:text-indigo-600 hover:border-indigo-200">
                      View <ExternalLink className="w-3.5 h-3.5" />
                    </Button>
                  )}
                  <button className="p-2 text-gray-400 hover:text-gray-700 rounded-lg hover:bg-gray-100 transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
