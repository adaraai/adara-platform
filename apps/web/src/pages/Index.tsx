import { useEffect } from "react";
import { Header } from "@/components/client/Header";
import { Hero } from "@/components/client/Hero";
import { FeaturesSection } from "@/components/client/FeaturesSection";
import { MissionSection } from "@/components/client/MissionSection";
import { ApproachSection } from "@/components/client/ApproachSection";
import { AudienceSection } from "@/components/client/AudienceSection";
import { TrustSection } from "@/components/client/TrustSection";
import { LatestNewsSection } from "@/components/client/LatestNewsSection";
import { ContactForm } from "@/components/client/ContactForm";
import { TeaserSection } from "@/components/client/TeaserSection";
import { Footer } from "@/components/client/Footer";
import { useSeo } from "@/lib/seo";

const Index = () => {
  useSeo({ path: "/" });

  useEffect(() => {
    const root = document.documentElement;
    const wasDark = root.classList.contains("dark");
    root.classList.remove("dark");
    return () => {
      if (wasDark) root.classList.add("dark");
    };
  }, []);

  return (
    <div className="min-h-screen overflow-x-clip bg-[#0B0F0D]">
      <Header variant="home" />
      <Hero />
      <main className="hero-geo">
        <FeaturesSection />
        <MissionSection />
        <ApproachSection />
        <AudienceSection />
        <TrustSection />
        <LatestNewsSection />
        <ContactForm />
        <TeaserSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
