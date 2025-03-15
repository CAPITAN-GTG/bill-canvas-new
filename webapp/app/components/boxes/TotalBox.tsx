'use client';

import React from 'react';
import { Connection } from './BaseBox';
import { X } from 'lucide-react';

export interface TotalBoxProps {
  id: string;
  position: { x: number; y: number };
  total: number;
  onConnect: (fromId: string, fromSide: 'left' | 'right') => void;
  onDelete: (id: string) => void;
  pendingConnection?: { fromId: string; fromSide: 'left' | 'right' } | null;
  connections: Connection[];
}

const TotalBox: React.FC<TotalBoxProps> = ({ 
  id,
  position,
  total,
  onConnect,
  onDelete,
  pendingConnection,
  connections,
}) => {
  const isPointConnected = () => {
    return connections.some(
      conn => 
        (conn.from === id && conn.fromSide === 'left') || 
        (conn.to === id && conn.toSide === 'left')
    );
  };

  const isPointPending = () => {
    return pendingConnection?.fromId === id && pendingConnection?.fromSide === 'left';
  };

  return (
    <div 
      className="absolute bg-white rounded-lg shadow-lg p-3 w-[120px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="flex items-center justify-between mb-1">
        <div className="text-sm font-medium text-black">Collector</div>
        <button
          onClick={() => onDelete(id)}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-red-500"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
      <div
        className={`absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors
          ${isPointPending() ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
          ${isPointConnected() ? 'ring-2 ring-gray-300' : ''}
        `}
        style={{
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        onClick={() => onConnect(id, 'left')}
      />
      <div className="text-lg font-semibold text-black">
        ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default TotalBox; 