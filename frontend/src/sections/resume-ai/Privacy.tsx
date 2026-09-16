import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export function Privacy() {
  return (
    <section className="py-24 bg-[#F8FAFC] relative overflow-hidden text-slate-900 border-t border-slate-100">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto bg-white p-12 rounded-[2rem] border border-slate-100 shadow-[0_20px_60px_rgba(0,0,0,0.03)]"
        >
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-600">
            <Lock className="w-8 h-8" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
            PRIVATE BY DESIGN
          </h2>
          <p className="text-xl font-bold text-slate-800 mb-4">
            Your professional information belongs to you.
          </p>
          <p className="text-base text-slate-600 mb-8 max-w-lg mx-auto">
            ProfileIQ is designed with privacy in mind, giving you control over your resumes, profile data, and career information.
          </p>
          <div className="text-sm font-bold tracking-widest text-[#635BFF] uppercase">
            Your data. Your profile. Your career.
          </div>
        </motion.div>
      </div>
    </section>
  );
}
