import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, X } from 'lucide-react';
import { cn } from '../../utils/cn';

const projects = [
  {
    id: "01",
    title: "AI PROCUREMENT",
    desc: "AI-assisted procurement workflow that analyzes requirements and streamlines approval.",
    fullDesc: "This platform completely revolutionized how the enterprise handled procurement. By integrating LLMs to parse unstructured requirements documents, the system automatically matches needs with vendor capabilities and generates preliminary RFPs. Built with React, FastAPI, and MongoDB.",
    tech: "React · FastAPI · MongoDB · AI",
    img: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=2000&q=80",
    color: "#635BFF"
  },
  {
    id: "02",
    title: "ENTERPRISE AUTOMATION",
    desc: "A sprawling internal tool that automated 400+ weekly manual data entry hours.",
    fullDesc: "Designed to eliminate friction across five departments, this tool replaced an aging legacy system. It features real-time WebSocket sync, complex data grid manipulations, and an automated report generation pipeline.",
    tech: "Next.js · TypeScript · PostgreSQL",
    img: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=2000&q=80",
    color: "#111111"
  }
];

export function Projects() {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedProject = projects.find(p => p.id === selectedId);

  return (
    <>
      <section className="py-40 bg-[#FFFFFF]">
        <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
          <h2 className="text-xs font-mono uppercase tracking-[0.3em] text-[#666666] mb-24">SELECTED WORK</h2>

          <div className="space-y-48">
            {projects.map((project) => (
              <motion.div 
                key={project.id}
                layoutId={`project-container-${project.id}`}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10%" }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group cursor-pointer"
                onClick={() => setSelectedId(project.id)}
              >
                <div className="grid lg:grid-cols-12 gap-12 items-center">
                  
                  {/* Text Content */}
                  <div className="lg:col-span-4 order-2 lg:order-1">
                    <motion.div layoutId={`project-num-${project.id}`} className="text-[#635BFF] font-mono text-xl mb-6 font-bold group-hover:scale-110 origin-left transition-transform duration-300">
                      {project.id}
                    </motion.div>
                    <motion.h3 layoutId={`project-title-${project.id}`} className="text-4xl lg:text-5xl font-bold text-[#111111] tracking-tighter mb-6 leading-[1.1]">
                      {project.title}
                    </motion.h3>
                    <p className="text-[#666666] text-lg font-light mb-8 leading-relaxed">
                      {project.desc}
                    </p>
                    <div className="text-xs font-mono font-bold text-[#111111] uppercase tracking-widest border-b border-[#111111] pb-4 inline-flex items-center gap-2 group-hover:text-[#635BFF] group-hover:border-[#635BFF] transition-colors">
                      VIEW PROJECT <ArrowRight className="w-4 h-4 group-hover:-rotate-45 transition-transform duration-300" />
                    </div>
                  </div>

                  {/* Image Frame */}
                  <div className="lg:col-span-8 order-1 lg:order-2 perspective-[1200px]">
                    <motion.div 
                      layoutId={`project-image-container-${project.id}`}
                      className="relative rounded-2xl bg-white border border-[#E5E5DE] p-2 shadow-[0_30px_60px_rgba(0,0,0,0.05)] overflow-hidden"
                      data-cursor="VIEW PROJECT"
                      whileHover={{ rotateY: -2, rotateX: 2, scale: 1.02 }}
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    >
                      {/* Browser Header */}
                      <div className="flex gap-1.5 px-4 py-3 border-b border-[#F0F0EA] mb-2 bg-white z-10 relative">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5DE]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5DE]" />
                        <div className="w-2.5 h-2.5 rounded-full bg-[#E5E5DE]" />
                      </div>
                      <div className="overflow-hidden rounded-lg bg-[#F7F7F2] relative">
                        {/* Subtle parallax on image inside container during scroll would be here */}
                        <motion.img 
                          layoutId={`project-image-${project.id}`}
                          src={project.img} 
                          alt={project.title}
                          className="w-full aspect-[16/10] object-cover origin-center group-hover:scale-[1.05] transition-transform duration-700 ease-out"
                        />
                      </div>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Project Modal */}
      <AnimatePresence>
        {selectedId && selectedProject && (
          <div className="fixed inset-0 z-[999999] flex items-center justify-center p-4 md:p-12">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#F7F7F2]/90 backdrop-blur-md cursor-pointer"
              onClick={() => setSelectedId(null)}
            />
            
            <motion.div 
              layoutId={`project-container-${selectedProject.id}`}
              className="w-full max-w-6xl max-h-full bg-white rounded-3xl border border-[#E5E5DE] shadow-2xl relative flex flex-col md:flex-row overflow-hidden"
            >
              <button 
                onClick={() => setSelectedId(null)}
                className="absolute top-6 right-6 w-10 h-10 bg-[#F0F0EA] rounded-full flex items-center justify-center text-[#111111] hover:bg-[#111111] hover:text-white transition-colors z-50 group"
              >
                <X className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              </button>

              <motion.div layoutId={`project-image-container-${selectedProject.id}`} className="w-full md:w-1/2 bg-[#F7F7F2] p-4 flex items-center justify-center border-r border-[#E5E5DE]">
                <motion.img 
                  layoutId={`project-image-${selectedProject.id}`}
                  src={selectedProject.img} 
                  alt={selectedProject.title}
                  className="w-full h-auto rounded-xl shadow-lg"
                />
              </motion.div>

              <div className="w-full md:w-1/2 p-8 md:p-16 overflow-y-auto">
                <motion.div layoutId={`project-num-${selectedProject.id}`} className="text-[#635BFF] font-mono text-xl mb-4 font-bold">
                  {selectedProject.id}
                </motion.div>
                <motion.h3 layoutId={`project-title-${selectedProject.id}`} className="text-4xl md:text-5xl font-bold text-[#111111] tracking-tighter mb-8 leading-[1]">
                  {selectedProject.title}
                </motion.h3>
                
                <div className="space-y-6 text-[#666666] font-light text-lg">
                  <p>{selectedProject.fullDesc}</p>
                  
                  <div className="pt-8 border-t border-[#E5E5DE]">
                    <div className="text-xs font-mono uppercase tracking-[0.2em] text-[#111111] font-bold mb-4">Tech Stack</div>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.tech.split('·').map(t => (
                        <span key={t} className="px-3 py-1 bg-[#F0F0EA] text-[#111111] text-xs font-bold rounded-full">
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-12">
                  <button className="px-8 py-4 bg-[#111111] text-white rounded-full font-bold hover:bg-[#635BFF] transition-colors flex items-center">
                    Visit Live Site <ArrowRight className="w-4 h-4 ml-2" />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
