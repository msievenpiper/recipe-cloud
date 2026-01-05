"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { FaCamera, FaMagic, FaEdit, FaUsers, FaStar, FaUpload, FaBookOpen } from "react-icons/fa";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";

export default function Home() {
  const { data: session, status } = useSession();
  const [hasRecipes, setHasRecipes] = useState(false);
  const t = useTranslations('HomePage');

  const isLoading = status === "loading";
  const isLoggedIn = !!session;

  useEffect(() => {
    if (isLoggedIn) {
      fetch("/api/recipes")
        .then((res) => res.json())
        .then((data) => {
          if (data && data.length > 0) {
            setHasRecipes(true);
          }
        });
    }
  }, [isLoggedIn]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-gradient-to-br from-primary-600 to-secondary-700 text-white p-4">
        <div className="z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            {t('Hero.headline')}
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-0 animate-fade-in-up animation-delay-300">
            {t('Hero.subheadline')}
          </p>
          {isLoading ? (
            <div className="bg-white text-primary-700 px-8 py-3 rounded-full text-lg font-semibold shadow-lg opacity-0 animate-fade-in-up animation-delay-600">
              {t('Hero.loading')}
            </div>
          ) : isLoggedIn ? (
            hasRecipes ? (
              <Link href="/recipes" className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 opacity-0 animate-fade-in-up animation-delay-600 flex items-center justify-center space-x-2 mx-auto w-fit">
                <FaBookOpen />
                <span>{t('Hero.goToLibrary')}</span>
              </Link>
            ) : (
              <Link href="/upload" className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 opacity-0 animate-fade-in-up animation-delay-600 flex items-center justify-center space-x-2 mx-auto w-fit">
                <FaUpload />
                <span>{t('Hero.uploadFirst')}</span>
              </Link>
            )
          ) : (
            <Link href="/register" className="bg-white text-primary-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 opacity-0 animate-fade-in-up animation-delay-600">
              {t('Hero.getStarted')}
            </Link>
          )}
        </div>
        {/* Background elements for visual interest */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-secondary-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-accent rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* How It Works / Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-800">{t('HowItWorks.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <FaCamera className="text-primary-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-primary-700">{t('HowItWorks.step1Title')}</h3>
              <p className="text-gray-600">
                {t('HowItWorks.step1Desc')}
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <FaMagic className="text-secondary-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-primary-700">{t('HowItWorks.step2Title')}</h3>
              <p className="text-gray-600">
                {t('HowItWorks.step2Desc')}
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <FaEdit className="text-accent text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3 text-primary-700">{t('HowItWorks.step3Title')}</h3>
              <p className="text-gray-600">
                {t('HowItWorks.step3Desc')}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 text-primary-800">{t('Benefits.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaStar className="text-accent text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-primary-700">{t('Benefits.benefit1Title')}</h3>
                  <p className="text-gray-600">{t('Benefits.benefit1Desc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaUsers className="text-primary-500 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-primary-700">{t('Benefits.benefit2Title')}</h3>
                  <p className="text-gray-600">{t('Benefits.benefit2Desc')}</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaMagic className="text-secondary-500 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold text-primary-700">{t('Benefits.benefit3Title')}</h3>
                  <p className="text-gray-600">{t('Benefits.benefit3Desc')}</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <Image
                src="/marketing/iphone.png"
                alt="Souper Scanner App Screenshot"
                width={300} // Adjust width as needed
                height={600} // Adjust height as needed
                className="rounded-lg shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-primary-600 to-secondary-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('CTA.title')}</h2>
          <p className="text-lg md:text-xl mb-8">{t('CTA.description')}</p>
          {isLoggedIn ? (
            <Link href="/upload" className="bg-white text-primary-700 hover:bg-gray-100 px-10 py-4 rounded-full text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center space-x-2 mx-auto w-fit">
              <FaUpload />
              <span>{t('CTA.buttonLoggedIn')}</span>
            </Link>
          ) : (
            <Link href="/register" className="bg-white text-primary-700 hover:bg-gray-100 px-10 py-4 rounded-full text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
              {t('CTA.buttonLoggedOut')}
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
