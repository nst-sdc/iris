'use client'
import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, Rocket, Cpu, Lightbulb, Award, Linkedin } from 'lucide-react'
import { motion } from "motion/react"
import { Navbar } from '@/components/Navbar'

export default function AboutUs() {
  const founders = [
    {
      name: 'Vansh Agarwal',
      role: 'PRESIDENT',
      quote: 'Leading innovation and collaboration at IRIS Robotics.',
      image: '/membersimg/vansh.jpg',
      linkedin: 'https://www.linkedin.com/in/vansh-agarwal-0413j/',
    },
    {
      name: 'Deeptanu Bhunia',
      role: 'VICE PRESIDENT',
      quote: 'Driving excellence and teamwork in every project.',
      image: '/membersimg/deeptanu.jpg',
      linkedin: 'https://www.linkedin.com/in/deeptanu-bhunia-184426297/',
    },
    {
      name: 'Suvendu Kumar Sahoo',
      role: 'CORE MEMBER',
      quote: 'Building innovative solutions with passion for robotics.',
      image: '/membersimg/suvendu.jpg',
      linkedin: 'https://www.linkedin.com/in/suvendu-kumar-sahoo-4566b3324/',
    },
    {
      name: 'Hemant',
      role: 'CORE MEMBER',
      quote: 'Exploring the boundaries of technology and automation.',
      image: '/membersimg/hemant.jpg',
      linkedin: 'https://www.linkedin.com/in/hemant9610/',
    },
    {
      name: 'Tanubhav Katiyar',
      role: 'CORE MEMBER',
      quote: 'Transforming creative ideas into technical brilliance.',
      image: '/membersimg/tanubhav.jpg',
      linkedin: 'https://www.linkedin.com/in/tanubhav-katiyar-419b0533b/',
    },
    {
      name: 'Saad Arqam',
      role: 'CORE MEMBER',
      quote: 'Innovating smarter and more efficient robotic systems.',
      image: '/membersimg/saad.jpg',
      linkedin: 'https://www.linkedin.com/in/avgchillguy/',
    },
    {
      name: 'Mehbub Alom',
      role: 'CORE MEMBER',
      quote: 'Turning challenges into opportunities through technology.',
      image: '/membersimg/mehbub.jpg',
      linkedin: 'https://www.linkedin.com/in/mehebub-alom-649537312/',
    },
    {
      name: 'Priyabrata Singh',
      role: 'CORE MEMBER',
      quote: 'Dedicated to shaping the future of robotics and AI.',
      image: '/membersimg/priyabrata.jpg',
      linkedin: 'https://www.linkedin.com/in/avgnststudent/',
    },
    {
      name: 'Harsh Hirawat',
      role: 'CORE MEMBER',
      quote: 'Bringing ideas to life through engineering and teamwork.',
      image: '/membersimg/harsh.jpg',
      linkedin: 'https://www.linkedin.com/in/harsh-hirawat-b657061b7/',
    },
    {
      name: 'Mahek',
      role: 'CORE MEMBER',
      quote: 'Passionate about innovation and creative engineering.',
      image: '/membersimg/mahek.jpg',
      linkedin: '#',
    }    

  ]

  const stats = [
    { icon: <Users className="w-6 h-6 text-blue-400" />, label: 'Active Members', value: '100+' },
    { icon: <Rocket className="w-6 h-6 text-purple-400" />, label: 'Projects Built', value: '10+' },
    { icon: <Lightbulb className="w-6 h-6 text-yellow-400" />, label: 'Innovations Patented', value: '0' },
    { icon: <Award className="w-6 h-6 text-green-400" />, label: 'National Awards', value: '0' },
  ]

  const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: i * 0.15,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
}

// Tilt + fade animation for each image
const imageVariants = {
  hidden: { opacity: 0, y: 60, rotate: -5 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.8,
      delay: i * 0.15,
      type: 'spring',
      stiffness: 80,
    },
  }),
}

