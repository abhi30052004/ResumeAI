import React from 'react';

export function CompactTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-gray-800 font-sans text-sm">
      
      <div className="p-6 border-b border-gray-300 mb-4 flex justify-between items-end">
        <h1 className="text-3xl font-bold text-gray-900 leading-none">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <div className="text-xs text-right text-gray-600">
          <div>{personalInfo?.data?.email || 'john@example.com'}</div>
          <div>{personalInfo?.data?.phone || '(555) 123-4567'}</div>
          <div>{personalInfo?.data?.location || 'New York, NY'}</div>
        </div>
      </div>
    
      
      <div className="px-6 flex gap-6">
        <div className="w-2/3">
          {otherSections.filter(s => ['Experience', 'Projects', 'Professional Summary'].includes(s.type)).map((section) => (
            <div key={`CompactTemplate-${section.id}`} className="mb-4">
              <h2 className="text-md font-bold uppercase tracking-tight text-gray-900 mb-1 border-b border-gray-200">
                {section.type}
              </h2>
              <div className="whitespace-pre-wrap leading-snug">
                {section.content || <span className="text-gray-400 italic">Content for {section.type} will appear here...</span>}
              </div>
            </div>
          ))}
        </div>
        <div className="w-1/3">
          {otherSections.filter(s => !['Experience', 'Projects', 'Professional Summary'].includes(s.type)).map((section) => (
            <div key={`CompactTemplate-${section.id}`} className="mb-4">
              <h2 className="text-md font-bold uppercase tracking-tight text-gray-900 mb-1 border-b border-gray-200">
                {section.type}
              </h2>
              <div className="whitespace-pre-wrap leading-snug">
                {section.content || <span className="text-gray-400 italic">Content for {section.type} will appear here...</span>}
              </div>
            </div>
          ))}
        </div>
      </div>
    
    </div>
  );
}
