'use client';

import { useUser } from '@clerk/nextjs';
import Hero from './components/Hero';
import Dashboard from './dashboard/page';

export default function Home() {
  const { isLoaded, isSignedIn } = useUser();

  if (!isLoaded) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  return isSignedIn ? <Dashboard /> : <Hero />;
}
