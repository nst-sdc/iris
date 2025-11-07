import { Mail, Phone, MapPin, Linkedin, Twitter, Instagram, ArrowRight, Target } from "lucide-react"

export function Footer() {
  const services = [
    "Robotics Workshops",
    "Technical Projects",
    "Competitions & Hackathons",
    "Industry Collaborations",
    "Skill Development",
  ]

  const companyLinks = [
    { name: "About Us", href: "#" },
    { name: "Projects", href: "#testimonials" },
    { name: "Events", href: "#" },
    { name: "Team", href: "#" },
    { name: "Contact", href: "#contact" },
  ]

  const socialLinks = [
    { icon: Linkedin, href: "https://www.linkedin.com/in/iris-the-robotics-club/" },
    { icon: Twitter, href: "#" },
    { icon: Instagram, href: "https://www.instagram.com/iris.nstpune/" },
  ]

  return (
    <footer id="contact" className="relative py-20 bg-black border-t border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-t from-black via-black/95 to-black/90" />

      <div className="relative z-10 container mx-auto px-4">
        <div className="grid lg:grid-cols-4 md:grid-cols-2 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <div className="space-y-4">
              <h3 className="text-2xl font-bold text-white">Iris</h3>
              <p className="text-gray-300 leading-relaxed">
                Robotics club NST, ADYPU
              </p>
            </div>

            <div className="flex space-x-4">
              {socialLinks.map((social, index) => {
                const Icon = social.icon
                return (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Explore</h4>
            <ul className="space-y-3">
              {services.map((service) => (
                <li key={service}>
                  <a
                    href="#services"
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Company</h4>
            <ul className="space-y-3">
              {companyLinks.map((item) => (
                <li key={item.name}>
                  <a
                    href={item.href}
                    className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center group"
                  >
                    <ArrowRight className="h-3 w-3 mr-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-lg font-semibold text-white">Get in Touch</h4>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                  <Mail className="h-4 w-4" />
                </div>
                <a href="mailto:hello@aiagency.com" className="hover:text-white transition-colors duration-300">
                  hello@newtonschool.co
                </a>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                  <Phone className="h-4 w-4" />
                </div>
                <a href="tel:+15551234567" className="hover:text-white transition-colors duration-300">
                  (+91) 12345-67890
                </a>
              </div>

              <div className="flex items-center space-x-3 text-gray-300">
                <div className="p-2 bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg">
                  <MapPin className="h-4 w-4" />
                </div>
                <a href="https://maps.app.goo.gl/df92BfVHGdBgXRKo7" target="_blank">NST, ADYPU</a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-16 pt-8">
          <div className="flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0">
            <p className="text-gray-400 text-center lg:text-left">Made by NST-SDC ❤️</p>

            <div className="flex flex-wrap justify-center lg:justify-end space-x-8">
              <a href="/about" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                About Us
              </a>
              <a href="/conatct" className="text-gray-400 hover:text-white transition-colors duration-300 text-sm">
                Conatct Us
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}