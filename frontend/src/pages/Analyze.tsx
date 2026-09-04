import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent } from '../components/ui/Card';
import { Upload, FileText, Briefcase, ChevronRight } from 'lucide-react';
import { Spinner } from '../components/ui/Spinner';
import api from '../lib/api';

export function Analyze() {
  const navigate = useNavigate();
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadMode, setUploadMode] = useState<'file' | 'text'>('file');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!jobDescription) {
      setError('Please provide a job description to analyze against.');
      return;
    }
    
    if (uploadMode === 'file' && !file) {
      setError('Please upload a resume file.');
      return;
    }
    
    if (uploadMode === 'text' && !resumeText) {
      setError('Please paste your resume text.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      let resumeId = '';
      
      if (uploadMode === 'file' && file) {
        const formData = new FormData();
        formData.append('file', file);
        if (file.name) formData.append('name', file.name);
        else formData.append('name', 'resume');
        
        if (targetRole) formData.append('target_role', targetRole);
        if (jobDescription) formData.append('job_description', jobDescription);
        
        const response = await api.post('/api/resumes/upload', formData);
        resumeId = response.data.id;
      } else {
        const response = await api.post('/api/resumes', {
          name: 'Pasted Resume ' + new Date().toLocaleDateString(),
          target_role: targetRole,
          resume_text: resumeText,
          job_description: jobDescription
        });
        resumeId = response.data.id;
      }

      // Trigger analysis
      const analysisResponse = await api.post(`/api/analysis?resume_id=${resumeId}`);
      
      // Navigate to results
      navigate(`/dashboard/analysis/${analysisResponse.data.id}`);
      
    } catch (err: any) {
      console.error(err);
      setError('An error occurred during analysis. Please try again.');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 p-6 text-center">
        <Spinner className="w-16 h-16 mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AI is analyzing your resume...</h2>
        <p className="text-gray-500 max-w-md">
          This usually takes about 15-30 seconds. We are comparing your profile against the job requirements and identifying areas for improvement.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Analyze Resume</h1>
          <p className="text-gray-600 mt-1">Upload your resume and a job description to get started.</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-lg border border-red-100">
            {error}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Column: Resume */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <FileText className="w-5 h-5 text-primary" />
              1. Your Resume
            </h2>
            
            <Card className="flex-1">
              <CardContent className="p-6 h-full flex flex-col">
                <div className="flex border-b border-gray-200 mb-6">
                  <button
                    className={`pb-2 px-4 font-medium text-sm border-b-2 ${uploadMode === 'file' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setUploadMode('file')}
                  >
                    Upload File
                  </button>
                  <button
                    className={`pb-2 px-4 font-medium text-sm border-b-2 ${uploadMode === 'text' ? 'border-primary text-primary' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                    onClick={() => setUploadMode('text')}
                  >
                    Paste Text
                  </button>
                </div>
                
                {uploadMode === 'file' ? (
                  <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 p-12 text-center hover:bg-gray-100 transition-colors">
                    <Upload className="w-10 h-10 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-1">Upload Resume</h3>
                    <p className="text-sm text-gray-500 mb-4">Supported formats: PDF, DOCX</p>
                    <input
                      type="file"
                      id="resume-upload"
                      className="hidden"
                      accept=".pdf,.docx,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      onChange={handleFileChange}
                    />
                    <Button 
                      variant="outline" 
                      onClick={() => document.getElementById('resume-upload')?.click()}
                    >
                      {file ? file.name : 'Select File'}
                    </Button>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Or paste your resume
                    </label>
                    <textarea
                      className="flex-1 min-h-[300px] w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      placeholder="Paste your resume content here..."
                      value={resumeText}
                      onChange={(e) => setResumeText(e.target.value)}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Job Description */}
          <div className="flex flex-col gap-4">
            <h2 className="text-xl font-semibold flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-emerald-500" />
              2. Target Job
            </h2>
            
            <Card className="flex-1 flex flex-col">
              <CardContent className="p-6 h-full flex flex-col gap-4">
                <Input
                  label="Target Role / Job Title"
                  placeholder="e.g. Senior Frontend Developer"
                  value={targetRole}
                  onChange={(e) => setTargetRole(e.target.value)}
                />
                
                <div className="flex-1 flex flex-col mt-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Paste the job description here... <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    className="flex-1 min-h-[220px] w-full rounded-md border border-gray-300 p-3 text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder="Paste the full job description, requirements, and responsibilities here..."
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="mt-8 flex justify-end">
          <Button size="lg" className="px-8" onClick={handleAnalyze}>
            Analyze Resume
            <ChevronRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}
