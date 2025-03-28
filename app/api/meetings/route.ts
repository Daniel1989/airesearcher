import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, topic, description, agentIds } = body;

    const meeting = await prisma.meeting.create({
      data: {
        title,
        topic,
        description,
        agents: {
          connect: agentIds.map((id: string) => ({ id })),
        },
      },
      include: {
        agents: true,
      },
    });

    return NextResponse.json(meeting);
  } catch (error) {
    console.error('Error creating meeting:', error);
    return NextResponse.json(
      { error: 'Error creating meeting' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const meetings = await prisma.meeting.findMany({
      include: {
        agents: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(meetings);
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return NextResponse.json(
      { error: 'Error fetching meetings' },
      { status: 500 }
    );
  }
} 