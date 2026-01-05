"use client";

import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaUserSecret, FaSignOutAlt } from "react-icons/fa";

export default function ImpersonationBanner() {
    const { data: session, update } = useSession();
    const t = useTranslations('Components.ImpersonationBanner');

    if (!session?.user?.isImpersonating) return null;

    const stopImpersonating = async () => {
        await update({ stopImpersonating: true });
        window.location.reload(); // Force reload to ensure all state is reset
    };

    return (
        <div className="bg-red-600 text-white px-4 py-2 flex justify-between items-center shadow-md z-50 relative">
            <div className="flex items-center space-x-2">
                <FaUserSecret className="text-xl" />
                <span className="font-bold">{t('label')}</span>
                <span className="text-sm opacity-90 hidden sm:inline">- {session.user.email}</span>
            </div>
            <button
                onClick={stopImpersonating}
                className="bg-white text-red-600 px-3 py-1 rounded-md text-sm font-bold hover:bg-red-50 flex items-center transition-colors"
            >
                <FaSignOutAlt className="mr-1" /> {t('exit')}
            </button>
        </div>
    );
}
