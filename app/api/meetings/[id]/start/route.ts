import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const meeting = await prisma.meeting.update({
      where: {
        id: params.id,
      },
      data: {
        status: 'active',
      },
      include: {
        agents: true,
      },
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error starting meeting:', error);
    return NextResponse.json(
      { error: 'Error starting meeting' },
      { status: 500 }
    );
  }
} 