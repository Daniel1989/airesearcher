import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  
  try {
    const meeting = await prisma.meeting.update({
      where: {
        id,
      },
      data: {
        status: 'active',
      },
      include: {
        agents: true,
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
    console.error('Error starting meeting:', error);
    return NextResponse.json(
      { error: 'Error starting meeting' },
      { status: 500 }
    );
  }
} 