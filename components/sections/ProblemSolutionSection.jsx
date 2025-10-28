import { CheckCircle } from "lucide-react"

export function ProblemSolutionSection() {
  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="space-y-6">
            <h2 className="text-3xl md:text-4xl font-bold text-white">Feeling Lost in Your Tech Journey?</h2>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                Learning robotics alone without proper guidance or community
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                Missing out on hands-on experience with real robotics projects
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                No access to advanced equipment and industry-standard tools
              </p>
              <p className="flex items-start gap-3">
                <span className="text-red-500 mt-1">✗</span>
                Limited opportunities to showcase skills through competitions
              </p>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">We Empower Innovators Like You</h3>
            <div className="space-y-4 text-gray-300">
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                Expert-led workshops covering fundamentals to advanced robotics
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                Access to cutting-edge robotics kits and fabrication facilities
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                Collaborative environment with passionate peers and mentors
              </p>
              <p className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 shrink-0" />
                Regular competitions, hackathons, and industry connections
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}