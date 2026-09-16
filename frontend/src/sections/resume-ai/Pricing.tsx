import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2 } from 'lucide-react';

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const plans = [
    { name: 'FREE', price: '0', desc: 'For exploring your professional profile.', features: ['Basic profile analysis', 'Basic ATS analysis', 'Limited job matching', 'AI improvement suggestions', 'Profile dashboard'], buttonText: 'Get Started' },
    { name: 'PRO', price: '12', desc: 'For actively improving your career profile.', features: ['Advanced AI profile analysis', 'Unlimited job matching', 'AI resume rewriting', 'Skill gap analysis', 'Multiple profile versions', 'Career intelligence', 'AI career assistant'], highlighted: true, buttonText: 'Start Pro' },
    { name: 'CAREER', price: '29', desc: 'For serious job seekers and career growth.', features: ['Everything in Pro', 'Advanced career insights', 'Personalized improvement roadmap', 'Advanced job analysis', 'Interview preparation', 'Priority AI assistance', 'Career progress tracking'], buttonText: 'Start Career' }
  ];

  // Background blobs animation
  const blobAnimation = {
    x: [0, 30, 0, -30, 0],
    y: [0, -40, 20, -20, 0],
    scale: [1, 1.05, 0.95, 1.02, 1],
    transition: { duration: 18, repeat: Infinity, ease: "linear" }
  };

  return (
    <section id="pricing" className="py-32 bg-[#F8FAFC] relative overflow-hidden text-slate-900 border-t border-slate-100">
      {/* Dynamic Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={blobAnimation}
          className="absolute top-[20%] left-[-5%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-[#635BFF]/10 to-[#A07CFF]/10 blur-[120px] mix-blend-multiply opacity-60"
        />
        <motion.div
          animate={{ ...blobAnimation, transition: { duration: 24, repeat: Infinity, ease: "linear" } }}
          className="absolute bottom-[10%] right-[-5%] w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-[#FF3366]/10 to-[#FF8A8A]/10 blur-[120px] mix-blend-multiply opacity-60"
        />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAwIDEwIEwgNDAgMTAgTSAxMCAwIEwgMTAgNDAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgwLDAsMCwwLjAzKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-70" />
      </div>

      <div className="max-w-[100rem] mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter text-slate-900 leading-[1.1] mb-6 drop-shadow-sm uppercase">
              SIMPLE PLANS FOR<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#635BFF] to-[#A07CFF]">EVERY CAREER STAGE.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-3xl border transition-all duration-300 flex flex-col backdrop-blur-xl ${plan.highlighted
                  ? 'border-[#635BFF]/30 bg-white/90 shadow-[0_30px_60px_rgba(99,91,255,0.15)] relative scale-105 z-10'
                  : 'border-white/80 bg-white/60 hover:bg-white/80 hover:border-slate-200 shadow-sm'
                }`}
            >
              {plan.highlighted && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#635BFF] to-[#A07CFF] text-white text-[10px] font-bold tracking-widest uppercase px-5 py-2 rounded-full shadow-md">
                  Most Popular
                </div>
              )}
              {plan.highlighted && (
                <div className="absolute inset-0 bg-gradient-to-b from-[#635BFF]/5 to-transparent pointer-events-none rounded-3xl" />
              )}
              <div className="relative z-10 flex-1 flex flex-col">
                <h3 className={`text-sm font-bold tracking-widest uppercase mb-2 ${plan.highlighted ? 'text-[#635BFF]' : 'text-slate-500'}`}>{plan.name}</h3>
                <div className="text-6xl font-bold text-slate-900 mb-4 tracking-tighter drop-shadow-sm">${plan.price}<span className="text-xl text-slate-400 font-medium tracking-normal">/mo</span></div>
                <p className="text-sm text-slate-500 mb-8 pb-8 border-b border-slate-200/60">{plan.desc}</p>

                <ul className="space-y-5 mb-12 flex-1">
                  {plan.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-slate-700 font-medium">
                      <CheckCircle2 className={`w-5 h-5 ${plan.highlighted ? 'text-[#635BFF]' : 'text-slate-400'}`} />
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => navigate(user ? '/analyze' : '/register')}
                  className={`w-full py-4 rounded-xl font-bold text-sm transition-all cursor-pointer shadow-sm ${plan.highlighted
                      ? 'bg-[#635BFF] hover:bg-[#5247ed] text-white shadow-[0_10px_20px_rgba(99,91,255,0.2)] hover:shadow-[0_15px_30px_rgba(99,91,255,0.4)]'
                      : 'bg-white border border-slate-200 text-slate-700 hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900'
                    }`}>
                  {plan.buttonText || 'Get Started'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
