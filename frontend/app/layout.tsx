import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ThemeProvider } from "../components/theme-provider";
import SmoothScroll from "../components/smooth-scroll";
import Navigation from "../components/navigation";
import { RouteChangeProvider } from "../components/route-change-provider";
import { AuthProvider } from "../contexts/AuthContext";
import { ToastProvider } from "../contexts/ToastContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
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
        className={`${inter.variable} antialiased bg-dark text-foreground font-inter`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
            <ToastProvider>
              <RouteChangeProvider>
                <SmoothScroll>
                  <Navigation />
                  {children}
                </SmoothScroll>
              </RouteChangeProvider>
            </ToastProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
