import { motion } from 'framer-motion';

export function RecruitersView() {
  const views = [
    { title: "ATS VIEW", desc: "Is your resume structured and readable for applicant tracking systems?" },
    { title: "SKILL VIEW", desc: "Are your relevant skills clearly represented?" },
    { title: "EXPERIENCE VIEW", desc: "Does your experience communicate meaningful impact?" },
    { title: "JOB VIEW", desc: "How closely does your profile align with the role?" },
    { title: "IMPROVEMENT VIEW", desc: "What should you change before applying?" }
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
            UNDERSTAND WHAT <span className="text-[#FF3366]">RECRUITERS SEE</span>
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            ProfileIQ helps you look at your resume from multiple perspectives.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {views.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="p-8 rounded-3xl bg-slate-50/50 border border-slate-100 shadow-sm text-left hover:bg-slate-50 transition-colors"
            >
              <div className="text-xs font-bold tracking-widest text-[#FF3366] mb-4 uppercase">{v.title}</div>
              <p className="text-slate-900 font-medium text-lg leading-snug">{v.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
