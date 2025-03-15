'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import type { Canvas as CanvasType, CanvasItem, Connection } from '../../../models/canvases';
import Toolbar from '../../components/Toolbar';
import Canvas from '../../components/Canvas';

export default function CanvasPage() {
  const router = useRouter();
  const params = useParams();
  const canvasId = params.id as string;

  const [isTotalBoxDropped, setIsTotalBoxDropped] = useState(false);
  const [items, setItems] = useState<CanvasItem[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [canvasName, setCanvasName] = useState('');

  // Load canvas data
  useEffect(() => {
    const loadCanvas = async () => {
      try {
        const response = await fetch(`/api/canvas/${canvasId}`);
        if (response.ok) {
          const canvas: CanvasType = await response.json();
          setItems(canvas.items || []);
          setConnections(canvas.connections || []);
          setCanvasName(canvas.name || '');
          setIsTotalBoxDropped(canvas.items?.some((item: CanvasItem) => item.type === 'total') || false);
        } else if (response.status === 404) {
          // If it's a new canvas, initialize with empty state
          setCanvasName(`New Canvas`);
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Failed to load canvas:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (canvasId) {
      loadCanvas();
    }
  }, [canvasId]);

  // Save canvas data
  const saveCanvas = async () => {
    setIsSaving(true);
    try {
      const response = await fetch(`/api/canvas/${canvasId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: canvasName,
          items,
          connections,
        }),
      });

      if (!response.ok) {
        // If the canvas doesn't exist, create a new one
        if (response.status === 404) {
          const createResponse = await fetch('/api/canvas', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              name: canvasName,
              items,
              connections,
            }),
          });

          if (createResponse.ok) {
            const newCanvas = await createResponse.json();
            // Update the URL without reloading the page
            window.history.replaceState({}, '', `/canvas/${newCanvas._id}`);
          } else {
            throw new Error('Failed to create canvas');
          }
        } else {
          throw new Error('Failed to save canvas');
        }
      }
    } catch (error) {
      console.error('Error saving canvas:', error);
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-lg text-gray-600">Loading canvas...</div>
      </div>
    );
  }

  return (
    <main className="flex h-screen w-full overflow-hidden">
      <div className="fixed top-4 right-4 z-50 flex gap-2">
        <input
          type="text"
          value={canvasName}
          onChange={(e) => setCanvasName(e.target.value)}
          className="px-3 py-2 rounded-lg bg-white shadow-md text-gray-900 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Canvas Name"
        />
        <button
          onClick={saveCanvas}
          disabled={isSaving}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-800 transition-all flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          <span>{isSaving ? 'Saving...' : 'Save'}</span>
        </button>
        <button
          onClick={() => router.push('/')}
          className="p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-800 transition-all flex items-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Dashboard</span>
        </button>
      </div>
      <Toolbar isTotalBoxDropped={isTotalBoxDropped} />
      <div className="flex-1 h-full overflow-hidden">
        <Canvas 
          onTotalBoxDrop={() => setIsTotalBoxDropped(true)}
          onTotalBoxDelete={() => setIsTotalBoxDropped(false)}
          items={items}
          connections={connections}
          onItemsChange={setItems}
          onConnectionsChange={setConnections}
        />
      </div>
    </main>
  );
} 