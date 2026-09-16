import { motion } from 'framer-motion';

export function CareerData() {
  const metrics = [
    { label: "Profile Strength", value: "87", sub: "/ 100" },
    { label: "Skills Identified", value: "24", sub: "" },
    { label: "Strong Matches", value: "18", sub: "" },
    { label: "Improvement Areas", value: "6", sub: "" },
    { label: "Profile Versions", value: "4", sub: "" },
  ];

  return (
    <section className="py-32 bg-[#0F172A] relative overflow-hidden text-white">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold uppercase tracking-tighter mb-6 drop-shadow-sm">
              YOUR CAREER,<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#27C93F] to-[#10b981]">BACKED BY DATA.</span>
            </h2>
            <p className="text-lg text-slate-300 max-w-lg mb-4">
              ProfileIQ turns your professional information into useful insights.
            </p>
            <p className="text-base text-slate-400 italic">
              Track how your professional profile evolves over time.
            </p>
          </motion.div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {metrics.map((m, i) => (
              <motion.div
                key={m.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-white/10"
              >
                <div className="text-4xl font-bold tracking-tighter mb-1">
                  {m.value}<span className="text-lg text-slate-500 font-medium">{m.sub}</span>
                </div>
                <div className="text-xs font-bold uppercase tracking-wider text-slate-400">{m.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
