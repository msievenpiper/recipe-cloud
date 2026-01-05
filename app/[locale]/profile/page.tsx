"use client";

import { useState, useEffect } from "react";
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaCrown, FaCheckCircle, FaSpinner } from "react-icons/fa";
import { useTranslations } from "next-intl";

export default function ProfilePage() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [userData, setUserData] = useState({
        name: "",
        email: "",
        phoneNumber: "",
        address: "",
        role: "",
        isPremium: false,
        scanCount: 0,
    });
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const t = useTranslations('Profile');

    useEffect(() => {
        fetch("/api/user/profile")
            .then(res => {
                if (res.ok) return res.json();
                throw new Error("Failed to load profile");
            })
            .then(data => {
                setUserData({
                    name: data.name || "",
                    email: data.email || "",
                    phoneNumber: data.phoneNumber || "",
                    address: data.address || "",
                    role: data.role || "USER",
                    isPremium: data.isPremium || false,
                    scanCount: data.scanCount || 0,
                });
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setMessage({ type: 'error', text: t('messages.loadError') });
                setLoading(false);
            });
    }, [t]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setUserData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage(null);

        try {
            const res = await fetch("/api/user/profile", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: userData.name,
                    email: userData.email,
                    phoneNumber: userData.phoneNumber,
                    address: userData.address,
                }),
            });

            if (res.ok) {
                setMessage({ type: 'success', text: t('messages.success') });
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (error) {
            console.error(error);
            setMessage({ type: 'error', text: t('messages.saveError') });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <FaSpinner className="animate-spin text-4xl text-primary-600" />
            </div>
        );
    }

    const usageLimit = userData.isPremium ? 20 : 3;

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-8">

                {/* Subscription Status Card */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 bg-primary-700">
                        <h2 className="text-xl font-bold text-white flex items-center">
                            <FaCrown className="mr-2 text-yellow-400" />
                            {t('subscription.title')} {userData.isPremium ? t('subscription.premium') : t('subscription.free')}
                        </h2>
                    </div>
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <span className="text-gray-700 font-medium">{t('subscription.monthlyScans')}</span>
                            <span className="text-sm text-gray-500">{userData.scanCount} / {usageLimit} {t('subscription.used')}</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                            <div
                                className={`h-2.5 rounded-full ${userData.scanCount >= usageLimit ? 'bg-red-600' : 'bg-green-600'}`}
                                style={{ width: `${Math.min((userData.scanCount / usageLimit) * 100, 100)}%` }}
                            ></div>
                        </div>
                        {!userData.isPremium && (
                            <div className="mt-4 bg-yellow-50 p-4 rounded-md border border-yellow-200">
                                <p className="text-sm text-yellow-800">
                                    {t('subscription.upgradeMessage')}
                                </p>
                                <a href="/pricing" className="mt-2 inline-block text-sm font-semibold text-primary-700 hover:text-primary-800">
                                    {t('subscription.viewPlans')} &rarr;
                                </a>
                            </div>
                        )}
                    </div>
                </div>

                {/* Profile Form */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-xl font-bold text-gray-800">{t('title')}</h2>
                    </div>
                    <div className="p-6">
                        {message && (
                            <div className={`mb-4 p-4 rounded-md ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                                {message.text}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.name')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaUser className="text-gray-400" />
                                        </div>
                                        <input
                                            type="text"
                                            name="name"
                                            value={userData.name}
                                            onChange={handleChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                            placeholder={t('placeholders.name')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.email')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaEnvelope className="text-gray-400" />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={userData.email}
                                            onChange={handleChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                            placeholder={t('placeholders.email')}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.phone')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <FaPhone className="text-gray-400" />
                                        </div>
                                        <input
                                            type="tel"
                                            name="phoneNumber"
                                            value={userData.phoneNumber}
                                            onChange={handleChange}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                            placeholder={t('placeholders.phone')}
                                        />
                                    </div>
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">{t('labels.address')}</label>
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="absolute inset-y-0 left-0 pl-3 pt-2.5 pointer-events-none">
                                            <FaMapMarkerAlt className="text-gray-400" />
                                        </div>
                                        <textarea
                                            name="address"
                                            value={userData.address}
                                            onChange={handleChange}
                                            rows={3}
                                            className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md py-2 px-3 border"
                                            placeholder={t('placeholders.address')}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:bg-gray-400"
                                >
                                    {saving ? t('buttons.saving') : t('buttons.save')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
