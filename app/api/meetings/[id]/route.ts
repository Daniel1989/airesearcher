import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const meeting = await prisma.meeting.findUnique({
      where: {
        id: await params.id,
      },
      include: {
        agents: true,
        messages: true,
      },
    });

    if (!meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error fetching meeting:', error);
    return NextResponse.json(
      { error: 'Error fetching meeting' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const meeting = await prisma.meeting.delete({
      where: {
        id: await params.id,
      },
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error deleting meeting:', error);
    return NextResponse.json(
      { error: 'Error deleting meeting' },
      { status: 500 }
    );
  }
} 