const photos = [
    '/event/event1.png',
    '/event/event2.png',
    '/event/event3.png',
    '/event/event4.jpg',
    '/event/event5.png',
    '/event/event6.jpg',
  ]

  return (
    <>
    <Navbar />
    <div className="min-h-screen bg-black text-zinc-100 px-6 md:px-16 py-16 font-inter scroll-smooth mt-10">
      {/* Hero Section */}
      <section className="text-center max-w-3xl mx-auto mb-24">
        <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">
          About IRIS Robotics Club
        </h1>
        <p className="mt-5 text-zinc-400 text-lg leading-relaxed">
          Where creativity meets circuitry. IRIS Robotics Club is a community of innovators and dreamers 
          building the future of automation, robotics, and artificial intelligence.
        </p>
        <div className="w-32 h-[2px] mx-auto mt-6 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full animate-pulse" />
      </section>

      {/* Mission & Vision */}
      <section className="grid md:grid-cols-2 gap-10 mb-24">
        <Card className="bg-zinc-900 border border-zinc-800 hover:border-blue-500/40 transition-all duration-200 shadow-md hover:shadow-blue-500/10">
          <CardHeader>
            <CardTitle className="text-blue-400">Our Mission</CardTitle>
            <CardDescription className="text-zinc-400">
              Empowering innovators to design a smarter world through robotics and AI.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-zinc-300">
            We believe in hands-on learning and open collaboration. Members at IRIS work on projects 
            that not only push boundaries but also create real-world solutions.
          </CardContent>
        </Card>

        <Card className="bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 transition-all duration-200 shadow-md hover:shadow-purple-500/10">
          <CardHeader>
            <CardTitle className="text-purple-400">Our Vision</CardTitle>
            <CardDescription className="text-zinc-400">
              Building a generation that blends creativity with technology.
            </CardDescription>
          </CardHeader>
          <CardContent className="text-zinc-300">
            Our vision is to make robotics accessible and inspiring for everyone—bridging imagination 
            and innovation to transform ideas into intelligent systems.
          </CardContent>
        </Card>
      </section>

      {/* Founding Members */}
      <section className="mb-24">
        <h2 className="text-3xl font-semibold text-center mb-12">Founding Members</h2>
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-8">
          {founders.map((f, i) => (
            <motion.div
          custom={i}
          variants={fadeUp}
          initial="hidden"
          animate="visible"
          className="group bg-zinc-900 border border-zinc-800 rounded-xl p-6 text-center hover:border-blue-500/40 hover:shadow-lg hover:shadow-blue-500/10 cursor-pointer transition-all duration-300"
      >
              {/* <div className="relative w-28 h-28 mx-auto mb-4 rounded-full overflow-hidden border-2 border-zinc-700 group-hover:border-blue-500 transition-all duration-300">
                <img
                  src={f.image}
                  alt={f.name}
                  className="object-cover w-full h-full group-hover:scale-110 transition-transform duration-300"
                />
              </div> */}
              <h3 className="text-lg font-semibold text-white">{f.name}</h3>
              <p className="text-sm text-blue-400">{f.role}</p>
              <p className="text-zinc-400 mt-3 italic text-sm leading-snug">“{f.quote}”</p>

              {/* LinkedIn Icon */}
              <div className="mt-4 flex justify-center">
                <a
                  href={f.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-400 hover:text-blue-500 transition-colors duration-200"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section className="mb-24 text-center">
        <h2 className="text-3xl font-semibold mb-12">Our Achievements</h2>
        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center bg-zinc-900 border border-zinc-800 hover:border-purple-500/40 p-6 rounded-xl shadow-md hover:shadow-purple-500/10 transition-all duration-300"
            >
              {s.icon}
              <h3 className="mt-4 text-3xl font-bold">{s.value}</h3>
              <p className="text-zinc-400">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Innovation */}
      <section className="text-center max-w-3xl mx-auto mb-24">
        <h2 className="text-3xl font-semibold mb-6">Innovative Approach</h2>
        <p className="text-zinc-400 text-lg leading-relaxed">
          IRIS Robotics Club thrives on innovation that merges human creativity with machine precision.  
          From humanoid designs to sustainable robotics, we focus on meaningful, impactful, and futuristic 
          tech. Every project carries our DNA of curiosity, collaboration, and compassion.
        </p>
      </section>

      {/* CTA */}
    <section className="py-16 bg-zinc-950 text-center relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-white mb-10">Our Journey in Frames</h2>
        <p className="text-zinc-400 mb-12 text-lg">
          A glimpse into our story — innovation, teamwork, and unforgettable moments that shaped us.
        </p>

        {/* Image Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center">
          {photos.map((src, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={imageVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              className="relative group"
            >
              <Card className="overflow-hidden bg-zinc-900 border border-zinc-800 rounded-2xl shadow-md hover:shadow-blue-500/20 transition-all duration-300 cursor-pointer transform group-hover:-rotate-2 group-hover:scale-[1.03]">
                <CardContent className="p-0">
                  <motion.img
                    src={src}
                    alt={`Event ${i + 1}`}
                    className="object-cover w-full h-64 rounded-2xl"
                    whileHover={{ scale: 1.08, rotate: 2 }}
                    transition={{ type: 'spring', stiffness: 100 }}
                  />
                </CardContent>
              </Card>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileHover={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute bottom-4 left-0 right-0 text-white text-sm opacity-0 group-hover:opacity-100"
              >
                <p className="bg-zinc-900/80 py-1 px-3 rounded-full inline-block">
                  Event {i + 1}
                </p>
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
    </div>
        </>
  )
}
