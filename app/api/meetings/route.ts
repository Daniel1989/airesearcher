import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const { title, description, topic, language } = await request.json();

    const meeting = await prisma.meeting.create({
      data: {
        title,
        description,
        topic,
        language: language || 'chinese',
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
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        agents: true,
        messages: {
          orderBy: {
            createdAt: 'desc',
          },
          take: 1,
        },
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