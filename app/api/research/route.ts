import { NextResponse } from 'next/server';
import { conductAgentResearch } from '@/app/lib/research';

export async function POST(request: Request) {
  try {
    const { topic, description, language = 'english' } = await request.json();

    if (!topic) {
      return NextResponse.json(
        { error: 'Topic is required' },
        { status: 400 }
      );
    }

    // Using a default research agent
    const researchAgent = {
      name: "Research Assistant",
      traits: ["analytical", "thorough", "objective"],
      expertise: ["research methodology", "data analysis", "critical thinking", "academic writing"]
    };

    const result = await conductAgentResearch({
      topic,
      agentName: researchAgent.name,
      traits: researchAgent.traits,
      expertise: researchAgent.expertise,
      description,
      language
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in research:', error);
    return NextResponse.json(
      { error: 'Error conducting research' },
      { status: 500 }
    );
  }
} 