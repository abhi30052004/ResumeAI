import React from 'react';

export function StartupTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-gray-800 font-sans">
      
      <div className="p-8">
        <div className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-3xl p-8 text-white shadow-xl">
          <h1 className="text-4xl font-bold mb-4">
            {personalInfo?.data?.fullName || 'John Doe'}
          </h1>
          <div className="flex gap-4 text-sm opacity-90 font-medium bg-white/20 p-3 rounded-xl inline-flex">
            <span>{personalInfo?.data?.email || 'john@example.com'}</span>
            <span>•</span>
            <span>{personalInfo?.data?.phone || '(555) 123-4567'}</span>
            <span>•</span>
            <span>{personalInfo?.data?.location || 'New York, NY'}</span>
          </div>
        </div>
      </div>
    
      
      <div className="px-8 pb-8">
        {otherSections.map((section) => (
          <div key={`StartupTemplate-${section.id}`} className="mb-6 bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-pink-500"></span>
              {section.type}
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-600">
              {section.content || <span className="text-gray-400 italic">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
