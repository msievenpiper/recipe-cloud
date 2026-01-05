import { useTranslations } from "next-intl";

export default function TermsPage() {
    const t = useTranslations('Terms');

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">{t('title')}</h1>

                <p className="text-gray-600 mb-8 italic">{t('lastUpdated')}</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.acceptance.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.acceptance.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.description.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.description.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.usage.title')}</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        {t('sections.usage.content')}
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li><strong>{t('sections.usage.freeTier')}</strong></li>
                        <li><strong>{t('sections.usage.premiumTier')}</strong></li>
                    </ul>
                    <p className="text-gray-700 mt-4 leading-relaxed">
                        {t('sections.usage.prohibited')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.content.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.content.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.disclaimers.title')}</h2>
                    <p className="text-gray-700 leading-relaxed italic">
                        {t('sections.disclaimers.quote')}
                    </p>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        {t('sections.disclaimers.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.termination.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.termination.content')}
                    </p>
                </section>

                <div className="mt-12 text-sm text-gray-500 border-t pt-6">
                    {t('contact')}
                </div>
            </div>
        </div>
    );
}
