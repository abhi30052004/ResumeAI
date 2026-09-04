import React from 'react';

export function BoldTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-black font-sans">
      
      <div className="p-10 bg-black text-white">
        <h1 className="text-6xl font-black uppercase tracking-tighter">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <div className="mt-6 font-bold flex gap-4 text-sm">
          <span className="bg-white text-black px-2 py-1">{personalInfo?.data?.email || 'john@example.com'}</span>
          <span className="border border-white px-2 py-1">{personalInfo?.data?.phone || '(555) 123-4567'}</span>
          <span className="border border-white px-2 py-1">{personalInfo?.data?.location || 'New York, NY'}</span>
        </div>
      </div>
    
      
      <div className="p-10">
        {otherSections.map((section) => (
          <div key={`BoldTemplate-${section.id}`} className="mb-10">
            <h2 className="text-3xl font-extrabold uppercase tracking-tight mb-4 text-black">
              {section.type}
            </h2>
            <div className="text-base whitespace-pre-wrap leading-normal font-medium text-gray-800">
              {section.content || <span className="text-gray-400 italic">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
