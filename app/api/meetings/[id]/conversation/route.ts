import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3'
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { agentId, conversationHistory } = await request.json();

    const meeting = await prisma.meeting.findUnique({
      where: { id: params.id },
      include: { agents: true },
    });

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    const agent = meeting.agents.find((a: { id: string }) => a.id === agentId);
    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const traits = JSON.parse(agent.traits as string);
    const expertise = JSON.parse(agent.expertise as string);

    const systemPrompt = `You are ${agent.name}, an AI agent with the following traits: ${traits.join(', ')}. 
Your expertise includes: ${expertise.join(', ')}.
Your role: ${agent.description}

The topic of discussion is: ${meeting.topic}
${meeting.description ? `Additional context: ${meeting.description}` : ''}

Please provide your perspective on this topic in a concise, professional manner while staying in character.
Consider the previous discussion and respond appropriately to continue the conversation.
Keep your response focused and limit it to 2-3 paragraphs.`;

    const messages = [
      { role: "system", content: systemPrompt },
      ...conversationHistory.map((entry: { agentName: string; message: string }) => ({
        role: "assistant",
        content: `${entry.agentName}: ${entry.message}`,
        name: entry.agentName.replace(/\s+/g, '_').toLowerCase()
      })),
      { 
        role: "user", 
        content: conversationHistory.length === 0 
          ? "Please share your initial thoughts on the topic." 
          : "Please continue the discussion, considering what others have said." 
      }
    ];

    const completion = await openai.chat.completions.create({
      model: "ep-20241223172831-lkrk2",
      messages,
      temperature: 0.7,
      max_tokens: 500,
    });

    const response = completion.choices[0].message.content;

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Error in conversation:', error);
    return NextResponse.json(
      { error: 'Error generating conversation' },
      { status: 500 }
    );
  }
} 