import { NextRequest } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { connectToDatabase } from '../../../utils/connectDB';
import { CanvasModel } from '../../../../models/canvases';

// GET specific canvas
export async function GET(
  request: NextRequest,
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return Response.json({ error: 'Canvas ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const canvas = await CanvasModel.findOne({ _id: id, userId }).lean();
    
    if (!canvas) {
      return Response.json({ error: 'Canvas not found' }, { status: 404 });
    }

    return Response.json(canvas);
  } catch (error) {
    console.error('Error fetching canvas:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PUT update canvas
export async function PUT(
  request: NextRequest,
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return Response.json({ error: 'Canvas ID is required' }, { status: 400 });
    }

    const body = await request.json();
    await connectToDatabase();
    
    const canvas = await CanvasModel.findOneAndUpdate(
      { _id: id, userId },
      { $set: body },
      { new: true, lean: true }
    );
    
    if (!canvas) {
      return Response.json({ error: 'Canvas not found' }, { status: 404 });
    }

    return Response.json(canvas);
  } catch (error) {
    console.error('Error updating canvas:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE canvas
export async function DELETE(
  request: NextRequest,
) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const id = request.nextUrl.pathname.split('/').pop();
    if (!id) {
      return Response.json({ error: 'Canvas ID is required' }, { status: 400 });
    }

    await connectToDatabase();
    const canvas = await CanvasModel.findOneAndDelete({ _id: id, userId }).lean();
    
    if (!canvas) {
      return Response.json({ error: 'Canvas not found' }, { status: 404 });
    }

    return Response.json({
      message: 'Canvas deleted successfully',
      id
    });
  } catch (error) {
    console.error('Error deleting canvas:', error);
    return Response.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 