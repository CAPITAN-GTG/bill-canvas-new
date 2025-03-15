'use client';

import React, { useState, useEffect } from 'react';
import { Connection } from './boxes/BaseBox';
import BillBox from './boxes/BillBox';
import IncomeBox from './boxes/IncomeBox';
import InvestmentBox from './boxes/InvestmentBox';
import TotalBox from './boxes/TotalBox';
import ConnectionLine from './ConnectionLine';
import TotalBar from './TotalBar';
import { calculateTotals } from '../utils/calculations';

interface DroppedItem {
  id: string;
  type: 'bill' | 'income' | 'investment' | 'total';
  name: string;
  label: string;
  color: string;
  position: { x: number; y: number };
  value: string;
  investmentReturn?: string;
}

interface Position {
  x: number;
  y: number;
}

interface CanvasProps {
  onTotalBoxDrop: () => void;
  onTotalBoxDelete: () => void;
  items: DroppedItem[];
  connections: Connection[];
  onItemsChange: (items: DroppedItem[]) => void;
  onConnectionsChange: (connections: Connection[]) => void;
}

const GRID_SIZE = 20;
const MIN_CANVAS_WIDTH = 2000;  // Minimum width to ensure enough space
const MIN_CANVAS_HEIGHT = 2000; // Minimum height to ensure enough space

