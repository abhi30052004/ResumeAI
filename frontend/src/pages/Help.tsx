import React from 'react';
import { useAuth } from '../context/AuthContext';
import { HelpCircle, MessageSquare, BookOpen, ChevronRight, Zap, Shield, FileText } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';

export function Help() {
  const { user } = useAuth();
  
  const faqs = [
    { q: 'How does the AI Match Score work?', a: 'Our AI analyzes your ProfileIQ skills and experience against each job description using NLP, computing a semantic match score out of 100%.' },
    { q: 'How do I update my skills?', a: 'Go to Settings > Profile and add or remove your verified skills. The more accurate your profile, the better your match scores will be.' },
    { q: 'How do I apply for an internal role?', a: 'Visit the Opportunities page, browse open positions, and click "Apply Now" on any role that interests you. Your manager will be notified instantly.' },
    { q: 'Can I message my manager directly?', a: 'Yes! Use the Messages feature to send direct messages to your manager or HR team about open roles, project allocations, or general questions.' }
  ];

  const resources = [
    { icon: BookOpen, title: 'Getting Started Guide', desc: 'Learn how to set up your ProfileIQ profile for the best results.', color: 'text-[#635BFF] bg-indigo-50' },
    { icon: Zap, title: 'Maximize Your Match Score', desc: 'Tips and tricks to push your AI match scores above 90%.', color: 'text-amber-600 bg-amber-50' },
    { icon: Shield, title: 'Privacy & Data Policy', desc: 'Understand how your professional data is stored and used.', color: 'text-emerald-600 bg-emerald-50' },
  ];

  return (
    <div className="flex-1 bg-dash-bg py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Help & Support</h1>
          <p className="text-gray-500 mt-2 text-lg">Find answers to common questions and contact our team.</p>
        </div>

        {/* Contact Banner */}
        <div className="bg-gradient-to-r from-[#635BFF] to-[#A07CFF] p-8 rounded-3xl text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl font-bold mb-2">Need direct help?</h2>
            <p className="text-white/80">Our support team typically responds within 2 business hours.</p>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/dashboard/messages">
              <Button className="bg-white text-[#635BFF] hover:bg-white/90 gap-2 font-semibold">
                <MessageSquare className="w-4 h-4" /> Open a Chat
              </Button>
            </Link>
          </div>
        </div>

        {/* FAQ */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Frequently Asked Questions</h2>
          <div className="grid gap-4">
            {faqs.map((faq, i) => (
              <details key={i} className="bg-white p-6 rounded-2xl border border-dash-border shadow-sm group cursor-pointer">
                <summary className="flex justify-between items-center list-none font-bold text-gray-900">
                  {faq.q}
                  <ChevronRight className="w-5 h-5 text-gray-400 transition-transform group-open:rotate-90 shrink-0 ml-4" />
                </summary>
                <p className="mt-4 text-gray-600 text-sm leading-relaxed">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>

        {/* Resources */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-900">Resources</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {resources.map((res) => (
              <div key={res.title} className="bg-white p-6 rounded-2xl border border-dash-border shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-4 ${res.color}`}>
                  <res.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 group-hover:text-[#635BFF] transition-colors mb-1">{res.title}</h3>
                <p className="text-sm text-gray-500">{res.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
