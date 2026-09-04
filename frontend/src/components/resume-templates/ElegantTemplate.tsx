import React from 'react';

export function ElegantTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-stone-50 text-stone-800">
      
      <div className="p-12 pb-8">
        <h1 className="text-5xl font-serif text-stone-700 mb-2">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <p className="text-sm font-sans tracking-wide text-stone-500">
          {[
            personalInfo?.data?.email || 'john@example.com',
            personalInfo?.data?.phone || '(555) 123-4567',
            personalInfo?.data?.location || 'New York, NY'
          ].filter(Boolean).join(' • ')}
        </p>
      </div>
    
      
      <div className="px-12">
        {otherSections.map((section) => (
          <div key={`ElegantTemplate-${section.id}`} className="mb-8">
            <h2 className="text-2xl font-serif text-stone-600 mb-3 italic">
              {section.type}
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed font-sans text-stone-700">
              {section.content || <span className="text-stone-400 italic">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
