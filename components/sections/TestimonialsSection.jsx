import { Card, CardContent } from "@/components/ui/card"

export function TestimonialsSection() {
  const testimonials = [
    {
      rating: 5,
      text: "IRIS gave me the perfect platform to explore robotics. The workshops and mentorship helped me win my first national competition. The hands-on experience is incredible!",
      name: "Himanshu",
      title: "First Year, CS"
    },
    {
      rating: 5,
      text: "Being part of IRIS transformed my college experience. I learned Arduino, built autonomous robots, and even secured an internship through club connections. Best decision ever!",
      name: "Abhiman",
      title: "First Year, CS"
    },
    {
      rating: 5,
      text: "The collaborative environment at IRIS is amazing. Working on real projects with passionate teammates taught me more than any textbook. It's where theory meets practice!",
      name: "Mridul",
      title: "First Year, CS"
    }
  ]

  return (
    <section id="testimonials" className="py-24 bg-black">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white">Hear From Our Members</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-black/80 backdrop-blur-sm border-white/10">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex text-yellow-400">{"★".repeat(testimonial.rating)}</div>
                  <p className="text-gray-300">{testimonial.text}</p>
                  <div>
                    <p className="font-semibold text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-400">{testimonial.title}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}