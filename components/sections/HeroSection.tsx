import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Spotlight } from "@/components/ui/spotlight"
import { SplineScene } from "@/components/ui/spline-scene"
import { Cpu, Users, Zap, ArrowRight } from "lucide-react"

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">

      <div className="absolute inset-0 bg-linear-to-br from-blue-950/20 via-black to-blue-900/10"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-blue-600/20 via-transparent to-transparent"></div>
      
      <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.05)_1px,transparent_1px)] bg-size-[50px_50px]"></div>

      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover opacity-30"
        >
          <source src="https://www.pexels.com/download/video/2297636/" type="video/mp4" />
        </video>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <Card className="w-full bg-black/90 backdrop-blur-xl relative overflow-hidden border border-blue-500/20 shadow-2xl shadow-blue-500/10">
          <Spotlight className="-top-40 left-0 md:left-60 md:-top-20 text-blue-500" />

          <div className="absolute -top-40 -left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-40 -right-20 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl"></div>

          <div className="flex flex-col lg:flex-row h-full min-h-[600px]">
            
            <div className="flex-1 p-8 lg:p-12 relative z-10 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 border border-blue-500/30 rounded-full text-blue-400 text-sm font-medium mb-6 w-fit">
                <Cpu className="h-4 w-4" />
                <span>Innovation • Robotics • Intelligence</span>
              </div>

              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                <span className="bg-linear-to-r from-white via-blue-100 to-blue-400 bg-clip-text text-transparent">
                  IRIS
                </span>
                <br />
                <span className="text-3xl md:text-4xl lg:text-5xl text-blue-200">
                  Robotics Club
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-neutral-300 max-w-2xl leading-relaxed">
                Building the future through innovation in robotics, automation, and intelligent systems. 
                Join a community of engineers, creators, and visionaries pushing the boundaries of technology.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 mt-10">
                <Button size="lg" className="bg-linear-to-r from-blue-600 to-blue-500 text-white hover:from-blue-500 hover:to-blue-400 shadow-lg shadow-blue-500/50 border-0">
                  Join IRIS Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-blue-500/50 text-blue-300 hover:bg-blue-950/50 hover:border-blue-400 bg-transparent backdrop-blur-sm"
                >
                  View Projects
                </Button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12 pt-8 border-t border-blue-500/20">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Users className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">150+</div>
                    <div className="text-sm text-neutral-400">Active Members</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Cpu className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-neutral-400">Projects Built</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-blue-500/10 rounded-lg">
                    <Zap className="h-5 w-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">24/7</div>
                    <div className="text-sm text-neutral-400">Innovation Lab</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex-1 relative min-h-[400px] lg:min-h-0 -mr-12 lg:-mr-16">
              <div className="absolute inset-0 scale-180 origin-bottom translate-y-150 lg:translate-y-130">
                <SplineScene
                  scene="https://prod.spline.design/UbM7F-HZcyTbZ4y3/scene.splinecode"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  )
}