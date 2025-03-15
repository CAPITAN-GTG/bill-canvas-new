'use client';

import React, { useState } from 'react';
import DraggableItem from './DraggableItem';
import { Wallet, Receipt, TrendingUp, PanelLeftClose, PanelLeft, DollarSign } from 'lucide-react';

const ITEMS = [
  { 
    type: 'bill',
    label: 'Bill',
    color: '#EF4444',
    icon: Receipt,
    defaultValue: '$ 0.00'
  },
  { 
    type: 'income',
    label: 'Income',
    color: '#10B981',
    icon: Wallet,
    defaultValue: '$ 0.00'
  },
  { 
    type: 'investment',
    label: 'Investment',
    color: '#8B5CF6',
    icon: TrendingUp,
    defaultValue: '$ 0.00',
    investmentReturn: '0.00'
  },
];

interface ToolbarProps {
  isTotalBoxDropped: boolean;
}

const Toolbar: React.FC<ToolbarProps> = ({ isTotalBoxDropped }) => {
  const [isOpen, setIsOpen] = useState(true);

  const handleTotalBoxDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('application/json', JSON.stringify({ 
      type: 'total',
      label: 'Collector',
      color: '#6366F1',
      defaultValue: '$ 0.00'
    }));
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed top-4 left-4 z-50 p-2 rounded-lg bg-white shadow-md text-gray-600 hover:text-gray-800 transition-all ${
          isOpen ? 'ml-64' : 'ml-0'
        }`}
      >
        {isOpen ? <PanelLeftClose className="w-5 h-5" /> : <PanelLeft className="w-5 h-5" />}
      </button>
      <aside
        className={`fixed top-4 left-4 bg-white shadow-lg transition-all duration-300 ease-in-out z-40 rounded-lg ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="w-64">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-black">Financial Blocks</h2>
            <p className="text-sm text-gray-500 mt-1">Drag blocks to the canvas</p>
          </div>
          <div className="p-4">
            <div className="space-y-3">
              {!isTotalBoxDropped && (
                <div
                  draggable
                  onDragStart={handleTotalBoxDragStart}
                  className="p-3 rounded-lg bg-white border border-gray-100 text-black cursor-move hover:shadow-md transition-all group"
                  style={{ borderLeftWidth: '4px', borderLeftColor: '#6366F1' }}
                >
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <DollarSign className="w-5 h-5 text-gray-500 group-hover:text-gray-700" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">Collector</div>
                      <div className="text-sm text-gray-500 truncate">$ 0.00</div>
                    </div>
                  </div>
                </div>
              )}
              {ITEMS.map((item) => (
                <DraggableItem
                  key={item.type}
                  type={item.type}
                  label={item.label}
                  color={item.color}
                  icon={item.icon}
                  defaultValue={item.defaultValue}
                />
              ))}
            </div>
          </div>
          <div className="p-4 border-t border-gray-200 bg-gray-50 rounded-b-lg">
            <p className="text-xs text-gray-500 text-center">
              Connect boxes to calculate totals
            </p>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Toolbar; 