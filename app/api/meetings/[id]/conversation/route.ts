import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: 'https://ark.cn-beijing.volces.com/api/v3'
});

const languageInstructions = {
  chinese: "请用中文回答，保持专业和简洁。",
  english: "Please respond in English, maintaining professionalism and conciseness.",
  japanese: "専門的で簡潔な日本語で回答してください。"
};

// GET endpoint to retrieve stored conversation
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
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
export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
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

    const systemPrompt = `You are ${agent.name}, an AI agent with the following traits: ${traits.join(', ')}. 
Your expertise includes: ${expertise.join(', ')}.
Your role: ${agent.description}

The topic of discussion is: ${meeting.topic}
${meeting.description ? `Additional context: ${meeting.description}` : ''}

${languageInstructions[meeting.language as keyof typeof languageInstructions]}

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
          ? meeting.language === "chinese" 
            ? "请分享您对这个话题的初步想法。"
            : meeting.language === "japanese"
            ? "このトピックについての最初の考えを共有してください。"
            : "Please share your initial thoughts on the topic."
          : meeting.language === "chinese"
            ? "请继续讨论，考虑其他人的观点。"
            : meeting.language === "japanese"
            ? "他の人の意見を考慮しながら、議論を続けてください。"
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

    // Store the message in the database
    const storedMessage = await prisma.message.create({
      data: {
        meetingId: id,
        agentId: agent.id,
        agentName: agent.name,
        content: response,
        round: Math.floor(conversationHistory.length / meeting.agents.length) + 1
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