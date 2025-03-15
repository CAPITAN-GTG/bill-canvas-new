'use client';

import React from 'react';
import { Connection } from './boxes/BaseBox';

interface ConnectionLineProps {
  connection: Connection;
  sourcePosition: { x: number; y: number };
  targetPosition: { x: number; y: number };
  onDelete: (connectionId: string) => void;
}

const BOX_WIDTH = 200;  // Width of the box
const BOX_HEIGHT = 120; // Approximate height of the box
const GRID_SIZE = 20;   // Size of the grid

const getConnectionPoints = (
  side: 'left' | 'right',
  position: { x: number; y: number }
) => {
  const halfWidth = BOX_WIDTH / 2;

  switch (side) {
    case 'right':
      return { x: position.x + halfWidth, y: position.y };
    case 'left':
      return { x: position.x - halfWidth, y: position.y };
  }
};

const ConnectionLine: React.FC<ConnectionLineProps> = ({
  connection,
  sourcePosition,
  targetPosition,
  onDelete,
}) => {
  const source = getConnectionPoints(connection.fromSide, sourcePosition);
  const target = getConnectionPoints(connection.toSide, targetPosition);

  // Calculate control points for the curve
  const controlPoint1 = { ...source };
  const controlPoint2 = { ...target };

  // Adjust control points based on connection sides
  const CONTROL_OFFSET = GRID_SIZE * 4;

  switch (connection.fromSide) {
    case 'right':
      controlPoint1.x += CONTROL_OFFSET;
      break;
    case 'left':
      controlPoint1.x -= CONTROL_OFFSET;
      break;
  }

  switch (connection.toSide) {
    case 'right':
      controlPoint2.x += CONTROL_OFFSET;
      break;
    case 'left':
      controlPoint2.x -= CONTROL_OFFSET;
      break;
  }

  const path = `M ${source.x} ${source.y} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${target.x} ${target.y}`;

  return (
    <svg
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      <path
        d={path}
        stroke="#94A3B8"
        strokeWidth="2"
        fill="none"
        strokeDasharray="4"
        style={{ pointerEvents: 'auto', cursor: 'pointer' }}
        onClick={() => onDelete(connection.id)}
        className="hover:stroke-red-500 transition-colors"
      />
    </svg>
  );
};

export default ConnectionLine; 