import React, { useState, useEffect } from 'react';
import { Search, Building, MoreHorizontal, Filter, Plus, Phone, Mail, Globe } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import api from '../lib/api';

export function AdminClients() {
  const [searchQuery, setSearchQuery] = useState('');
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newClient, setNewClient] = useState({ name: '', industry: '', contact: '', phone: '', website: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await api.get('/api/clients/');
      setClients(response.data);
    } catch (error) {
      console.error('Failed to fetch clients:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/api/clients/', newClient);
      setShowCreateModal(false);
      setNewClient({ name: '', industry: '', contact: '', phone: '', website: '' });
      fetchClients();
    } catch (error) {
      console.error('Failed to create client:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const filteredClients = clients.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.industry.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Client Directory</h1>
            <p className="text-gray-500 mt-2 text-lg">Manage platform clients and their active engagements.</p>
          </div>
          
          <Button 
            className="bg-[#635BFF] hover:bg-[#5046e5] text-white gap-2"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4" /> Add New Client
          </Button>
        </div>

        {/* Directory Grid/Table */}
        <div className="bg-white rounded-3xl border border-dash-border shadow-sm overflow-hidden">
          
          <div className="p-6 border-b border-dash-border flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-gray-900 font-bold text-lg">
              <Building size={20} className="text-[#635BFF]" /> Clients
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input 
                  type="text"
                  placeholder="Search clients..."
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 p-6 bg-gray-50/50">
            {loading ? (
              <div className="col-span-full text-center py-10 text-gray-500">Loading clients...</div>
            ) : filteredClients.map(client => (
              <div key={client.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition-all flex flex-col group">
                
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 flex items-center justify-center text-purple-600 font-bold text-lg border border-purple-200/50">
                      {client.name ? client.name.charAt(0) : '?'}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 text-lg group-hover:text-[#635BFF] transition-colors">{client.name}</h3>
                      <p className="text-sm text-gray-500 font-medium">{client.industry}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                    client.status === 'Active' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {client.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Active Projects</p>
                    <p className="text-xl font-bold text-gray-900">{client.projects || 0}</p>
                  </div>
                  <div className="p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <p className="text-xs text-gray-500 font-medium mb-1">Total Allocated</p>
                    <p className="text-xl font-bold text-gray-900">{(client.projects || 0) * 4} <span className="text-sm font-normal text-gray-500">emps</span></p>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100 flex flex-col gap-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4 text-gray-400" /> {client.contact || 'No email provided'}
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-600">
                    <span className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" /> {client.phone || 'No phone provided'}</span>
                    <span className="flex items-center gap-2 text-[#635BFF] hover:underline cursor-pointer"><Globe className="w-4 h-4" /> {client.website || 'No website'}</span>
                  </div>
                </div>

              </div>
            ))}
          </div>
          
          {!loading && filteredClients.length === 0 && (
            <div className="p-12 text-center border-t border-gray-100">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-50 mb-4">
                <Search className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No clients found matching "{searchQuery}"</p>
            </div>
          )}

        </div>

      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 w-full max-w-md shadow-xl border border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Add New Client</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <Input
                label="Company Name"
                required
                value={newClient.name}
                onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                placeholder="Acme Corp"
              />
              <Input
                label="Industry"
                required
                value={newClient.industry}
                onChange={(e) => setNewClient({ ...newClient, industry: e.target.value })}
                placeholder="FinTech"
              />
              <Input
                label="Contact Email"
                type="email"
                value={newClient.contact}
                onChange={(e) => setNewClient({ ...newClient, contact: e.target.value })}
                placeholder="contact@company.com"
              />
              <Input
                label="Phone"
                value={newClient.phone}
                onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                placeholder="+1 555-0101"
              />
              <Input
                label="Website"
                value={newClient.website}
                onChange={(e) => setNewClient({ ...newClient, website: e.target.value })}
                placeholder="company.com"
              />
              
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
                  {submitting ? 'Creating...' : 'Create Client'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
