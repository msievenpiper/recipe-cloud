import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Keep if Inter is used elsewhere, otherwise remove
import "../globals.css";
import Navbar from "../../components/Navbar";
import { Providers } from "../providers"; // Fixed: relative to app/
import PWAInstallPrompt from "../../components/PWAInstallPrompt"; // Fixed: relative to root/components

import UsageFloatingBar from "../../components/UsageFloatingBar"; // Import UsageFloatingBar
import ImpersonationBanner from "../../components/ImpersonationBanner"; // Import ImpersonationBanner

import Footer from "../../components/Footer"; // Import Footer
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ["latin"] }); // Keep if Inter is used elsewhere, otherwise remove
export const metadata: Metadata = {
  title: "Souper Scanner",
  description: "Your personal AI-powered recipe manager and scanner",
  manifest: "/manifest.json",
  icons: {
    icon: "/icon.svg",
  },
};

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages}>
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
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
