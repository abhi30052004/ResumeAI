import React from 'react';

export function ExecutiveTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-slate-50 text-slate-900 font-serif">
      
      <div className="p-12 text-center">
        <h1 className="text-4xl font-medium tracking-wide text-slate-800">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <div className="w-16 h-0.5 bg-slate-800 mx-auto my-4"></div>
        <p className="text-sm text-slate-600 font-sans">
          {[
            personalInfo?.data?.email || 'john@example.com',
            personalInfo?.data?.phone || '(555) 123-4567',
            personalInfo?.data?.location || 'New York, NY'
          ].filter(Boolean).join(' | ')}
        </p>
      </div>
    
      
      <div className="px-12 pb-12">
        {otherSections.map((section) => (
          <div key={`ExecutiveTemplate-${section.id}`} className="mb-8">
            <h2 className="text-xl font-semibold text-center mb-4 uppercase tracking-widest text-slate-700">
              {section.type}
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans text-slate-700 text-justify">
              {section.content || <span className="text-slate-400 italic text-center block">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
