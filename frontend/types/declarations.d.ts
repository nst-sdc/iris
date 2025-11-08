// Type declarations for modules without TypeScript definitions

declare module "framer-motion" {
  export const motion: any;
  export const AnimatePresence: any;
  export const useAnimation: any;
}

declare module "lucide-react" {
  export const Menu: any;
  export const X: any;
  export const ChevronDown: any;
  export const ArrowDown: any;
  export const Users: any;
  export const Award: any;
  export const Cpu: any;
  export const Rocket: any;
  export const Calendar: any;
  export const Clock: any;
  export const MapPin: any;
  export const User: any;
  export const Github: any;
  export const Linkedin: any;
  export const Instagram: any;
  export const Mail: any;
  export const Phone: any;
}

declare module "gsap" {
  export const gsap: any;
}

declare module "gsap/ScrollTrigger" {
  export const ScrollTrigger: any;
}

declare module "@studio-freight/lenis" {
  const Lenis: any;
  export default Lenis;
}

declare module "next-themes" {
  export const ThemeProvider: any;
}

declare module "next-themes/dist/types" {
  export interface ThemeProviderProps {
    attribute?: string;
    defaultTheme?: string;
    enableSystem?: boolean;
    disableTransitionOnChange?: boolean;
    children: React.ReactNode;
  }
}

declare module "geist/font/sans" {
  export const GeistSans: any;
}

declare module "geist/font/mono" {
  export const GeistMono: any;
}
