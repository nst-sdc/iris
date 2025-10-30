'use client'
import React, { useState } from "react"


const AnimatedNavLink = ({ href, children }) => {
  const [isHovered, setIsHovered] = useState(false)
  
  return (
    <a 
      href={href} 
      className="relative inline-block text-sm font-medium"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span className={`transition-colors duration-300 ${isHovered ? 'text-white' : 'text-gray-300'}`}>
        {children}
      </span>
      <span 
        className={`absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-blue-400 to-purple-500 transition-all duration-300 ease-out ${
          isHovered ? 'w-full' : 'w-0'
        }`}
      ></span>
    </a>
  )
}

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

    const logoElement = (
    <div className="flex items-center gap-2 shrink-0">
      <img 
        src="/logo.jpeg" 
        alt="Logo" 
        className="w-8 h-8 object-contain"
      />
      <span className="text-xl font-bold text-white">IRIS</span>
    </div>
  )

  const navLinksData = [
    { label: "Projects", href: "#" },
    { label: "Participation", href: "#" },
    { label: "Blogs", href: "/Blogs" },
  ]

  const loginButtonElement = (
    <button className="px-5 py-2 text-sm font-medium border border-gray-700 bg-gray-800 bg-opacity-60 text-gray-300 rounded-full hover:border-gray-500 hover:text-white hover:bg-opacity-80 transition-all duration-200 w-full sm:w-auto whitespace-nowrap">
      Explore
    </button>
  )

  const signupButtonElement = (
    <div className="relative group w-full sm:w-auto">
      <div
        className="absolute inset-0 -m-2 rounded-full
                     hidden sm:block
                     bg-linear-to-r from-blue-400 to-purple-500
                     opacity-40 blur-lg pointer-events-none
                     transition-all duration-300 ease-out
                     group-hover:opacity-60 group-hover:blur-xl group-hover:-m-3"
      ></div>
      <button className="relative z-10 px-5 py-2 text-sm font-semibold text-white bg-linear-to-r from-blue-500 to-purple-600 rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-200 w-full sm:w-auto whitespace-nowrap shadow-lg">
        Join Us
      </button>
    </div>
  )

  return (
    <div className="bg-linear-to-br from-gray-900 via-black to-gray-900">
      <header
        className={`fixed top-4 sm:top-6 left-1/2 transform -translate-x-1/2 z-50
                         flex flex-col items-center
                         px-5 sm:px-6 py-3.5 backdrop-blur-xl
                         border border-gray-700 bg-gray-900 bg-opacity-50
                         w-[calc(100%-1rem)] sm:w-auto max-w-[95vw]
                         shadow-2xl shadow-black/50
                         ${isOpen ? 'rounded-2xl transition-all duration-300 ease-in-out' : 'rounded-full transition-all duration-200 ease-in-out'}`}
      >
        <div className="flex items-center justify-between w-full gap-x-4 sm:gap-x-8">
          <div className="flex items-center">{logoElement}</div>

          <nav className="hidden md:flex items-center space-x-8 text-sm">
            {navLinksData.map((link) => (
              <AnimatedNavLink key={link.href} href={link.href}>
                {link.label}
              </AnimatedNavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            {loginButtonElement}
            {signupButtonElement}
          </div>

          <button
            className="md:hidden flex items-center justify-center w-9 h-9 text-gray-300 hover:text-white focus:outline-none transition-colors rounded-lg hover:bg-gray-800"
            onClick={toggleMenu}
            aria-label={isOpen ? "Close Menu" : "Open Menu"}
          >
            <div className="relative w-5 h-4 flex flex-col justify-between">
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isOpen ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-current transition-all duration-300 ease-in-out ${
                  isOpen ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`w-full h-0.5 bg-current transform transition-all duration-300 ease-in-out ${
                  isOpen ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </div>
          </button>
        </div>

        <div
          className={`md:hidden flex flex-col items-stretch w-full ease-in-out overflow-hidden
                         ${isOpen ? "max-h-96 opacity-100 mt-4 transition-all duration-300" : "max-h-0 opacity-0 mt-0 transition-opacity duration-150"}`}
        >
          <div className="border-t border-gray-700 pt-4">
            <nav className="flex flex-col items-stretch space-y-1 w-full mb-4">
              {navLinksData.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-gray-300 hover:text-white hover:bg-gray-800 hover:bg-opacity-50 transition-all duration-200 w-full text-left px-4 py-3 rounded-lg font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="flex flex-col items-stretch space-y-3 border-t border-gray-700 pt-4">
              {loginButtonElement}
              {signupButtonElement}
            </div>
          </div>
        </div>
      </header>

      
    </div>
  )
}