import React, { useState } from 'react';
import { CustomCursor } from '../components/portfolio/CustomCursor';
import { ScrollProgress } from '../components/portfolio/ScrollProgress';
import { Preloader } from '../components/resume-ai/Preloader';

// Resume AI Components
import { Navbar } from '../components/resume-ai/Navbar';
import { Hero } from '../sections/resume-ai/Hero';
import { AIAnalysis } from '../sections/resume-ai/AIAnalysis';
import { ResumeTransformation } from '../sections/resume-ai/ResumeTransformation';
import { JobMatching } from '../sections/resume-ai/JobMatching';
import { FeaturesBento } from '../sections/resume-ai/FeaturesBento';
import { ProfileEvolves } from '../sections/resume-ai/ProfileEvolves';
import { RecruitersView } from '../sections/resume-ai/RecruitersView';
import { CareerData } from '../sections/resume-ai/CareerData';
import { CareerFlow } from '../sections/resume-ai/CareerFlow';
import { Privacy } from '../sections/resume-ai/Privacy';
import { Pricing } from '../sections/resume-ai/Pricing';
import { CTA } from '../sections/resume-ai/CTA';

export function Landing() {
  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="bg-[#FFFFFF] min-h-screen text-[#111111] font-sans selection:bg-[#635BFF]/30 font-light overflow-hidden">
      {/* Preloader */}
      {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}

      {/* Global */}
      <ScrollProgress />
      <CustomCursor />
      <Navbar />
      
      <main>
        {/* Product Journey */}
        <Hero />
        <AIAnalysis />
        <ResumeTransformation />
        <JobMatching />
        
        {/* Supporting Content */}
        <FeaturesBento />
        
        {/* ProfileIQ Expanded Content */}
        <ProfileEvolves />
        <RecruitersView />
        <CareerData />
        <CareerFlow />
        <Privacy />

        <Pricing />
        
        {/* Conclusion */}
        <CTA />
      </main>
    </div>
  );
}
