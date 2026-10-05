import { Navbar } from '@/components/sections/Navbar';
import { Hero } from '@/components/sections/Hero';
import { SocialProof } from '@/components/sections/SocialProof';
import { ProblemSection } from '@/components/sections/ProblemSection';
import { TransformationSection } from '@/components/sections/TransformationSection';
import { SkillsSection } from '@/components/sections/SkillsSection';
import { ToolsSection } from '@/components/sections/ToolsSection';
import { Curriculum } from '@/components/sections/Curriculum';
import { Projects } from '@/components/sections/Projects';
import { FreelanceRoadmap } from '@/components/sections/FreelanceRoadmap';
import { PortfolioPreview } from '@/components/sections/PortfolioPreview';
import { AIWorkflow } from '@/components/sections/AIWorkflow';
import { ClientAcquisition } from '@/components/sections/ClientAcquisition';
import { ServicePackages } from '@/components/sections/ServicePackages';
import { Bonuses } from '@/components/sections/Bonuses';
import { AudienceSection } from '@/components/sections/AudienceSection';
import { Testimonials } from '@/components/sections/Testimonials';
import { Pricing } from '@/components/sections/Pricing';
import { ValueStack } from '@/components/sections/ValueStack';
import { Guarantee } from '@/components/sections/Guarantee';
import { FAQ } from '@/components/sections/FAQ';
import { FinalCTA } from '@/components/sections/FinalCTA';
import { Footer } from '@/components/sections/Footer';
import { StickyMobileCTA } from '@/components/sections/StickyMobileCTA';
import { DesktopFloatingCTA } from '@/components/sections/DesktopFloatingCTA';
import { CheckoutPlaceholder } from '@/components/sections/CheckoutPlaceholder';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <SocialProof />
        <ProblemSection />
        <TransformationSection />
        <SkillsSection />
        <ToolsSection />
        <Curriculum />
        <Projects />
        <FreelanceRoadmap />
        <PortfolioPreview />
        <AIWorkflow />
        <ClientAcquisition />
        <ServicePackages />
        <Bonuses />
        <AudienceSection />
        <Testimonials />
        <Pricing />
        <ValueStack />
        <Guarantee />
        <FAQ />
        <FinalCTA />
      </main>
      <Footer />
      <StickyMobileCTA />
      <DesktopFloatingCTA />
      <CheckoutPlaceholder />
    </>
  );
}
