import mongoose, { Schema } from 'mongoose';

// Interfaces
interface Position {
  x: number;
  y: number;
}

interface Connection {
  id: string;
  from: string;
  to: string;
  fromSide: 'left' | 'right';
  toSide: 'left' | 'right';
}

interface CanvasItem {
  id: string;
  type: 'bill' | 'income' | 'investment' | 'total';
  name: string;
  label: string;
  color: string;
  position: Position;
  value: string;
  investmentReturn?: string;
}

interface Canvas {
  userId: string;
  name: string;
  items: CanvasItem[];
  connections: Connection[];
  createdAt: Date;
  updatedAt: Date;
}

// Schemas
const PositionSchema = new Schema<Position>({
  x: { type: Number, required: true },
  y: { type: Number, required: true }
});

const ConnectionSchema = new Schema<Connection>({
  id: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  fromSide: { type: String, enum: ['left', 'right'], required: true },
  toSide: { type: String, enum: ['left', 'right'], required: true }
});

const CanvasItemSchema = new Schema<CanvasItem>({
  id: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['bill', 'income', 'investment', 'total'], 
    required: true 
  },
  name: { type: String, required: true },
  label: { type: String, required: true },
  color: { type: String, required: true },
  position: { type: PositionSchema, required: true },
  value: { type: String, required: true },
  investmentReturn: { type: String }
});

const CanvasSchema = new Schema<Canvas>({
  userId: { 
    type: String, 
    required: true,
    index: true
  },
  name: { 
    type: String, 
    required: [true, 'Canvas name is required'],
    trim: true,
    minlength: [3, 'Canvas name must be at least 3 characters long'],
    maxlength: [50, 'Canvas name cannot exceed 50 characters']
  },
  items: [CanvasItemSchema],
  connections: [ConnectionSchema],
}, {
  timestamps: true
});

// Create compound index for unique canvas names per user
CanvasSchema.index({ userId: 1, name: 1 }, { unique: true });

// Export the model
export const CanvasModel = mongoose.models.Canvas || mongoose.model('Canvas', CanvasSchema);

// Export interfaces for use in components
export type { Canvas, CanvasItem, Connection, Position };
