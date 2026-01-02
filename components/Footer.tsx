"use client";

import Link from "next/link";
import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-primary-900 text-gray-300 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand/About */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-white text-xl font-bold mb-4">Souper Scanner</h2>
                        <p className="mb-4 max-w-sm text-sm leading-relaxed">
                            Your personal AI-powered recipe manager and scanner. Transform your physical recipes into a digital collection with the power of Google Gemini.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><FaGithub size={20} /></a>
                            <a href="mailto:support@souperscanner.com" className="hover:text-white transition-colors"><FaEnvelope size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Resources</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">Home</Link></li>
                            <li><Link href="/recipes" className="hover:text-white transition-colors">My Recipes</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
                            <li><Link href="/upload" className="hover:text-white transition-colors">Upload Recipe</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">Legal</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terms" className="hover:text-white transition-colors font-medium">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors font-medium">Privacy Policy</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {currentYear} Souper Scanner. All rights reserved.</p>
                    <p className="mt-4 md:mt-0 italic opacity-70">
                        Scanning memories, one recipe at a time.
                    </p>
                </div>
            </div>
        </footer>
    );
}
