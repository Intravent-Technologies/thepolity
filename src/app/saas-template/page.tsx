'use client';

import SaaSHeader from '@/components/SaaS/SaaSHeader';
import SaaSHero from '@/components/SaaS/SaaSHero';
import BentoGrid from '@/components/SaaS/BentoGrid';
import FeaturesSection from '@/components/SaaS/FeaturesSection';
import TestimonialsSection from '@/components/SaaS/TestimonialsSection';
import PricingSection from '@/components/SaaS/PricingSection';
import CTASection from '@/components/SaaS/CTASection';
import SaaSFooter from '@/components/SaaS/SaaSFooter';

export default function SaaSPage() {
  return (
    <>
      <SaaSHeader />
      <main className="w-full overflow-x-hidden bg-white dark:bg-slate-950 pt-16">
        <SaaSHero />
        <BentoGrid />
        <FeaturesSection />
        <TestimonialsSection />
        <PricingSection />
        <CTASection />
      </main>
      <SaaSFooter />
    </>
  );
}