const Canvas: React.FC<CanvasProps> = ({ 
  onTotalBoxDrop, 
  onTotalBoxDelete,
  items,
  connections,
  onItemsChange,
  onConnectionsChange
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{
    fromId: string;
    fromSide: 'left' | 'right';
  } | null>(null);
  const [totals, setTotals] = useState({ total: 0, totalInvestments: 0, investmentReturns: 0 });

  useEffect(() => {
    const newTotals = calculateTotals(items, connections);
    setTotals(newTotals);
  }, [items, connections]);

  const snapToGrid = (x: number, y: number): Position => {
    return {
      x: Math.round(x / GRID_SIZE) * GRID_SIZE,
      y: Math.round(y / GRID_SIZE) * GRID_SIZE,
    };
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const canvasRect = e.currentTarget.getBoundingClientRect();
    const scrollLeft = (e.currentTarget as HTMLDivElement).scrollLeft;
    const scrollTop = (e.currentTarget as HTMLDivElement).scrollTop;
    
    const position = snapToGrid(
      e.clientX - canvasRect.left + scrollLeft,
      e.clientY - canvasRect.top + scrollTop
    );
    
    try {
      const data = JSON.parse(e.dataTransfer.getData('application/json'));
      
      if (data.type === 'total' && items.some(item => item.type === 'total')) {
        return;
      }

      const newItem: DroppedItem = {
        id: Math.random().toString(36).substr(2, 9),
        name: `${data.label} ${items.filter(item => item.type === data.type).length + 1}`,
        ...data,
        position,
        value: data.defaultValue,
        investmentReturn: data.type === 'investment' ? '0' : undefined,
      };
      
      onItemsChange([...items, newItem]);
      
      if (data.type === 'total') {
        onTotalBoxDrop();
      }
    } catch (error) {
      console.log('No new item data');
    }
  };

  const handleDelete = (id: string) => {
    const itemToDelete = items.find(item => item.id === id);
    if (itemToDelete?.type === 'total') {
      onTotalBoxDelete();
    }
    onItemsChange(items.filter(item => item.id !== id));
    onConnectionsChange(connections.filter(conn => conn.from !== id && conn.to !== id));
  };

  const handleEdit = (id: string) => {
    setEditingId(id);
  };

  const handleValueChange = (id: string, newValue: string) => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
        return { ...item, value: newValue };
      }
      return item;
    }));
  };

  const handleNameChange = (id: string, newName: string) => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
        return { ...item, name: newName };
      }
      return item;
    }));
  };

  const handleConnect = (fromId: string, fromSide: 'left' | 'right') => {
    if (pendingConnection) {
      if (pendingConnection.fromId !== fromId) {
        const newConnection: Connection = {
          id: Math.random().toString(36).substr(2, 9),
          from: pendingConnection.fromId,
          to: fromId,
          fromSide: pendingConnection.fromSide,
          toSide: fromSide,
        };
        onConnectionsChange([...connections, newConnection]);
      }
      setPendingConnection(null);
    } else {
      setPendingConnection({ fromId, fromSide });
    }
  };

  const handleValueBlur = () => {
    setEditingId(null);
  };

  const handleValueKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      setEditingId(null);
    }
  };

  const moveItem = (id: string, direction: 'up' | 'down' | 'left' | 'right') => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
        const newPosition = { ...item.position };
        switch (direction) {
          case 'up':
            newPosition.y = Math.max(0, newPosition.y - GRID_SIZE);
            break;
          case 'down':
            newPosition.y = Math.min(MIN_CANVAS_HEIGHT - GRID_SIZE, newPosition.y + GRID_SIZE);
            break;
          case 'left':
            newPosition.x = Math.max(0, newPosition.x - GRID_SIZE);
            break;
          case 'right':
            newPosition.x = Math.min(MIN_CANVAS_WIDTH - GRID_SIZE, newPosition.x + GRID_SIZE);
            break;
        }
        return { ...item, position: newPosition };
      }
      return item;
    }));
  };

  const handleDeleteConnection = (connectionId: string) => {
    onConnectionsChange(connections.filter(conn => conn.id !== connectionId));
  };

  return (
    <>
      <div
        className="w-full h-full overflow-auto bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div 
          className="relative"
          style={{
            width: MIN_CANVAS_WIDTH,
            height: MIN_CANVAS_HEIGHT,
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
          }}
        >
          {connections.map((connection) => {
            const fromItem = items.find(item => item.id === connection.from);
            const toItem = items.find(item => item.id === connection.to);
            if (fromItem && toItem) {
              return (
                <ConnectionLine
                  key={connection.id}
                  connection={connection}
                  sourcePosition={fromItem.position}
                  targetPosition={toItem.position}
                  onDelete={handleDeleteConnection}
                />
              );
            }
            return null;
          })}

          {items.map((item) => {
            if (item.type === 'total') {
              return (
                <TotalBox
                  key={item.id}
                  id={item.id}
                  position={item.position}
                  total={totals.total}
                  onConnect={handleConnect}
                  onDelete={handleDelete}
                  pendingConnection={pendingConnection}
                  connections={connections}
                />
              );
            }

            const commonProps = {
              id: item.id,
              name: item.name,
              value: item.value,
              position: item.position,
              onEdit: () => handleEdit(item.id),
              onDelete: () => handleDelete(item.id),
              onValueChange: (value: string) => handleValueChange(item.id, value),
              onNameChange: (name: string) => handleNameChange(item.id, name),
              onConnect: handleConnect,
              onMove: (direction: 'up' | 'down' | 'left' | 'right') => moveItem(item.id, direction),
              isEditing: editingId === item.id,
              pendingConnection,
              connections,
            };

            switch (item.type) {
              case 'bill':
                return <BillBox key={item.id} {...commonProps} amount={parseFloat(item.value)} />;
              case 'income':
                return <IncomeBox key={item.id} {...commonProps} amount={parseFloat(item.value)} />;
              case 'investment':
                return (
                  <InvestmentBox
                    key={item.id}
                    {...commonProps}
                    amount={parseFloat(item.value)}
                    investmentReturn={parseFloat(item.investmentReturn || '0')}
                  />
                );
              default:
                return null;
            }
          })}
        </div>
      </div>

      <TotalBar
        total={totals.total}
        totalInvestments={totals.totalInvestments}
        investmentReturns={totals.investmentReturns}
      />
    </>
  );
};

export default Canvas; 