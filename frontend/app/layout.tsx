import type { Metadata } from "next";
import { Inter, Roboto_Mono } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import SmoothScroll from "../components/smooth-scroll";
import Navigation from "../components/navigation";
import { RouteChangeProvider } from "../components/route-change-provider";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const robotoMono = Roboto_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "IRIS Robotics Club",
  description: "Empowering Innovators to Design a Smarter World",
  keywords: ["robotics", "innovation", "engineering", "technology", "IRIS", "club"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${robotoMono.variable} antialiased bg-dark text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <RouteChangeProvider>
            <SmoothScroll>
              <Navigation />
              {children}
            </SmoothScroll>
          </RouteChangeProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
