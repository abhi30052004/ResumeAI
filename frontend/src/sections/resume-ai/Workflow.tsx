import React from 'react';
import { motion } from 'framer-motion';
import { FileText, Cpu, Target, Eye, Users, CheckCircle, Database, ArrowDown } from 'lucide-react';

const steps = [
  {
    icon: FileText,
    title: "REQUIREMENT",
    description: "Manager creates a project requirement.",
    color: "from-blue-500 to-indigo-500"
  },
  {
    icon: Cpu,
    title: "AI UNDERSTANDS",
    description: "ProfileIQ extracts skills, experience, technology, and requirements.",
    color: "from-[#635BFF] to-[#A07CFF]"
  },
  {
    icon: Target,
    title: "MATCH",
    description: "AI identifies relevant available employees.",
    color: "from-fuchsia-500 to-pink-500"
  },
  {
    icon: Eye,
    title: "REVIEW",
    description: "Manager reviews explainable recommendations.",
    color: "from-[#FF3366] to-[#FF8A8A]"
  },
  {
    icon: Users,
    title: "INTERVIEW",
    description: "Schedule and manage candidate interviews.",
    color: "from-orange-500 to-amber-500"
  },
  {
    icon: CheckCircle,
    title: "ASSIGN",
    description: "Manager makes the final assignment decision.",
    color: "from-[#27C93F] to-[#8EE09C]"
  },
  {
    icon: Database,
    title: "TRACK",
    description: "Project history becomes part of the employee's professional profile.",
    color: "from-emerald-500 to-teal-500"
  }
];

export function Workflow() {
  return (
    <section className="py-24 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-bold uppercase tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
            How It <span className="text-[#635BFF]">Works</span>
          </h2>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">
            From project requirement to intelligent staffing in a few seamless steps.
          </p>
        </div>

        <div className="max-w-3xl mx-auto relative">
          {/* Connecting Line */}
          <div className="absolute left-8 top-12 bottom-12 w-1 bg-gradient-to-b from-blue-500 via-[#FF3366] to-teal-500 rounded-full opacity-30 md:left-1/2 md:-ml-0.5" />

          {steps.map((step, index) => {
            const isEven = index % 2 === 0;
            const Icon = step.icon;
            
            return (
              <motion.div 
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative flex items-center mb-12 md:mb-16 ${
                  isEven ? 'md:flex-row-reverse' : 'md:flex-row'
                }`}
              >
                {/* Center Node */}
                <div className="absolute left-8 md:left-1/2 md:-translate-x-1/2 w-12 h-12 bg-white rounded-full border-4 border-slate-50 shadow-md flex items-center justify-center z-10 -ml-5 md:ml-0">
                  <div className={`w-full h-full rounded-full bg-gradient-to-br ${step.color} opacity-20 absolute`} />
                  <Icon className={`w-5 h-5 text-slate-700 relative z-10`} />
                </div>

                {/* Content Card */}
                <div className={`ml-16 md:ml-0 md:w-1/2 ${isEven ? 'md:pl-16' : 'md:pr-16 text-left md:text-right'} w-full`}>
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow group">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-[#635BFF] transition-colors">{step.title}</h3>
                    <p className="text-slate-500 text-sm leading-relaxed">{step.description}</p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
