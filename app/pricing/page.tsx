"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaCheck, FaCrown } from "react-icons/fa";
import { useSession } from "next-auth/react";

export default function PricingPage() {
    const { data: session, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(false);

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
                alert("Upgrade failed. Please try again.");
            }
        } catch (error) {
            console.error(error);
            alert("An error occurred.");
        } finally {
            setLoading(false);
        }
    };

    const isPremium = session?.user?.isPremium;

    return (
        <div className="bg-gray-50 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto text-center">
                <h2 className="text-3xl font-extrabold text-primary-900 sm:text-4xl">
                    Simple, transparent pricing
                </h2>
                <p className="mt-4 text-xl text-gray-500">
                    Choose the plan that's right for your cooking needs.
                </p>
            </div>

            <div className="mt-12 space-y-4 sm:mt-16 sm:space-y-0 sm:grid sm:grid-cols-2 sm:gap-6 max-w-4xl mx-auto">
                {/* Free Plan */}
                <div className="border border-gray-200 rounded-lg shadow-sm divide-y divide-gray-200 bg-white">
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-gray-900">Free</h3>
                        <p className="mt-4 text-sm text-gray-500">
                            Perfect for trying out the recipe digitization.
                        </p>
                        <p className="mt-8">
                            <span className="text-4xl font-extrabold text-gray-900">$0</span>
                            <span className="text-base font-medium text-gray-500">/mo</span>
                        </p>
                        <button
                            type="button"
                            disabled
                            className="mt-8 block w-full bg-gray-100 border border-gray-200 rounded-md py-2 text-sm font-semibold text-gray-400 text-center cursor-not-allowed"
                        >
                            {isPremium ? "Included" : "Current Plan"}
                        </button>
                    </div>
                    <div className="pt-6 pb-8 px-6">
                        <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                        <ul className="mt-6 space-y-4">
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">3 Recipe Scans per month</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">Basic AI Analysis</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">Standard Support</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Premium Plan */}
                <div className="border border-primary-200 rounded-lg shadow-lg divide-y divide-gray-200 bg-white ring-2 ring-primary-500">
                    <div className="p-6">
                        <h3 className="text-lg leading-6 font-medium text-primary-900 flex items-center justify-center">
                            Premium <FaCrown className="ml-2 text-yellow-400" />
                        </h3>
                        <p className="mt-4 text-sm text-gray-500">
                            For the serious home chef.
                        </p>
                        <p className="mt-8">
                            <span className="text-4xl font-extrabold text-gray-900">$9.99</span>
                            <span className="text-base font-medium text-gray-500">/mo</span>
                        </p>
                        {isPremium ? (
                            <button
                                type="button"
                                disabled
                                className="mt-8 block w-full bg-green-50 border border-transparent rounded-md py-2 text-sm font-semibold text-green-700 text-center"
                            >
                                Active Plan
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handleUpgrade}
                                disabled={loading}
                                className="mt-8 block w-full bg-primary-600 border border-transparent rounded-md py-2 text-sm font-semibold text-white text-center hover:bg-primary-700"
                            >
                                {loading ? "Upgrading..." : "Upgrade Now"}
                            </button>
                        )}
                    </div>
                    <div className="pt-6 pb-8 px-6">
                        <h4 className="text-sm font-medium text-gray-900 tracking-wide uppercase">What's included</h4>
                        <ul className="mt-6 space-y-4">
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">20 Recipe Scans per month</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">Priority AI Analysis</span>
                            </li>
                            <li className="flex space-x-3">
                                <FaCheck className="flex-shrink-0 h-5 w-5 text-green-500" />
                                <span className="text-sm text-gray-500">Priority Support</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
}
