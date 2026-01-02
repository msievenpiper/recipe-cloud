import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Keep if Inter is used elsewhere, otherwise remove
import "./globals.css";
import Navbar from "../components/Navbar";
import { Providers } from "./providers"; // Import the new Providers component
import PWAInstallPrompt from "../components/PWAInstallPrompt"; // Import the PWAInstallPrompt component

import UsageFloatingBar from "../components/UsageFloatingBar"; // Import UsageFloatingBar

const inter = Inter({ subsets: ["latin"] }); // Keep if Inter is used elsewhere, otherwise remove

export const metadata: Metadata = {
  title: "Recipe Cloud",
  description: "Your personal AI-powered recipe manager",
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
          <Navbar />
          {children}
          <UsageFloatingBar />
          <PWAInstallPrompt />
        </Providers>
      </body>
    </html>
  );
}
