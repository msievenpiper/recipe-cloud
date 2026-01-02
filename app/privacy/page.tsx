export default function PrivacyPage() {
    return (
        <div className="bg-gray-50 min-h-screen py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto bg-white p-8 md:p-12 rounded-xl shadow-sm border border-gray-100">
                <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b pb-4">Privacy Policy</h1>

                <p className="text-gray-600 mb-8 italic">Last Updated: January 2, 2026</p>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information Collection</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        We collect information you provide directly to us when you create an account, such as your name, email address, and any optional profile information (phone, address).
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        When you use our scanning service, we collect the images you upload for the purpose of recipe extraction.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">2. AI Processing & Third Parties</h2>
                    <p className="text-gray-700 leading-relaxed mb-4">
                        Souper Scanner utilizes <strong>Google Gemini</strong> services (LLM) and <strong>Google Cloud Vision</strong> (OCR) to process your images and generate recipe content.
                    </p>
                    <p className="text-gray-700 leading-relaxed">
                        By using the service, you acknowledge that your uploaded images and the resulting extracted text will be processed by Google's infrastructure. We do not use your data to train our own models, but third-party AI providers may have their own data handling policies.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Data Retention</h2>
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-4">
                        <p className="text-blue-700 text-sm">
                            <strong>Temporary Image Storage:</strong> We only store your uploaded images temporarily. Once the AI agent has successfully processed the image and generated the digital recipe content, the original image is cleared from our active processing storage.
                        </p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">
                        Extracted recipe text and your account profile information are stored securely in our database for as long as your account remains active.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Security</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We implement industry-standard security measures to protect your data, including password hashing (bcrypt) and encrypted connections. However, no method of transmission over the internet is 100% secure.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies</h2>
                    <p className="text-gray-700 leading-relaxed">
                        We use cookies primarily for session management and authentication via NextAuth.js. These are necessary for the application to function and recognize you across different pages.
                    </p>
                </section>

                <section className="mb-10">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Your Rights</h2>
                    <p className="text-gray-700 leading-relaxed">
                        You may view, edit, or delete your account information at any time through your profile settings. Upon account deletion, all personal data associated with your account will be permanently removed from our databases.
                    </p>
                </section>

                <div className="mt-12 text-sm text-gray-500 border-t pt-6">
                    For privacy-related inquiries, please contact us at privacy@souperscanner.com
                </div>
            </div>
        </div>
    );
}
