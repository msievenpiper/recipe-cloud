import Link from "next/link";
import { FaCamera, FaMagic, FaEdit, FaUsers, FaStar } from "react-icons/fa"; // New icons for features

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center bg-gradient-to-br from-blue-600 to-purple-700 text-white p-4">
        <div className="z-10 max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 animate-fade-in-up">
            Transform Your Recipe Photos into Digital Masterpieces
          </h1>
          <p className="text-lg md:text-xl mb-8 opacity-0 animate-fade-in-up animation-delay-300">
            Snap, Process, Edit. Your culinary creations, perfectly organized and accessible anywhere.
          </p>
          <Link href="/register" className="bg-white text-blue-700 hover:bg-gray-100 px-8 py-3 rounded-full text-lg font-semibold shadow-lg transition-all duration-300 transform hover:scale-105 opacity-0 animate-fade-in-up animation-delay-600">
            Get Started - It's Free!
          </Link>
        </div>
        {/* Background elements for visual interest */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
          <div className="absolute top-1/2 right-1/4 w-64 h-64 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
        </div>
      </section>

      {/* How It Works / Features Section */}
      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">How Recipe Cloud Works Its Magic</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <FaCamera className="text-blue-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">1. Snap & Upload</h3>
              <p className="text-gray-600">
                Capture a photo of your handwritten or printed recipe. Our intelligent system is ready to receive it.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <FaMagic className="text-purple-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">2. AI Transformation</h3>
              <p className="text-gray-600">
                Our advanced AI (Google Vision & Gemini) processes your image, extracting ingredients, steps, and notes, then formats it beautifully.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1">
              <FaEdit className="text-pink-500 text-5xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-3">3. Refine & Organize</h3>
              <p className="text-gray-600">
                Review, rearrange, and edit the AI-generated recipe in markdown. Save it to your personalized digital cookbook.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 md:py-24 bg-gray-100">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Why You'll Love Recipe Cloud</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <FaStar className="text-yellow-500 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Never Lose a Recipe Again</h3>
                  <p className="text-gray-600">Digitize all your family recipes, magazine clippings, and handwritten notes. Securely stored in the cloud.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaUsers className="text-green-500 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Share with Ease</h3>
                  <p className="text-gray-600">Easily share your perfected recipes with friends and family, without the hassle of retyping.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <FaMagic className="text-blue-500 text-3xl flex-shrink-0 mt-1" />
                <div>
                  <h3 className="text-xl font-semibold">Smart Editing</h3>
                  <p className="text-gray-600">Our intuitive markdown editor makes tweaking AI-generated content a breeze. Focus on cooking, not formatting.</p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              {/* Placeholder for an image or illustration */}
              <div className="w-full max-w-md h-64 bg-gray-300 rounded-lg shadow-lg flex items-center justify-center text-gray-600">
                [Placeholder for App Screenshot]
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 md:py-24 bg-gradient-to-r from-green-500 to-teal-600 text-white text-center">
        <div className="container mx-auto px-4 max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Organize Your Kitchen?</h2>
          <p className="text-lg md:text-xl mb-8">Join thousands of home cooks simplifying their recipe management with AI.</p>
          <Link href="/register" className="bg-white text-teal-700 hover:bg-gray-100 px-10 py-4 rounded-full text-xl font-semibold shadow-lg transition-all duration-300 transform hover:scale-105">
            Start Your Free Account Today
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-gray-300 py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; {new Date().getFullYear()} Recipe Cloud. All rights reserved.</p>
          <div className="flex justify-center space-x-4 mt-4">
            <Link href="/privacy" className="hover:text-white">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
