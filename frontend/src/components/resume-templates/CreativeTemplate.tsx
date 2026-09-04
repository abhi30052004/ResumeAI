import React from 'react';

export function CreativeTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-gray-800 font-sans flex">
      
      <div className="w-1/3 bg-emerald-800 text-emerald-50 p-8 flex flex-col gap-6">
        <div>
          <div className="w-24 h-24 bg-emerald-700 rounded-full mb-4 flex items-center justify-center text-3xl font-bold">
            {(personalInfo?.data?.fullName || 'J D').split(' ').map((n: string) => n[0]).join('')}
          </div>
          <h1 className="text-3xl font-bold leading-tight">
            {personalInfo?.data?.fullName || 'John Doe'}
          </h1>
        </div>
        <div className="flex flex-col gap-2 text-sm opacity-90 mt-4">
          <span>{personalInfo?.data?.email || 'john@example.com'}</span>
          <span>{personalInfo?.data?.phone || '(555) 123-4567'}</span>
          <span>{personalInfo?.data?.location || 'New York, NY'}</span>
        </div>
      </div>
    
      
      <div className="w-2/3 p-8">
        {otherSections.map((section) => (
          <div key={`CreativeTemplate-${section.id}`} className="mb-8">
            <h2 className="text-2xl font-bold mb-3 text-emerald-900 border-l-4 border-emerald-500 pl-3">
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
