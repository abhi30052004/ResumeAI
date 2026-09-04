import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Spinner } from '../components/ui/Spinner';
import { ChevronLeft, Save, Sparkles, Check, X, RefreshCw } from 'lucide-react';
import api from '../lib/api';

export function Improve() {
  const { id } = useParams<{ id: string }>();
  const [resume, setResume] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const [currentSection, setCurrentSection] = useState('Experience');
  const [originalText, setOriginalText] = useState('');
  const [improvedText, setImprovedText] = useState('');
  const [explanation, setExplanation] = useState('');
  
  const [improving, setImproving] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const extractSection = (fullText: string, sectionName: string) => {
    if (!fullText) return '';
    
    const aliases: Record<string, string[]> = {
      'Professional Summary': ['summary', 'profile', 'objective', 'professional summary', 'about me'],
      'Experience': ['experience', 'work experience', 'employment', 'employment history', 'work history'],
      'Projects': ['projects', 'personal projects', 'academic projects'],
      'Skills': ['skills', 'technical skills', 'core competencies', 'technologies', 'expertise'],
      'Education': ['education', 'academic background', 'academic qualifications']
    };
    
    const targets = aliases[sectionName] || [sectionName.toLowerCase()];
    const lines = fullText.split('\n');
    let startIndex = -1;
    let endIndex = -1;
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim().toLowerCase();
      // Look for a short line that matches a known header
      if (targets.includes(line) || (line.length > 2 && line.length < 35 && targets.some(t => line.includes(t)))) {
        startIndex = i;
        break;
      }
    }
    
    if (startIndex === -1) {
      return `[We couldn't automatically find the ${sectionName} section in your uploaded resume.\n\nPlease paste it here manually to improve it.]`;
    }
    
    const allAliases = Object.values(aliases).flat();
    for (let i = startIndex + 1; i < lines.length; i++) {
      const line = lines[i].trim();
      const lowerLine = line.toLowerCase();
      
      // Stop if we hit a blank line followed by another short header-like line
      if (line === '' && i + 1 < lines.length) {
        const nextLine = lines[i+1].trim().toLowerCase();
        if (nextLine.length > 2 && nextLine.length < 35 && allAliases.some(a => nextLine.includes(a))) {
            endIndex = i;
            break;
        }
      }
      
      // Stop if we hit an exact known header
      if (lowerLine.length > 2 && lowerLine.length < 35 && allAliases.includes(lowerLine)) {
        endIndex = i;
        break;
      }
    }
    
    if (endIndex === -1) endIndex = lines.length;
    
    return lines.slice(startIndex + 1, endIndex).join('\n').trim();
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await api.get(`/api/resumes/${id}`);
        setResume(response.data);
        
        // Extract the selected section initially
        setOriginalText(extractSection(response.data.resume_text, currentSection));
        
      } catch (err) {
        console.error('Failed to fetch resume', err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchResume();
  }, [id]);

  // Update text when section changes
  useEffect(() => {
    if (resume?.resume_text) {
      // Only auto-update if the user hasn't heavily modified it or it's a fallback message
      setOriginalText(extractSection(resume.resume_text, currentSection));
      setImprovedText('');
      setExplanation('');
    }
  }, [currentSection]);

  const handleImprove = async () => {
    if (!originalText) return;
    
    setImproving(true);
    setAccepted(false);
    
    try {
      const response = await api.post(`/api/resumes/${id}/improve-section`, {
        section_name: currentSection,
        original_text: originalText
      });
      
      setImprovedText(response.data.improved_text);
      setExplanation(response.data.explanation);
    } catch (err) {
      console.error('Failed to improve text', err);
    } finally {
      setImproving(false);
    }
  };
  
  const handleAccept = () => {
    setOriginalText(improvedText);
    setImprovedText('');
    setExplanation('');
    setAccepted(true);
    setTimeout(() => setAccepted(false), 3000);
  };
  
  const handleReject = () => {
    setImprovedText('');
    setExplanation('');
  };

  if (loading) return <div className="flex-1 flex justify-center items-center"><Spinner className="w-12 h-12" /></div>;

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50">
      {/* Header Bar */}
      <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-16 z-40">
        <div className="flex items-center gap-4">
          <Link to={`/dashboard/analysis/${id}`}>
            <Button variant="ghost" size="sm" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
              Back to Analysis
            </Button>
          </Link>
          <h1 className="font-semibold text-gray-900 border-l border-gray-300 pl-4">{resume?.name}</h1>
        </div>
        <div className="flex items-center gap-2">
          {accepted && <span className="text-sm text-emerald-600 flex items-center mr-2"><Check className="w-4 h-4 mr-1" /> Saved</span>}
          <Button variant="primary" size="sm" className="gap-2">
            <Save className="w-4 h-4" />
            Save Changes
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col md:flex-row max-w-7xl mx-auto p-4 gap-4">
          
          {/* Left Panel: Original Editor */}
          <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex justify-between items-center">
              <h2 className="font-medium text-gray-700">Original Resume</h2>
              <select 
                className="text-sm border-gray-300 rounded-md py-1"
                value={currentSection}
                onChange={(e) => setCurrentSection(e.target.value)}
              >
                <option value="Professional Summary">Professional Summary</option>
                <option value="Experience">Experience</option>
                <option value="Projects">Projects</option>
                <option value="Skills">Skills</option>
                <option value="Education">Education</option>
              </select>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Edit Content to Improve
              </label>
              <textarea 
                className="w-full flex-1 resize-none border-none focus:ring-0 p-0 text-gray-800"
                value={originalText}
                onChange={(e) => setOriginalText(e.target.value)}
                placeholder="Paste the bullet point or paragraph you want to improve..."
              />
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end">
                <Button 
                  onClick={handleImprove} 
                  disabled={improving || !originalText}
                  className="bg-gradient-to-r from-primary to-purple-600 hover:from-primary-hover hover:to-purple-700 shadow-md gap-2"
                >
                  {improving ? <Spinner className="w-4 h-4 text-white" /> : <Sparkles className="w-4 h-4" />}
                  {improving ? 'AI is thinking...' : 'Improve with AI'}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Right Panel: AI Improved */}
          <div className="flex-1 flex flex-col bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
            <div className="bg-purple-50 border-b border-purple-100 px-4 py-3 flex items-center">
              <Sparkles className="w-4 h-4 text-purple-600 mr-2" />
              <h2 className="font-medium text-purple-900">AI Improved Version</h2>
            </div>
            
            <div className="p-4 flex-1 flex flex-col bg-gray-50/30">
              {!improvedText && !improving ? (
                <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                  <Sparkles className="w-12 h-12 mb-4 opacity-20" />
                  <p>Click "Improve with AI" to generate a better version.</p>
                </div>
              ) : improving ? (
                <div className="flex-1 flex flex-col items-center justify-center">
                  <Spinner className="w-8 h-8 text-purple-500 mb-4" />
                  <p className="text-purple-600 font-medium">Generating improvements...</p>
                </div>
              ) : (
                <div className="flex-1 flex flex-col h-full">
                  <div className="bg-white border border-gray-200 rounded-md p-4 mb-4 shadow-sm flex-1">
                    <p className="text-gray-900 whitespace-pre-wrap">{improvedText}</p>
                  </div>
                  
                  <div className="bg-blue-50 border border-blue-100 rounded-md p-3 mb-4">
                    <p className="text-sm text-blue-800"><span className="font-semibold">Why this is better:</span> {explanation}</p>
                  </div>
                  
                  <div className="flex justify-end gap-2 mt-auto">
                    <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50" onClick={handleReject}>
                      <X className="w-4 h-4 mr-1" /> Reject
                    </Button>
                    <Button variant="outline" onClick={handleImprove}>
                      <RefreshCw className="w-4 h-4 mr-1" /> Regenerate
                    </Button>
                    <Button variant="primary" className="bg-emerald-600 hover:bg-emerald-700" onClick={handleAccept}>
                      <Check className="w-4 h-4 mr-1" /> Accept Changes
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
