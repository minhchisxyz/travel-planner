import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "AI Travel Planner",
  description: "App to plan your trips using AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased text-sm md:text-lg min-h-screen relative bg-[url('/mobile_background.png')] md:bg-[url('/desktop_background.png')] bg-no-repeat bg-cover bg-center bg-fixed`}
    >
    {/*<div
        className="absolute inset-0 bg-[url('/mobile_background.png')] md:bg-[url('/desktop_background.png')] bg-no-repeat bg-cover bg-center bg-fixed filter blur-xs scale-100"
        aria-hidden="true"/>*/}
    <div className="relative z-10">
      {children}
    </div>
    </body>
    </html>
  );
}
