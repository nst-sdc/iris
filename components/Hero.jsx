import { useRef } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

export function HeroSection() {
  const container = useRef(null);
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end start']
  });

  const { scrollYProgress: sectionProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start']
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0vh", "-150vh"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const sectionY = useTransform(sectionProgress, [0, 1], ["-10%", "10%"]);

  return (
    <>
      {/* Intro Section */}
      <div ref={container} className="h-screen overflow-hidden">
        <div className="relative h-full">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source src="https://www.pexels.com/download/video/2297636/" type="video/mp4" />
          </video>
          
          <div className="absolute inset-0 bg-black/30" />
          
          <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight">
              Robotics Club
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-light">
              Under Construction Hero Section 
            </p>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="flex justify-center py-32 px-6 bg-white">
        <p className="text-4xl md:text-6xl lg:text-7xl text-gray-900 text-center max-w-5xl leading-tight font-light">
          We build intelligent systems that push the boundaries of innovation and technology
        </p>
      </div>

      {/* Parallax Section */}
      <div
        ref={sectionRef}
        className="relative flex items-center justify-center h-screen overflow-hidden"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <div className="relative z-10 p-8 md:p-20 text-white w-full h-full flex flex-col justify-between">
          <p className="w-full md:w-2/3 lg:w-1/2 text-lg md:text-2xl self-end text-right mix-blend-difference font-light leading-relaxed">
            Through hands-on projects and collaborative learning, we transform ideas into reality
          </p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-light mix-blend-difference">
            Innovation Lab
          </h2>
        </div>
        
        <div className="fixed top-[-10vh] left-0 h-[120vh] w-full">
          <motion.div style={{ y: sectionY }} className="relative w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
            >
              <source src="https://www.pexels.com/download/video/8328042/" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black/20" />
          </motion.div>
        </div>
      </div>

      {/* Info Section */}
      <div className="bg-gray-50 py-24 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-16">
          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Research</h3>
            <p className="text-gray-600 leading-relaxed">
              Exploring cutting-edge developments in artificial intelligence, machine learning, and autonomous systems
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Development</h3>
            <p className="text-gray-600 leading-relaxed">
              Creating practical solutions through prototyping, testing, and iterative design processes
            </p>
          </div>

          <div>
            <h3 className="text-2xl font-semibold text-gray-900 mb-4">Competition</h3>
            <p className="text-gray-600 leading-relaxed">
              Participating in national and international robotics competitions to challenge our capabilities
            </p>
          </div>
        </div>
      </div>
    </>
  );
}