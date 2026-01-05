"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import InteractiveBackground from "@/components/InteractiveBackground";
import { useTranslations } from "next-intl";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();
  const t = useTranslations('Auth.SignIn');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.ok) {
      router.push("/");
      router.refresh();
    } else {
      setError(result?.error || t('failed'));
    }
  };

  return (
    <>
      <InteractiveBackground />
      <div className="flex min-h-screen flex-col items-center justify-center px-4 py-8 md:p-24">
        <div className="w-full max-w-md p-6 md:p-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-lg border border-gray-200">
          <h1 className="text-3xl font-bold mb-6 text-center text-primary-800">{t('title')}</h1>
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          <form onSubmit={handleSubmit} className="flex flex-col space-y-4 w-full">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <input
              type="password"
              placeholder={t('passwordPlaceholder')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="p-3 border border-gray-300 rounded-md focus:ring-primary-500 focus:border-primary-500"
            />
            <button
              type="submit"
              className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-3 px-4 rounded-md transition-colors duration-200"
            >
              {t('submitButton')}
            </button>
          </form>
          <p className="mt-6 text-center text-gray-700">
            {t('noAccount')}{" "}
            <Link href="/register" className="text-primary-600 hover:underline">
              {t('registerLink')}
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
