import { Header } from "@/components/client/Header";
import { Hero } from "@/components/client/Hero";
import { FeaturesSection } from "@/components/client/FeaturesSection";
import { SolutionSection } from "@/components/client/SolutionSection";
import { Testimonials } from "@/components/client/Testimonials";
import { FAQSection } from "@/components/client/FAQSection";
import { CtaSection } from "@/components/client/CtaSection";
import { LatestNewsSection } from "@/components/client/LatestNewsSection";
import { ContactForm } from "@/components/client/ContactForm";
import { Footer } from "@/components/client/Footer";

const Index = () => {
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      <Header />
      <Hero />
      <main className="adara-ambient">
        <FeaturesSection />
        <SolutionSection />
        <Testimonials />
        <FAQSection />
        <CtaSection />
        <LatestNewsSection />
        <ContactForm />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
