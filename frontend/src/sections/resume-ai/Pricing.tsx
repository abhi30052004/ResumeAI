import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function Pricing() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const plans = [
    { name: 'FREE', price: '0', desc: 'Basic AI resume analysis.', features: ['1 Resume Scan', 'Overall Score', 'Basic Suggestions'] },
    { name: 'PRO', price: '12', desc: 'Advanced AI optimization.', features: ['Unlimited Scans', 'AI Bullet Rewrite', 'Job Matching', 'ATS Simulator'], highlighted: true },
    { name: 'CAREER', price: '29', desc: 'Full career intelligence.', features: ['Everything in Pro', 'Cover Letter Gen', 'Career Chatbot', 'Interview Prep'] }
  ];

  return (
    <section id="pricing" className="py-32 bg-[#FFFFFF]">
      <div className="max-w-[100rem] mx-auto px-6 lg:px-12">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter text-[#111111] mb-6">Simple Pricing.</h2>
          <p className="text-lg text-[#666666]">Invest in your career. Upgrade anytime.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan) => (
            <motion.div 
              key={plan.name}
              whileHover={{ y: -10 }}
              className={`p-10 rounded-3xl border transition-all duration-300 flex flex-col ${
                plan.highlighted 
                  ? 'border-[#635BFF] bg-[#F7F7F2] shadow-xl relative' 
                  : 'border-[#E5E5DE] bg-white hover:border-[#111111]'
              }`}
            >
              {plan.highlighted && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[#635BFF] text-white text-[10px] font-bold tracking-widest uppercase px-4 py-1 rounded-full">
                  Most Popular
                </div>
              )}
              <h3 className="text-sm font-bold tracking-widest uppercase text-[#111111] mb-2">{plan.name}</h3>
              <div className="text-5xl font-bold text-[#111111] mb-4">${plan.price}<span className="text-lg text-[#666666] font-normal">/mo</span></div>
              <p className="text-sm text-[#666666] mb-8 pb-8 border-b border-[#E5E5DE]">{plan.desc}</p>
              
              <ul className="space-y-4 mb-12 flex-1">
                {plan.features.map(f => (
                  <li key={f} className="flex items-center gap-3 text-sm text-[#111111] font-medium">
                    <svg className="w-4 h-4 text-[#635BFF]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                    {f}
                  </li>
                ))}
              </ul>

              <button 
                onClick={() => navigate(user ? '/analyze' : '/register')}
                className={`w-full py-4 rounded-full font-bold text-sm transition-colors cursor-pointer ${
                plan.highlighted ? 'bg-[#111111] text-white hover:bg-[#635BFF]' : 'bg-white border border-[#E5E5DE] text-[#111111] hover:border-[#111111]'
              }`}>
                Get Started
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
