import { useTranslations } from "next-intl";

export default function PrivacyPage() {
    const t = useTranslations('Privacy');

    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">{t('title')}</h1>

                <p className="text-gray-600 mb-8 italic">{t('lastUpdated')}</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.collection.title')}</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        {t('sections.collection.content1')}
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.collection.content2')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.processing.title')}</h2>
                    <p className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: t.raw('sections.processing.content1').replace('Google Gemini', '<strong>Google Gemini</strong>').replace('Google Cloud Vision', '<strong>Google Cloud Vision</strong>') }}></p>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.processing.content2')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.retention.title')}</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <p className="text-blue-700 text-sm">
                            <strong>{t('sections.retention.storageTitle')}</strong> {t('sections.retention.storageContent')}
                        </p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.retention.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.security.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.security.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.cookies.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.cookies.content')}
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('sections.rights.title')}</h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t('sections.rights.content')}
                    </p>
                </section>

                <div className="mt-12 text-sm text-gray-500 border-t pt-6">
                    {t('contact')}
                </div>
            </div>
        </div>
    );
}
