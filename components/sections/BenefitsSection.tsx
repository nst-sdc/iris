import { Clock, DollarSign, BarChart3, TrendingUp } from "lucide-react"

export function BenefitsSection() {
  const benefits = [
    {
      icon: Clock,
      value: "50+",
      description: "Hours of Hands-on Robotics Training",
      bgColor: "bg-green-900/40",
      iconColor: "text-green-400"
    },
    {
      icon: DollarSign,
      value: "15+",
      description: "Competitions & Hackathons Annually",
      bgColor: "bg-blue-900/40",
      iconColor: "text-blue-400"
    },
    {
      icon: BarChart3,
      value: "200+",
      description: "Active Members Building the Future",
      bgColor: "bg-purple-900/40",
      iconColor: "text-purple-400"
    },
    {
      icon: TrendingUp,
      value: "100%",
      description: "Project-Based Learning Experience",
      bgColor: "bg-orange-900/40",
      iconColor: "text-orange-400"
    }
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Why Join IRIS?</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Be part of a community that transforms ideas into reality
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon
            return (
              <div key={index} className="text-center space-y-4">
                <div className={`h-16 w-16 ${benefit.bgColor} rounded-full flex items-center justify-center mx-auto`}>
                  <Icon className={`h-8 w-8 ${benefit.iconColor}`} />
                </div>
                <h3 className="text-2xl font-bold text-white">{benefit.value}</h3>
                <p className="text-gray-300">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}