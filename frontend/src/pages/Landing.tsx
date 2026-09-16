import React, { useState } from 'react';
import { CustomCursor } from '../components/portfolio/CustomCursor';
import { ScrollProgress } from '../components/portfolio/ScrollProgress';
import { Preloader } from '../components/resume-ai/Preloader';

import { Navbar } from '../components/resume-ai/Navbar';
import { Hero } from '../sections/resume-ai/Hero';
import { FeaturesBento } from '../sections/resume-ai/FeaturesBento';
import { Workflow } from '../sections/resume-ai/Workflow';
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
        <Hero />
        <FeaturesBento />
        <Workflow />
        <CTA />
      </main>
    </div>
  );
}
