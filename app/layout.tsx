import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Keep if Inter is used elsewhere, otherwise remove
import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "./providers"; // Import the new Providers component
import PWAInstallPrompt from "../components/PWAInstallPrompt"; // Import the PWAInstallPrompt component

import UsageFloatingBar from "../components/UsageFloatingBar"; // Import UsageFloatingBar
import ImpersonationBanner from "../components/ImpersonationBanner"; // Import ImpersonationBanner

import Footer from "../components/Footer"; // Import Footer

const inter = Inter({ subsets: ["latin"] }); // Keep if Inter is used elsewhere, otherwise remove
export const metadata: Metadata = {
  title: "Souper Scanner",
  description: "Your personal AI-powered recipe manager and scanner",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <ImpersonationBanner />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
          <UsageFloatingBar />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
