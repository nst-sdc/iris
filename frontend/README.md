# IRIS Robotics Club Website

A futuristic, scroll-animated website for IRIS Robotics Club built with Next.js 15, TypeScript, Tailwind CSS, Framer Motion, and GSAP ScrollTrigger.

![IRIS Robotics Club](https://placeholder.com/iris-robotics-preview.jpg)

## Features

- 🚀 Built with Next.js 15 App Router
- 🔧 TypeScript for type safety
- 🎨 Tailwind CSS 4 for styling
- ✨ Framer Motion for smooth animations
- 📜 GSAP ScrollTrigger for scroll-based animations
- 🤖 Interactive 3D robot model with Spline
- 🌐 Responsive design for all devices
- 🌙 Dark mode aesthetic with neon accents
- 🧩 Modular component architecture

## Sections

- **Hero Section**: Full viewport with 3D interactive robot model
- **About Section**: Bento grid of statistics and mission statement
- **Projects Section**: Showcase of robotics projects
- **Events Section**: Timeline of upcoming events and workshops
- **Blog Section**: Latest articles and insights
- **Gallery Section**: Visual showcase with lightbox functionality
- **Footer**: Contact information and social links

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Tech Stack

- **Frontend Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4
- **Animation Libraries**:
  - Framer Motion
  - GSAP + ScrollTrigger
- **3D Rendering**: Spline
- **UI Components**: Custom components with glassmorphism effects
- **Fonts**: Inter (Google Fonts)

## Project Structure

```
/
├── app/                  # Next.js App Router
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Home page
├── components/           # React components
│   ├── sections/         # Page sections
│   │   ├── hero.tsx
│   │   ├── about.tsx
│   │   └── ...
│   ├── ui/              # Reusable UI components
│   └── ...
├── lib/                 # Utility functions
├── public/              # Static assets
└── types/               # TypeScript type definitions
```

## Customization

The website uses a futuristic dark theme with cyan and violet accents. You can customize the colors in `tailwind.config.js` and `globals.css`.

## License

This project is licensed under the MIT License.
