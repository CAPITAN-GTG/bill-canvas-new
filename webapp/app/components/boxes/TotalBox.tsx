'use client';

import React from 'react';
import BaseBox, { BaseBoxProps } from './BaseBox';
import { Calculator } from 'lucide-react';

export interface TotalBoxProps extends Omit<BaseBoxProps, 'label' | 'color' | 'icon' | 'value' | 'isEditing' | 'onEdit' | 'onValueChange' | 'onNameChange' | 'connections' | 'onConnect'> {
  total: number;
  connections: BaseBoxProps['connections'];
  onConnect: BaseBoxProps['onConnect'];
}

const TotalBox: React.FC<TotalBoxProps> = ({ total, connections, onConnect, ...props }) => {
  // Filter connections to only show those connected to this box's left side
  const filteredConnections = connections.filter(conn => {
    if (conn.to === props.id) {
      return conn.toSide === 'left';
    }
    if (conn.from === props.id) {
      return conn.fromSide === 'left';
    }
    return false;
  });

  return (
    <div
      className={`absolute p-4 rounded-lg bg-white shadow-md text-black hover:shadow-lg transition-all w-[180px] cursor-move
        ${props.isDragging ? 'ring-2 ring-blue-500 ring-opacity-50 shadow-lg' : ''}`}
      style={{
        left: `${props.position.x}px`,
        top: `${props.position.y}px`,
        borderLeft: `4px solid #3B82F6`,
        transform: 'translate(-50%, -50%)',
        userSelect: 'none',
      }}
      onMouseDown={props.onMouseDown}
    >
      {/* Single Connection Point on the Left */}
      <div
        className={`absolute w-3 h-3 bg-blue-500 rounded-full cursor-pointer hover:bg-blue-600 transition-colors
          ${props.pendingConnection?.fromId === props.id && props.pendingConnection?.fromSide === 'left' ? 'ring-2 ring-blue-300 ring-offset-2' : ''}
          ${filteredConnections.length > 0 ? 'ring-2 ring-gray-300' : ''}
        `}
        style={{
          left: '-6px',
          top: '50%',
          transform: 'translateY(-50%)',
        }}
        onClick={(e) => {
          e.stopPropagation();
          onConnect(props.id, 'left');
        }}
      />
      
      {/* Header with title and delete */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex-1 mr-2 text-sm font-medium truncate">
          Collector
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            props.onDelete();
          }}
          className="p-1 rounded-md hover:bg-gray-100 text-gray-600 hover:text-gray-800"
        >
          <Calculator className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Total Value */}
      <div className="text-lg font-semibold mb-3">
        ${total.toFixed(2)}
      </div>
    </div>
  );
};

export default TotalBox; 