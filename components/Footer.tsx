"use client";

import { Link } from "../i18n/routing";
import { FaGithub, FaTwitter, FaEnvelope } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const t = useTranslations('Footer');

    return (
        <footer className="bg-primary-900 text-gray-300 py-12 mt-auto">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand/About */}
                    <div className="col-span-1 md:col-span-2">
                        <h2 className="text-white text-xl font-bold mb-4">Souper Scanner</h2>
                        <p className="mb-4 max-w-sm text-sm leading-relaxed">
                            {t('description')}
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="hover:text-white transition-colors"><FaTwitter size={20} /></a>
                            <a href="#" className="hover:text-white transition-colors"><FaGithub size={20} /></a>
                            <a href="mailto:support@souperscanner.com" className="hover:text-white transition-colors"><FaEnvelope size={20} /></a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">{t('resources')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/" className="hover:text-white transition-colors">{t('links.home')}</Link></li>
                            <li><Link href="/recipes" className="hover:text-white transition-colors">{t('links.recipes')}</Link></li>
                            <li><Link href="/pricing" className="hover:text-white transition-colors">{t('links.pricing')}</Link></li>
                            <li><Link href="/upload" className="hover:text-white transition-colors">{t('links.upload')}</Link></li>
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h3 className="text-white font-semibold mb-4 uppercase tracking-wider text-xs">{t('legal')}</h3>
                        <ul className="space-y-2 text-sm">
                            <li><Link href="/terms" className="hover:text-white transition-colors font-medium">{t('links.terms')}</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors font-medium">{t('links.privacy')}</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-primary-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs">
                    <p>&copy; {currentYear} {t('copyright')}</p>
                    <p className="mt-4 md:mt-0 italic opacity-70">
                        {t('tagline')}
                    </p>
                </div>
            </div>
        </footer>
    );
}
