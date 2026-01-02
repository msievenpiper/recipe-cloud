export default function TermsPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Terms of Service</h1>

                <p className="text-gray-600 mb-8 italic">Last Updated: January 2, 2026</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Acceptance of Terms</h2>
                    <p className="text-gray-700 leading-relaxed">
                        By accessing or using Souper Scanner, you agree to be bound by these Terms of Service. If you do not agree to all of these terms, do not use our service.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">2. Description of Service</h2>
                    <p className="text-gray-700 leading-relaxed">
                        Souper Scanner provides AI-powered recipe scanning and management tools. We use advanced OCR and Large Language Models (LLMs) like Google Gemini to extract data from images provided by users.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Fair Usage & Limits</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        To ensure high quality of service for all users, we implement the following monthly scan limits:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                        <li><strong>Free Tier:</strong> 3 scans per month.</li>
                        <li><strong>Premium Tier:</strong> 20 scans per month.</li>
                    </ul>
                    <p className="text-gray-700 mt-4 leading-relaxed">
                        Automated scanning, bot usage, or any attempt to circumvent these limits is strictly prohibited and may result in account termination.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">4. User Content & Copyright</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You retain ownership of any images or text you upload. However, you are responsible for ensuring you have the right to digitize and store the recipes you upload. Souper Scanner respects intellectual property rights and expects users to do the same.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Disclaimers</h2>
                    <p className="text-gray-700 leading-relaxed italic">
                        "Cook at your own risk."
                    </p>
                    <p className="text-gray-700 mt-2 leading-relaxed">
                        Souper Scanner is an AI-powered tool. While we strive for accuracy, AI extraction can occasionally result in errors in measurements, ingredients, or instructions. Always verify AI-generated content against your original source. We are not liable for any kitchen accidents, failed dishes, or dietary issues resulting from the use of our service.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Termination</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We reserve the right to suspend or terminate your access to the service at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the service, us, or third parties, or for any other reason.
                    </p>
                </section>

                <div className="mt-12 text-sm text-gray-500 border-t pt-6">
                    If you have any questions regarding these terms, please contact us at legal@souperscanner.com
                </div>
            </div>
        </div>
    );
}
