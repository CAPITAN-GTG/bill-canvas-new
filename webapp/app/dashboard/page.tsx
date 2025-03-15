'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, X, Search, LayoutGrid } from 'lucide-react';
import { useUser, UserButton } from '@clerk/nextjs';

interface CanvasCard {
  _id: string;
  name: string;
  updatedAt: string;
}

export default function Dashboard() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [canvases, setCanvases] = useState<CanvasCard[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newCanvasName, setNewCanvasName] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchCanvases = async () => {
      try {
        const response = await fetch('/api/canvas');
        if (response.ok) {
          const data = await response.json();
          setCanvases(data);
        }
      } catch (error) {
        console.error('Failed to fetch canvases:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user) {
      fetchCanvases();
    }
  }, [user]);

  if (!isLoaded || isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading...</div>
      </div>
    );
  }

  const filteredCanvases = canvases.filter(canvas => 
    canvas.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const createNewCanvas = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCanvasName.trim() || !user) return;

    setIsCreating(true);
    try {
      const response = await fetch('/api/canvas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          name: newCanvasName.trim(),
          items: [],
          connections: [],
        }),
      });

      if (response.ok) {
        const newCanvas = await response.json();
        router.push(`/canvas/${newCanvas._id}`);
      }
    } catch (error) {
      console.error('Failed to create canvas:', error);
    } finally {
      setIsCreating(false);
      setShowModal(false);
      setNewCanvasName('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 h-full w-64 bg-white border-r border-gray-200">
        <div className="flex flex-col h-full">
          {/* Profile Section */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col items-center">
              <UserButton 
                appearance={{
                  elements: {
                    avatarBox: "w-20 h-20"
                  }
                }}
              />
              <h2 className="mt-4 text-xl font-semibold text-gray-900">{user?.firstName} {user?.lastName}</h2>
              <p className="text-sm text-gray-500">{user?.emailAddresses[0].emailAddress}</p>
            </div>
          </div>

          {/* Stats Section */}
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-500 mb-4">Overview</h3>
            <div className="space-y-4">
              <div>
                <div className="text-2xl font-bold text-gray-900">{canvases.length}</div>
                <div className="text-sm text-gray-500">Total Canvases</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {canvases.filter(c => new Date(c.updatedAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length}
                </div>
                <div className="text-sm text-gray-500">Active This Week</div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="p-6">
            <button
              onClick={() => setShowModal(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              New Canvas
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pl-64">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">My Canvases</h1>
            <p className="text-gray-600 mt-1">Create and manage your financial flow diagrams</p>
          </div>

          {/* Search Bar */}
          <div className="relative mb-6">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search canvases..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Canvas Grid */}
          {filteredCanvases.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCanvases.map((canvas) => (
                <Link
                  key={canvas._id}
                  href={`/canvas/${canvas._id}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                        {canvas.name}
                      </h2>
                      <LayoutGrid className="w-5 h-5 text-gray-400 group-hover:text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-500 mt-2">
                      Last updated: {new Date(canvas.updatedAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <LayoutGrid className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No canvases found</h3>
              <p className="text-gray-500">
                {searchQuery 
                  ? "No canvases match your search. Try a different query."
                  : "Get started by creating your first canvas."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* New Canvas Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Create New Canvas</h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  setNewCanvasName('');
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={createNewCanvas}>
              <div className="mb-4">
                <label htmlFor="canvasName" className="block text-sm font-medium text-gray-700 mb-2">
                  Canvas Name
                </label>
                <input
                  id="canvasName"
                  type="text"
                  value={newCanvasName}
                  onChange={(e) => setNewCanvasName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                  placeholder="Enter canvas name"
                  required
                  autoFocus
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setNewCanvasName('');
                  }}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating || !newCanvasName.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  {isCreating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 