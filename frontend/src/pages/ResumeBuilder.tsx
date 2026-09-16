import React, { useState } from 'react';
import { useToast } from '../context/ToastContext';
import { Button } from '../components/ui/Button';
import { Card, CardContent } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Plus, GripVertical, Trash2, Download, Sparkles, RefreshCw, LayoutTemplate } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import api from '../lib/api';
import {
  ModernTemplate,
  ProfessionalTemplate,
  CreativeTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  TechTemplate,
  ElegantTemplate,
  CompactTemplate,
  BoldTemplate,
  StartupTemplate
} from '../components/resume-templates';

const TemplateMap: Record<string, React.FC<any>> = {
  ModernTemplate,
  ProfessionalTemplate,
  CreativeTemplate,
  MinimalistTemplate,
  ExecutiveTemplate,
  TechTemplate,
  ElegantTemplate,
  CompactTemplate,
  BoldTemplate,
  StartupTemplate
};

export function ResumeBuilder() {
  const { toast } = useToast();

  const [sections, setSections] = useState<any[]>([
    { id: '1', type: 'Personal Information', content: '', data: { fullName: '', email: '', phone: '', location: '' } },
    { id: '2', type: 'Professional Summary', content: '' },
    { id: '3', type: 'Experience', content: '' },
  ]);
  
  const [activeTemplate, setActiveTemplate] = useState('ModernTemplate');

  const addSection = (type: string) => {
    setSections([...sections, { id: Date.now().toString(), type, content: '' }]);
  };

  const removeSection = (id: string) => {
    setSections(sections.filter(s => s.id !== id));
  };

  const [generatingFor, setGeneratingFor] = useState<string | null>(null);

  const generateWithAI = async (index: number, type: string, currentContent: string) => {
    setGeneratingFor(sections[index].id);
    try {
      const response = await api.post('/api/resumes/generate-section', {
        section_name: type,
        current_content: currentContent
      });
      
      const newSections = [...sections];
      newSections[index].content = response.data.generated_text;
      setSections(newSections);
    } catch (error) {
      console.error('Failed to generate AI content', error);
      toast('Failed to generate content. Please try again.');
    } finally {
      setGeneratingFor(null);
    }
  };

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8 h-[calc(100vh-8rem)]">
        
        {/* Editor */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900">Resume Builder</h2>
            <div className="flex gap-2">
              <select 
                className="text-sm border-gray-300 rounded-md py-1"
                onChange={(e) => {
                  if (e.target.value) {
                    addSection(e.target.value);
                    e.target.value = '';
                  }
                }}
                defaultValue=""
              >
                <option value="" disabled>+ Add Section</option>
                <option value="Skills">Skills</option>
                <option value="Experience">Experience</option>
                <option value="Projects">Projects</option>
                <option value="Education">Education</option>
                <option value="Certifications">Certifications</option>
              </select>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {sections.map((section, index) => (
              <Card key={section.id} className="relative group shadow-none border-gray-300">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2 text-gray-700 font-medium">
                      <GripVertical className="w-4 h-4 text-gray-400 cursor-move" />
                      {section.type}
                    </div>
                    <button 
                      onClick={() => removeSection(section.id)}
                      className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  {section.type === 'Personal Information' ? (
                    <div className="grid grid-cols-2 gap-3">
                      <Input 
                        placeholder="Full Name" 
                        value={section.data?.fullName || ''}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].data = { ...newSections[index].data, fullName: e.target.value };
                          setSections(newSections);
                        }}
                      />
                      <Input 
                        placeholder="Email" 
                        value={section.data?.email || ''}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].data = { ...newSections[index].data, email: e.target.value };
                          setSections(newSections);
                        }}
                      />
                      <Input 
                        placeholder="Phone" 
                        value={section.data?.phone || ''}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].data = { ...newSections[index].data, phone: e.target.value };
                          setSections(newSections);
                        }}
                      />
                      <Input 
                        placeholder="Location" 
                        value={section.data?.location || ''}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].data = { ...newSections[index].data, location: e.target.value };
                          setSections(newSections);
                        }}
                      />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2">
                      <textarea 
                        className="w-full h-32 rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-y"
                        placeholder={`Enter your ${section.type.toLowerCase()} here...`}
                        value={section.content}
                        onChange={(e) => {
                          const newSections = [...sections];
                          newSections[index].content = e.target.value;
                          setSections(newSections);
                        }}
                      />
                      <div className="flex justify-end">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                          onClick={() => generateWithAI(index, section.type, section.content)}
                          disabled={generatingFor === section.id}
                        >
                          {generatingFor === section.id ? (
                            <Spinner className="w-4 h-4 mr-2" />
                          ) : section.content.length > 0 ? (
                            <RefreshCw className="w-4 h-4 mr-2" />
                          ) : (
                            <Sparkles className="w-4 h-4 mr-2" />
                          )}
                          {generatingFor === section.id ? 'Working...' : section.content.length > 0 ? 'Regenerate with AI' : 'Generate with AI'}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        
        {/* Live Preview */}
        <div className="w-full md:w-1/2 flex flex-col h-full bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
            <h2 className="font-semibold text-gray-900 flex items-center gap-2">
              <LayoutTemplate className="w-5 h-5 text-gray-500" />
              Live Preview
            </h2>
            <div className="flex gap-3">
              <select 
                className="text-sm border-gray-300 rounded-md py-1"
                value={activeTemplate}
                onChange={(e) => setActiveTemplate(e.target.value)}
              >
                <option value="ModernTemplate">Modern Template</option>
                <option value="ProfessionalTemplate">Professional Template</option>
                <option value="CreativeTemplate">Creative Template</option>
                <option value="MinimalistTemplate">Minimalist Template</option>
                <option value="ExecutiveTemplate">Executive Template</option>
                <option value="TechTemplate">Tech Template</option>
                <option value="ElegantTemplate">Elegant Template</option>
                <option value="CompactTemplate">Compact Template</option>
                <option value="BoldTemplate">Bold Template</option>
                <option value="StartupTemplate">Startup Template</option>
              </select>
              <Button size="sm" className="gap-2" onClick={() => toast('Download feature coming soon!')}>
                <Download className="w-4 h-4" /> Download PDF
              </Button>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto bg-gray-200 p-8 flex justify-center">
            {/* A4 Paper mockup */}
            <div className="bg-white w-full max-w-[21cm] min-h-[29.7cm] shadow-xl print:shadow-none overflow-hidden relative">
              {React.createElement(TemplateMap[activeTemplate] || ModernTemplate, { sections })}
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
}
