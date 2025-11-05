# IRIS — Robotics Club Website (Newton School of Technology)

IRIS is the official website of the Robotics Club at Newton School of Technology. It showcases club activities, events, projects, blog articles, and resources for students passionate about robotics and related technologies.

This repository contains the Next.js app, component library setup, and content (including markdown-based blog posts) that power the site.

## 🚀 Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript + React 18
- **Styling**: Tailwind CSS 4, Geist, custom components
- **UI**: Radix UI + shadcn-inspired components
- **Content**: Markdown (MD) for articles with `unified`, `remark`, `rehype`, and `rehype-pretty-code`
- **Animations/3D**: Framer Motion, Spline, Three.js

## 🧰 Prerequisites
- Node.js 18+ (recommend 20+)
- npm or pnpm

## 🏗️ Local Development
1. Fork the repository
2. Clone your fork
   ```bash
   git clone <your-repo-link>
   cd iris
   ```
3. Install dependencies
   ```bash
   npm install
   # or
   pnpm install
   ```
4. Start the dev server
   ```bash
   npm run dev
   # or
   pnpm dev
   ```
5. Visit `http://localhost:3000`

## 📦 Available Scripts
- `npm run dev` – Start Next.js in development
- `npm run build` – Create a production build
- `npm run start` – Run the production build locally
- `npm run lint` – Lint the project

## 📁 Project Structure
```text
app/                # Next.js App Router pages
  page.jsx          # Home page
  aboutus/          # About page
  Blogs/            # Blogs listing page
  blogpost/[slug]/  # Dynamic blog post page

articles/           # Markdown articles (content source)

components/         # Reusable components
  sections/         # Page sections (Hero, Services, etc.)
  ui/               # shadcn/radix-like UI primitives

hooks/              # Custom hooks
lib/                # Utilities (e.g., classnames)
public/             # Static assets (images, logos)
styles/             # Global styles
```

## ✍️ Writing Blog Articles
Articles live under `articles/` as markdown files. Each post should have frontmatter and content.

Example: `articles/line-following-robot.md`
```md
---
title: How to Make a Line Following Robot (LFR)
description: This is a guide on how to build a Line Following Robot (LFR) using basic components.
slug: line-following-robot
date: 02/03/2025
author: Abhiman Raj
image: /blogsimg/lfr.png
---

# Introduction
Your markdown content goes here.
```

The page at `app/blogpost/[slug]/page.jsx` renders posts based on the filename slug.

## 🧩 Notable Components/Features
- `components/sections/*` for homepage sections (Hero, Services, Process, etc.)
- `components/ui/*` for UI primitives (Accordion, Dialog, Button, etc.)
- 3D/interactive visuals via Spline/Three.js when enabled

## 🤝 Contributing
We welcome contributions from club members:
- Create an issue for features/bugs
- Fork and create a feature branch
- Keep edits focused and small
- Open a Pull Request with a clear description

## 📄 License
Copyright © Newton School of Technology — IRIS Robotics Club.
All rights reserved unless a license is added. If you plan to reuse code, propose a license via PR.

## 📬 Contact
- Club: IRIS — Robotics Club, Newton School of Technology
- Maintainers: Core IRIS web team
- For queries or access: open an issue or contact the club coordinators

