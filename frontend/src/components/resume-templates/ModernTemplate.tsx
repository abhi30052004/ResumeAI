import React from 'react';

export function ModernTemplate({ sections }: { sections: any[] }) {
  const personalInfo = sections.find(s => s.type === 'Personal Information');
  const otherSections = sections.filter(s => s.type !== 'Personal Information');

  return (
    <div className="w-full min-h-full bg-white text-gray-800 font-sans">
      
      <div className="p-8 border-b-4 border-blue-600 bg-gray-50">
        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
          {personalInfo?.data?.fullName || 'John Doe'}
        </h1>
        <p className="text-sm mt-3 text-blue-600 font-medium flex gap-4">
          <span>{personalInfo?.data?.email || 'john@example.com'}</span>
          <span>{personalInfo?.data?.phone || '(555) 123-4567'}</span>
          <span>{personalInfo?.data?.location || 'New York, NY'}</span>
        </p>
      </div>
    
      
      <div className="p-8 pt-6">
        {otherSections.map((section) => (
          <div key={`ModernTemplate-${section.id}`} className="mb-8">
            <h2 className="text-xl font-bold uppercase tracking-wider mb-4 text-blue-700 flex items-center">
              {section.type}
              <span className="ml-4 flex-1 h-px bg-gray-200"></span>
            </h2>
            <div className="text-sm whitespace-pre-wrap leading-relaxed text-gray-700">
              {section.content || <span className="text-gray-400 italic">Content for {section.type} will appear here...</span>}
            </div>
          </div>
        ))}
      </div>
    
    </div>
  );
}
