import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { conductAgentResearch } from '@/app/lib/research';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL
});

const languageInstructions = {
  chinese: "请用中文回答，保持专业和简洁。",
  english: "Please respond in English, maintaining professionalism and conciseness.",
  japanese: "専門的で簡潔な日本語で回答してください。"
};

// GET endpoint to retrieve stored conversation
export async function GET(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const messages = await prisma.message.findMany({
      where: { 
        meetingId: id 
      },
      orderBy: {
        createdAt: 'asc'
      },
      include: {
        agent: true
      }
    });

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error retrieving conversation:', error);
    return NextResponse.json(
      { error: 'Error retrieving conversation' },
      { status: 500 }
    );
  }
}

// POST endpoint to generate and store new message
export async function POST(request: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { id } = params;

  try {
    const { agentId, conversationHistory } = await request.json();

    const [meeting, agent] = await Promise.all([
      prisma.meeting.findUnique({
        where: { id },
        include: { agents: true }
      }),
      prisma.agent.findUnique({
        where: { id: agentId }
      })
    ]);

    if (!meeting) {
      return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
    }

    if (!agent) {
      return NextResponse.json({ error: 'Agent not found' }, { status: 404 });
    }

    const traits = JSON.parse(agent.traits);
    const expertise = JSON.parse(agent.expertise);

    let response: string;
    const round = Math.floor(conversationHistory.length / meeting.agents.length) + 1;

    if (round === 1 && conversationHistory.length === 0) {
      // For first round, first agent: Conduct research and form opinion
      const researchResult = await conductAgentResearch({
        topic: meeting.topic,
        agentName: agent.name,
        traits,
        expertise,
        description: meeting.description || '',
        language: meeting.language
      });

      response = researchResult.conclusion;
    } else {
      // For subsequent contributions, use the original conversation flow
      const systemPrompt = `You are ${agent.name}, an AI agent with the following traits: ${traits.join(', ')}. 
Your expertise includes: ${expertise.join(', ')}.
Your role: ${agent.description}

The topic of discussion is: ${meeting.topic}
${meeting.description || ''}

${languageInstructions[meeting.language as keyof typeof languageInstructions]}

Please provide your perspective on this topic in a concise, professional manner while staying in character.
Consider the previous discussion and respond appropriately to continue the conversation.
Keep your response focused and limit it to 2-3 paragraphs.`;

      const messages = [
        { role: "system", content: systemPrompt },
        ...conversationHistory.filter((entry: { agentName: string; message: string }) => !!entry.message).map((entry: { agentName: string; message: string }) => ({
          role: "assistant",
          content: `[${entry.agentName}] ${entry.message}`,
          // name: entry.agentName.replace(/\s+/g, '_').toLowerCase()
        })),
        { 
          role: "user", 
          content: meeting.language === "chinese"
            ? "请继续讨论，考虑其他人的观点。"
            : meeting.language === "japanese"
            ? "他の人の意見を考慮しながら、議論を続けてください。"
            : "Please continue the discussion, considering what others have said."
        }
      ];
      try {
        const completion = await fetch(`${process.env.BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
          },
          body: JSON.stringify({
            model: "gemini-2.0-flash",
            messages,
          })
        }).then(res => res.json());
        response = completion.choices[0].message.content || '';
      } catch (error:any) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json(
          { error: 'Error generating conversation' },
          { status: 500 }
        );
      }
    }

    // Store the message in the database
    const storedMessage = await prisma.message.create({
      data: {
        meetingId: id,
        agentId: agent.id,
        agentName: agent.name,
        content: response,
        round
      }
    });

    return NextResponse.json({ response, messageId: storedMessage.id });
  } catch (error) {
    console.error('Error in conversation:', error);
    return NextResponse.json(
      { error: 'Error generating conversation' },
      { status: 500 }
    );
  }
} 