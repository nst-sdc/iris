'use client'
import { useEffect } from "react"
import Lenis from 'lenis'
import { Navbar }  from "@/components/Navbar"
import { HeroSection } from "@/components/Hero"
// import { HeroSection } from "@/components/sections/HeroSection"
import { ProblemSolutionSection } from "@/components/sections/ProblemSolutionSection"
import { ServicesSection } from "@/components/sections/ServicesSection"
import { TestimonialsSection } from "@/components/sections/TestimonialsSection"
import { BenefitsSection } from "@/components/sections/BenefitsSection"
import { ProcessSection } from "@/components/sections/ProcessSection"
import { CTASection } from "@/components/sections/CTASection"
import { Footer } from "@/components/sections/Footer"

export default function HomePage() {
  useEffect( () => {
    const lenis = new Lenis()

    function raf(time) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    requestAnimationFrame(raf)
  }, [])
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

