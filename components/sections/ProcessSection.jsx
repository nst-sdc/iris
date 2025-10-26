export function ProcessSection() {
  const steps = [
    {
      number: "1",
      title: "Join IRIS",
      description: "Register for membership and attend our orientation to learn about club activities and opportunities"
    },
    {
      number: "2",
      title: "Learn & Build",
      description: "Participate in workshops, work on projects, and collaborate with teammates on exciting robotics challenges"
    },
    {
      number: "3",
      title: "Compete & Innovate",
      description: "Showcase your skills in competitions, hackathons, and contribute to groundbreaking robotics innovations"
    }
  ]

  return (
    <section className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Your Journey With IRIS</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            From beginner to innovator, we guide you every step of the way
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div key={index} className="text-center space-y-6">
              <div className="h-20 w-20 bg-white text-black rounded-full flex items-center justify-center mx-auto text-2xl font-bold">
                {step.number}
              </div>
              <h3 className="text-xl font-bold text-white">{step.title}</h3>
              <p className="text-gray-300">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}