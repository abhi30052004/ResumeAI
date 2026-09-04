import React from 'react';

export function MinimalistTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-gray-600 font-light">
      
      <div className="px-12 py-10 pb-6">
        <h1 className="text-4xl font-light text-gray-900 mb-2">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <p className="text-xs tracking-widest uppercase">
          {[
            personalInfo?.data?.email || 'john@example.com',
            personalInfo?.data?.phone || '(555) 123-4567',
            personalInfo?.data?.location || 'New York, NY'
          ].filter(Boolean).join(' • ')}
        </p>
      </div>
    
      
      <div className="px-12">
        {otherSections.map((section) => (
          <div key={`MinimalistTemplate-${section.id}`} className="mb-10 flex gap-8">
            <h2 className="text-sm font-medium uppercase tracking-widest w-1/4 text-gray-400 text-right shrink-0">
              {section.type}
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-800 w-3/4">
              {section.content || <span className="text-gray-300 italic">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
