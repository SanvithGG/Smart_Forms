import { useState } from 'react';
import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { LiveDemo } from "@/components/landing/LiveDemo";
import { AISection } from "@/components/landing/AISection";
import { AnalyticsSection } from "@/components/landing/AnalyticsSection";
import { Footer } from "@/components/landing/Footer";
import { PromptModal } from "@/components/landing/PromptModal";
import { RouteLine } from "@/components/ui/route-line";
export function LandingPage({ onStartSurvey, onOpenEditor }) {
    const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
    const handleOpenPromptModal = () => {
        setIsPromptModalOpen(true);
    };
    return (<div className="min-h-screen bg-background text-foreground">
      <Navbar onStartSurvey={handleOpenPromptModal} onOpenEditor={() => onOpenEditor()}/>
      <main>
        <HeroSection onStartSurvey={onStartSurvey} onOpenEditor={handleOpenPromptModal}/>

        {/* Route-line divider */}
        <div className="mx-auto max-w-6xl px-6">
          <RouteLine direction="horizontal" nodes={3} className="py-1"/>
        </div>

        <FeaturesSection />

        <div className="mx-auto max-w-6xl px-6">
          <RouteLine direction="horizontal" nodes={3} className="py-1"/>
        </div>

        <LiveDemo />

        <div className="mx-auto max-w-6xl px-6">
          <RouteLine direction="horizontal" nodes={2} className="py-1"/>
        </div>

        <AISection />

        <div className="mx-auto max-w-6xl px-6">
          <RouteLine direction="horizontal" nodes={3} className="py-1"/>
        </div>

        <AnalyticsSection />

        <PromptModal isOpen={isPromptModalOpen} onClose={() => setIsPromptModalOpen(false)} onGenerateAndOpenEditor={(generatedForm) => onOpenEditor(generatedForm)}/>
      </main>
      <Footer onStartSurvey={onStartSurvey}/>
    </div>);
}
