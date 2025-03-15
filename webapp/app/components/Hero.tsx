'use client';

import { ArrowRight } from 'lucide-react';
import { useClerk } from '@clerk/nextjs';

export default function Hero() {
  const { openSignIn } = useClerk();

  const handleSignIn = () => {
    openSignIn({
      redirectUrl: '/dashboard',
      appearance: {
        elements: {
          rootBox: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }
        }
      }
    });
  };

  return (
    <main className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Visualize Your Financial Flow
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Create interactive financial diagrams to understand and optimize your money flow. 
            Connect income, expenses, and investments in a visual canvas.
          </p>
          <button 
            onClick={handleSignIn}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Get Started
            <ArrowRight className="w-6 h-6" />
          </button>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mt-20">
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Visual Canvas
            </h3>
            <p className="text-gray-600">
              Drag and drop financial elements to create intuitive flow diagrams.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Real-time Calculations
            </h3>
            <p className="text-gray-600">
              See how your financial decisions impact your bottom line instantly.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-sm border border-gray-100">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Secure & Private
            </h3>
            <p className="text-gray-600">
              Your financial data is protected with enterprise-grade security.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
} 