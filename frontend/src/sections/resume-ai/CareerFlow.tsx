import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';

export function CareerFlow() {
  const steps = [
    "Your Profile",
    "Skills & Experience",
    "AI Analysis",
    "Job Requirements",
    "Match & Gap Analysis",
    "Actionable Recommendations"
  ];

  return (
    <section className="py-32 bg-white relative overflow-hidden text-slate-900">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter text-slate-900 mb-6 drop-shadow-sm">
            ONE PROFILE.<br />
            <span className="text-[#635BFF]">MULTIPLE OPPORTUNITIES.</span>
          </h2>
          <p className="text-lg text-slate-900 font-bold max-w-xl mx-auto mb-2">
            Your experience can fit different roles.
          </p>
          <p className="text-base text-slate-600 max-w-2xl mx-auto">
            ProfileIQ helps you understand where your existing skills align and what you need to develop for your target roles.
          </p>
        </motion.div>

        <div className="flex flex-col items-center gap-4 relative z-10 max-w-lg mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="w-full"
            >
              <div className="bg-slate-50 border border-slate-200 py-4 px-6 rounded-2xl shadow-sm font-bold text-slate-800 text-sm tracking-wide uppercase text-center w-full">
                {step}
              </div>
              {i < steps.length - 1 && (
                <div className="flex justify-center my-3 text-slate-300">
                  <ArrowDown className="w-5 h-5 animate-bounce" />
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
