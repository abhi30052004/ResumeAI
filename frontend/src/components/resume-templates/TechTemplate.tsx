import React from 'react';

export function TechTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-gray-800 font-mono">
      
      <div className="p-8 bg-slate-900 text-slate-50">
        <h1 className="text-3xl font-bold">
          &gt; {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <div className="mt-4 flex flex-col gap-1 text-sm text-slate-400">
          <span>email: {personalInfo?.data?.email || 'john@example.com'}</span>
          <span>phone: {personalInfo?.data?.phone || '(555) 123-4567'}</span>
          <span>location: {personalInfo?.data?.location || 'New York, NY'}</span>
        </div>
      </div>
    
      
      <div className="p-8">
        {otherSections.map((section) => (
          <div key={`TechTemplate-${section.id}`} className="mb-8">
            <h2 className="text-lg font-bold text-slate-800 mb-3 border-b-2 border-slate-200 inline-block pr-8">
              # {section.type}
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {section.content || <span className="text-gray-400 italic">/* Content for {section.type} will appear here... */</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
