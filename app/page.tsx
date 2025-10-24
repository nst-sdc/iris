import { Navbar }  from "@/components/navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { CTASection } from "@/components/sections/CTASection"
import { Footer } from "@/components/sections/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black">
      <Navbar />
      <HeroSection />
      <ProblemSolutionSection />
      <ServicesSection />
      <TestimonialsSection />
      <BenefitsSection />
      <ProcessSection />
      <CTASection />
      <Footer />
    </div>
  )
}