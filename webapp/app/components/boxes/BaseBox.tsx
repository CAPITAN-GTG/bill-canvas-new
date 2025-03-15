'use client';

import React, { useState } from 'react';
import { Pencil, X, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';

export interface Connection {
  id: string;
  from: string;
  to: string;
  fromSide: 'left' | 'right';
  toSide: 'left' | 'right';
}

export interface BaseBoxProps {
  id: string;
  name: string;
  label: string;
  color: string;
  value: string;
  icon: React.ReactNode;
  position: { x: number; y: number };
  onEdit: () => void;
  onDelete: () => void;
  onValueChange: (value: string) => void;
  onNameChange?: (name: string) => void;
  onConnect: (fromId: string, fromSide: 'left' | 'right') => void;
  onMove?: (direction: 'up' | 'down' | 'left' | 'right') => void;
  isEditing: boolean;
  pendingConnection?: { fromId: string; fromSide: 'left' | 'right' } | null;
  connections: Connection[];
}

const BaseBox: React.FC<BaseBoxProps> = ({
  id,
  name,
  label,
  color,
  value,
  icon,
  position,
  onEdit,
  onDelete,
  onValueChange,
  onNameChange,
  onConnect,
  onMove,
  isEditing,
  pendingConnection,
  connections,
}) => {
  const [isEditingName, setIsEditingName] = useState(false);
  const connectionPoints = ['left', 'right'] as const;

  const isPointConnected = (side: typeof connectionPoints[number]) => {
    return connections.some(
      conn => 
        (conn.from === id && conn.fromSide === side) || 
        (conn.to === id && conn.toSide === side)
    );
  };

  const isPointPending = (side: typeof connectionPoints[number]) => {
    return pendingConnection?.fromId === id && pendingConnection?.fromSide === side;
  };

  return (
    <div
      className="absolute p-4 rounded-lg bg-white shadow-md text-black hover:shadow-lg transition-all w-[240px]"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        borderLeft: `4px solid ${color}`,
        transform: 'translate(-50%, -50%)',
      }}
    >
      {/* Connection Points */}
      {connectionPoints.map((point) => (
        <div
          key={point}
          className={`absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors
            ${isPointPending(point) ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
            ${isPointConnected(point) ? 'ring-2 ring-gray-300' : ''}
          `}
          style={{
            ...(point === 'left' && { left: '-6px', top: '50%', transform: 'translateY(-50%)' }),
            ...(point === 'right' && { right: '-6px', top: '50%', transform: 'translateY(-50%)' }),
          }}
          onClick={() => onConnect(id, point)}
        />
      ))}
      
      {/* Header with controls */}
      <div className="flex items-center justify-between mb-3">
        {isEditingName && onNameChange ? (
          <input
            type="text"
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            onBlur={() => setIsEditingName(false)}
            onKeyDown={(e) => e.key === 'Enter' && setIsEditingName(false)}
            className="flex-1 mr-2 px-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
        ) : (
          <div 
            className="flex-1 mr-2 text-sm font-medium truncate cursor-pointer hover:text-blue-600"
            onClick={() => onNameChange && setIsEditingName(true)}
          >
            {name}
          </div>
        )}
        <div className="flex items-center gap-1">
          <button
            onClick={onEdit}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800"
          >
            <Pencil className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Type Tag */}
      <div 
        className="inline-flex items-center gap-1.5 px-2 py-1 rounded-md text-xs font-medium mb-2"
        style={{ backgroundColor: `${color}20`, color }}
      >
        {icon}
        {label}
      </div>
      
      {/* Value */}
      {isEditing ? (
        <input
          type="text"
          value={value}
          onChange={(e) => onValueChange(e.target.value)}
          className="w-full p-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 mb-3"
          autoFocus
        />
      ) : (
        <div className="text-lg font-semibold mb-3">{value}</div>
      )}

      {/* Move Controls */}
      {onMove && (
        <div className="grid grid-cols-3 gap-1 border-t border-gray-100 pt-2">
          <div />
          <button
            onClick={() => onMove('up')}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <div />
          <button
            onClick={() => onMove('left')}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="w-4 h-4" />
          <button
            onClick={() => onMove('right')}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <div />
          <button
            onClick={() => onMove('down')}
            className="p-1 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
          <div />
        </div>
      )}
    </div>
  );
};

export default BaseBox; 