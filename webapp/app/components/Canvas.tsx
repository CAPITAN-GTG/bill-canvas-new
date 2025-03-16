'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
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
const MIN_ZOOM = 0.25;
const MAX_ZOOM = 2;
const ZOOM_SPEED = 0.1;

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
  const [zoom, setZoom] = useState(1);
  const [draggingItem, setDraggingItem] = useState<string | null>(null);
  const dragStartPos = useRef<{ x: number; y: number } | null>(null);
  const itemStartPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const newTotals = calculateTotals(items, connections);
    setTotals(newTotals);
  }, [items, connections]);

  const handleWheel = useCallback((e: Event) => {
    if ((e as WheelEvent).ctrlKey) {
      e.preventDefault();
      const wheelEvent = e as WheelEvent;
      const delta = wheelEvent.deltaY > 0 ? -ZOOM_SPEED : ZOOM_SPEED;
      setZoom(prevZoom => {
        const newZoom = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, prevZoom + delta));
        return newZoom;
      });
    }
  }, []);

  useEffect(() => {
    const canvas = document.querySelector('.canvas-container');
    if (canvas) {
      canvas.addEventListener('wheel', handleWheel, { passive: false });
      return () => {
        canvas.removeEventListener('wheel', handleWheel);
      };
    }
  }, [handleWheel]);

  const getCanvasCoordinates = (clientX: number, clientY: number): Position => {
    const canvas = document.querySelector('.canvas-container');
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scrollLeft = (canvas as HTMLDivElement).scrollLeft;
    const scrollTop = (canvas as HTMLDivElement).scrollTop;

    // Calculate position considering zoom level
    const x = (clientX - rect.left + scrollLeft) / zoom;
    const y = (clientY - rect.top + scrollTop) / zoom;

    return snapToGrid(x, y);
  };

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
    const position = getCanvasCoordinates(e.clientX, e.clientY);
    
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

  const handleMouseDown = (e: React.MouseEvent, itemId: string) => {
    if (e.button !== 0) return; // Only handle left mouse button
    e.stopPropagation();
    
    const item = items.find(i => i.id === itemId);
    if (!item) return;

    setDraggingItem(itemId);
    dragStartPos.current = { x: e.clientX, y: e.clientY };
    itemStartPos.current = { ...item.position };

    const handleMouseMove = (e: MouseEvent) => {
      if (!dragStartPos.current || !itemStartPos.current) return;

      const dx = (e.clientX - dragStartPos.current.x) / zoom;
      const dy = (e.clientY - dragStartPos.current.y) / zoom;

      const newPosition = snapToGrid(
        itemStartPos.current.x + dx,
        itemStartPos.current.y + dy
      );

      handlePositionChange(itemId, newPosition);
    };

    const handleMouseUp = () => {
      setDraggingItem(null);
      dragStartPos.current = null;
      itemStartPos.current = null;
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
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

  const handlePositionChange = (id: string, newPosition: Position) => {
    onItemsChange(items.map(item => {
      if (item.id === id) {
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
        className="w-full h-full overflow-auto bg-gray-50 canvas-container"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <div 
          className="relative origin-top-left"
          style={{
            width: MIN_CANVAS_WIDTH,
            height: MIN_CANVAS_HEIGHT,
            backgroundImage: `
              linear-gradient(to right, #e5e7eb 1px, transparent 1px),
              linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)
            `,
            backgroundSize: `${GRID_SIZE * zoom}px ${GRID_SIZE * zoom}px`,
            transform: `scale(${zoom})`,
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
            const isDragging = draggingItem === item.id;
            
            if (item.type === 'total') {
              return (
                <TotalBox
                  key={item.id}
                  id={item.id}
                  name={item.name}
                  position={item.position}
                  total={totals.total}
                  onConnect={handleConnect}
                  onDelete={() => handleDelete(item.id)}
                  pendingConnection={pendingConnection}
                  connections={connections}
                  onPositionChange={(newPosition: Position) => handlePositionChange(item.id, newPosition)}
                  onMouseDown={(e) => handleMouseDown(e, item.id)}
                  isDragging={isDragging}
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
              isEditing: editingId === item.id,
              pendingConnection,
              connections,
              onPositionChange: (newPosition: Position) => handlePositionChange(item.id, newPosition),
              onMouseDown: (e: React.MouseEvent) => handleMouseDown(e, item.id),
              isDragging,
            };

            switch (item.type) {
              case 'bill':
                return <BillBox key={item.id} {...commonProps} amount={item.value} />;
              case 'income':
                return <IncomeBox key={item.id} {...commonProps} amount={item.value} />;
              case 'investment':
                return (
                  <InvestmentBox
                    key={item.id}
                    {...commonProps}
                    amount={item.value}
                    investmentReturn={item.investmentReturn || '0'}
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