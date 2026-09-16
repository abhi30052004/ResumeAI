import { motion } from 'framer-motion';

export function ProfileEvolves() {
  const versions = [
    { title: "Software Engineer Profile", skills: ["React", "TypeScript", "Node.js", "APIs"] },
    { title: "AI/ML Profile", skills: ["Python", "Machine Learning", "NLP", "LLMs"] },
    { title: "Full-Stack Profile", skills: ["React", "FastAPI", "PostgreSQL", "AWS"] },
  ];

  return (
    <section className="py-32 bg-[#F8FAFC] relative overflow-hidden text-slate-900 border-t border-slate-100">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10 grid lg:grid-cols-2 gap-16 items-center">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-6 drop-shadow-sm uppercase">
              BUILD A PROFILE THAT<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#A07CFF]">EVOLVES WITH YOU.</span>
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1, delay: 0.3 }}
            className="text-lg text-slate-600 space-y-4"
          >
            <p className="font-bold text-xl text-slate-900">Your career changes. Your profile should too.</p>
            <p>Create and manage multiple versions of your professional profile for different career goals.</p>
            <p className="text-base text-slate-500 pt-4 italic">Tailor your profile without starting from scratch.</p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="space-y-4"
        >
          {versions.map((v, i) => (
            <motion.div 
              key={v.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.2 + 0.4 }}
              className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="font-bold text-slate-900 mb-2">{v.title}</div>
              <div className="flex flex-wrap gap-2 text-xs font-bold text-[#635BFF]">
                {v.skills.join(" · ")}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
