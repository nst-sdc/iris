import { Button } from "@/components/ui/button"
import AnimatedGradientBackground from "@/components/ui/animated-gradient-background"
import { SparklesCore } from "@/components/ui/sparkles"
import { ArrowRight } from "lucide-react"

export function CTASection() {
  return (
    <section className="relative py-24 overflow-hidden">
      <AnimatedGradientBackground
        Breathing={true}
        gradientColors={["#0A0A0A", "#2979FF", "#FF80AB", "#FF6D00", "#FFD600", "#00E676", "#3D5AFE"]}
        gradientStops={[35, 50, 60, 70, 80, 90, 100]}
      />
      <div className="relative z-10 container mx-auto px-4 text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <div className="relative h-32 w-full flex flex-col items-center justify-center">
            <div className="w-full absolute inset-0">
              <SparklesCore
                id="ctasparticles"
                background="transparent"
                minSize={0.6}
                maxSize={1.4}
                particleDensity={100}
                className="w-full h-full"
                particleColor="#FFFFFF"
                speed={0.8}
              />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-center bg-clip-text text-transparent bg-linear-to-b from-neutral-50 to-neutral-400 relative z-20 text-balance">
              Ready to build the future with us?
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="bg-white text-black hover:bg-gray-100">
              Join IRIS Today
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 bg-transparent">
              Contact Us
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}