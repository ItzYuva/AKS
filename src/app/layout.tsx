import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./context/ThemeContext";
import ChatWidget from "@/components/ChatWidget";
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
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body className={`bg-white dark:bg-[#020B18] transition-colors dark:text-white ${geistSans.variable} ${geistMono.variable}`}>
        <ThemeProvider>
          <GridBackground />
          <div className="relative z-10 overflow-x-hidden">
            {children}
          </div>
          <ChatWidget />
        </ThemeProvider>
      </body>
    </html>
  );
}