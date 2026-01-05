"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaCrown } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function PricingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const t = useTranslations('Pricing');

    const handleUpgrade = async () => {
        setLoading(true);
        try {
            const res = await fetch("/api/user/upgrade", {
                method: "POST",
            });

            if (res.ok) {
                // Force session update to reflect new status
                await update();
                router.push("/profile");
            } else {
                alert(t('messages.failed'));
            }
        } catch (error) {
            console.error(error);
            alert(t('messages.error'));
        } finally {
            setLoading(false);
        }
    };

    const isPremium = session?.user?.isPremium;

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-primary-900 sm:text-4xl">
                    {t('title')}
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    {t('subtitle')}
                </p>
            </div>

            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">{t('Free.title')}</h3>
                        <p className="mt-4 text-sm text-gray-500">
                            {t('Free.description')}
                        </p>
                        <p className="mt-8">
                            <span className="text-4xl font-extrabold text-gray-900">{t('Free.price')}</span>
                            <span className="text-base font-medium text-gray-500">{t('perMonth')}</span>
                        </p>
                        <button
                            type="button"
                            disabled
                            className="mt-8 block w-full bg-gray-100 border border-gray-200 rounded-md py-2 text-sm font-semibold text-gray-400 text-center cursor-not-allowed"
                        >
                            {isPremium ? t('Free.includedStatus') : t('Free.currentPlan')}
                        </button>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                        <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">{t('included')}</h4>
                        <ul className="mt-6 space-y-4">
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">{t('Free.features.scans')}</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">{t('Free.features.analysis')}</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">{t('Free.features.support')}</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="border border-primary-200 rounded-lg shadow-lg divide-y divide-gray-200 bg-white ring-2 ring-primary-500">
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-primary-900 flex items-center justify-center">
                            {t('Premium.title')} <FaCrown className="ml-2 text-yellow-400" />
                        </h3>
                        <p className="mt-4 text-sm text-gray-500">
                            {t('Premium.description')}
                        </p>
                        <p className="mt-8">
                            <span className="text-4xl font-extrabold text-gray-900">{t('Premium.price')}</span>
                            <span className="text-base font-medium text-gray-500">{t('perMonth')}</span>
                        </p>
                        {isPremium ? (
                            <button
                                type="button"
                                disabled
                                className="mt-8 block w-full bg-green-50 border border-transparent rounded-md py-2 text-sm font-semibold text-green-700 text-center"
                            >
                                {t('Premium.activePlan')}
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="mt-8 block w-full bg-primary-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
                            >
                                {loading ? t('Premium.upgrading') : t('Premium.upgrade')}
                            </button>
                        )}
                    </div>
                    <div className="pt-6 pb-8 px-6">
                        <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">{t('included')}</h4>
                        <ul className="mt-6 space-y-4">
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">{t('Premium.features.scans')}</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">{t('Premium.features.analysis')}</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">{t('Premium.features.support')}</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
