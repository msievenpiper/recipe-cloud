"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { Link } from "../i18n/routing";
import { FaCrown } from "react-icons/fa";

export default function UsageFloatingBar() {
    const { data: session } = useSession();
    const t = useTranslations('Components.UsageFloatingBar');

    if (!session) return null;

    const user = session.user;
    const isPremium = user.isPremium;
    const scanCount = user.scanCount || 0;
    // Fallback to defaults if not present
    const limit = isPremium ? 20 : 3;
    const percentage = Math.min((scanCount / limit) * 100, 100);

    return (
        <div className="fixed bottom-4 right-4 md:right-8 z-50 w-full max-w-xs md:w-auto px-4 md:px-0 flex justify-center md:block pointer-events-none">
            <div className="bg-white rounded-lg shadow-lg border border-gray-200 p-3 pointer-events-auto flex items-center space-x-4 animate-fade-in-up">
                <div className="flex-1">
                    <div className="flex justify-between items-center mb-1 text-xs text-gray-600 font-medium">
                        <span>{t('title')}</span>
                        <span>{scanCount} / {limit}</span>
                    </div>
                    <div className="w-32 bg-gray-200 rounded-full h-1.5">
                        <div
                            className={`h-1.5 rounded-full ${scanCount >= limit ? 'bg-red-500' : 'bg-primary-600'}`}
                            style={{ width: `${percentage}%` }}
                        ></div>
                    </div>
                </div>
                {!isPremium && (
                    <Link href="/pricing" className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 text-xs font-bold py-1 px-2 rounded flex items-center transition-colors">
                        <FaCrown className="mr-1" /> {t('upgrade')}
                    </Link>
                )}
            </div>
        </div>
    );
}
