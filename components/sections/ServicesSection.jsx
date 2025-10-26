import { BentoGrid, BentoCard } from "@/components/ui/bento-grid"
import { Bot, Workflow, Brain, MessageSquare, Cog } from "lucide-react"

export function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">What We Offer</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Comprehensive programs designed to transform students into robotics innovators
          </p>
        </div>

        <BentoGrid className="lg:grid-rows-3">
          <BentoCard
            name="Robotics Workshops"
            className="lg:row-start-1 lg:row-end-4 lg:col-start-2 lg:col-end-3"
            background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
            Icon={Bot}
            description="Hands-on training sessions covering Arduino, Raspberry Pi, sensors, actuators, and advanced robotics systems from basics to competition-level skills."
            href="#"
            cta="Learn more"
          />
          <BentoCard
            name="Project Development"
            className="lg:col-start-1 lg:col-end-2 lg:row-start-1 lg:row-end-3"
            background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
            Icon={Workflow}
            description="Work on real-world robotics projects including autonomous robots, IoT systems, and innovative prototypes with guidance from experienced mentors."
            href="#"
            cta="Learn more"
          />
          <BentoCard
            name="Competitions & Events"
            className="lg:col-start-1 lg:col-end-2 lg:row-start-3 lg:row-end-4"
            background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
            Icon={Cog}
            description="Participate in national robotics competitions, hackathons, and tech fests to showcase your skills and compete with the best."
            href="#"
            cta="Learn more"
          />
          <BentoCard
            name="Skill Development"
            className="lg:col-start-3 lg:col-end-3 lg:row-start-1 lg:row-end-2"
            background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
            Icon={Brain}
            description="Build expertise in programming, CAD design, electronics, AI/ML integration, and problem-solving through structured learning paths."
            href="#"
            cta="Learn more"
          />
          <BentoCard
            name="Industry Collaboration"
            className="lg:col-start-3 lg:col-end-3 lg:row-start-2 lg:row-end-4"
            background={<div className="absolute inset-0 bg-black/80 backdrop-blur-sm border border-white/10" />}
            Icon={MessageSquare}
            description="Connect with industry experts, attend guest lectures, and gain insights into career opportunities in robotics and automation fields."
            href="#"
            cta="Learn more"
          />
        </BentoGrid>
      </div>
    </section>
  )
}