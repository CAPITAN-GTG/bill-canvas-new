'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface DraggableItemProps {
  type: string;
  label: string;
  color?: string;
  icon: LucideIcon;
  defaultValue: string;
  onDragStart?: (e: React.DragEvent) => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  type,
  label,
  color = '#4A5568',
  icon: Icon,
  defaultValue,
  onDragStart,
}) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ 
      type, 
      label, 
      color,
      defaultValue 
    }));
    if (onDragStart) onDragStart(e);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      className="p-3 rounded-lg bg-white border border-gray-100 text-black cursor-move hover:shadow-md transition-all group"
      style={{ borderLeftWidth: '4px', borderLeftColor: color }}
    >
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0">
          <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-medium truncate">{label}</div>
          <div className="text-sm text-gray-500 truncate">{defaultValue}</div>
        </div>
      </div>
    </div>
  );
};

export default DraggableItem; 