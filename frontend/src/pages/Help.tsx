import React from 'react';
import { HelpCircle } from 'lucide-react';

export function Help() {
  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
          <p className="text-gray-600 mt-1">Get assistance with Resume AI.</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden flex flex-col items-center justify-center p-12">
          <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-gray-900 mb-1">Coming Soon</h4>
          <p className="text-gray-500 mb-4 text-center max-w-md">
            Our comprehensive help center and support ticketing system are under construction.
          </p>
        </div>
      </div>
    </div>
  );
}
