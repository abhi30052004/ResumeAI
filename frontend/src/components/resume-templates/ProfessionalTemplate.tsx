import React from 'react';

export function ProfessionalTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-black font-serif">
      
      <div className="p-10 pb-4 text-center border-b-2 border-black">
        <h1 className="text-3xl font-bold uppercase">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <p className="text-sm mt-2 flex justify-center gap-3">
          <span>{personalInfo?.data?.email || 'john@example.com'}</span>
          <span>|</span>
          <span>{personalInfo?.data?.phone || '(555) 123-4567'}</span>
          <span>|</span>
          <span>{personalInfo?.data?.location || 'New York, NY'}</span>
        </p>
      </div>
    
      
      <div className="p-10 pt-4">
        {otherSections.map((section) => (
          <div key={`ProfessionalTemplate-${section.id}`} className="mb-6">
            <h2 className="text-lg font-bold uppercase tracking-widest mb-2 border-b border-gray-400 pb-1">
              {section.type}
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed">
              {section.content || <span className="text-gray-400 italic">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
