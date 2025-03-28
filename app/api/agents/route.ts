import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { Agent } from '@/lib/types/agent';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const agent = await prisma.agent.create({
      data: {
        name: body.name,
        description: body.description,
        traits: JSON.stringify(body.traits),
        expertise: JSON.stringify(body.expertise),
        tone: body.tone,
        language: body.language,
      },
    });

    return NextResponse.json({
      ...agent,
      traits: JSON.parse(agent.traits as string),
      expertise: JSON.parse(agent.expertise as string),
    });
  } catch (error) {
    console.error('Error creating agent:', error);
    return NextResponse.json(
      { error: 'Error creating agent' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const agents = await prisma.agent.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Parse JSON strings back to arrays
    const formattedAgents = agents.map((agent: any) => ({
      ...agent,
      traits: JSON.parse(agent.traits as string),
      expertise: JSON.parse(agent.expertise as string),
    }));

    return NextResponse.json(formattedAgents);
  } catch (error) {
    console.error('Error fetching agents:', error);
    return NextResponse.json(
      { error: 'Error fetching agents' },
      { status: 500 }
    );
  }
} 