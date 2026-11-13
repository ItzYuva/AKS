import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import ChatWidget from "@/components/ChatWidget";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import GridBackground from "@/components/GridBackground";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Aditya Sinha",
  description: "Portfolio of Aditya Sinha — AI Engineer building intelligent systems. Explore my projects, blogs, and more.",
  keywords: ["AI Engineer", "Machine Learning", "Portfolio", "Aditya Sinha"],
  authors: [{ name: "Aditya Sinha" }],
  twitter: {
    card: "summary",
    creator: "@AdityaSinha11",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
    <body className={`${geistSans.className} bg-white dark:bg-[#09090b] transition-colors dark:text-white`}>
        <ThemeProvider>
          <GridBackground />
          <div className="relative z-[46] overflow-x-hidden">
            {children}
          </div>
          <ChatWidget />
          <AnalyticsTracker />
        </ThemeProvider>
      </body>
    </html>
  );
}