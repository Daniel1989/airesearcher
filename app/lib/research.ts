import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.BASE_URL
});

const languageInstructions = {
  chinese: "请用中文回答，保持专业和简洁。",
  english: "Please respond in English, maintaining professionalism and conciseness.",
  japanese: "専門的で簡潔な日本語で回答してください。"
};

interface ResearchResult {
  plan: string;
  findings: string;
  conclusion: string;
}

async function createResearchPlan(topic: string, expertise: string[], language: string): Promise<string> {
  const planPrompt = `Given the topic "${topic}" and your expertise in ${expertise.join(', ')},
create a brief research plan outlining:
1. Key aspects to investigate
2. Specific areas where your expertise is relevant
3. Questions that need to be answered

${languageInstructions[language as keyof typeof languageInstructions]}
Keep the plan concise and focused on 2-3 main points.`;

  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: planPrompt }],
  });

  return completion.choices[0].message.content || '';
}

async function conductResearch(topic: string, plan: string, language: string): Promise<string> {
  const researchPrompt = `Based on the research plan:
${plan}

Please analyze the topic "${topic}" and provide:
1. Key findings from your investigation
2. Relevant insights based on the research plan
3. Initial conclusions drawn from the findings

${languageInstructions[language as keyof typeof languageInstructions]}
Keep your research summary focused and analytical.`;

  const completion = await openai.chat.completions.create({
    model: "gemini-2.0-flash",
    messages: [{ role: "user", content: researchPrompt }],
  });

  return completion.choices[0].message.content || '';
}

async function formConclusion(topic: string, plan: string, findings: string, agentName: string, traits: string[], expertise: string[], language: string): Promise<string> {
  const conclusionPrompt = `As ${agentName}, an AI agent with traits: ${traits.join(', ')} 
and expertise in: ${expertise.join(', ')},
based on your research:

Research Plan:
${plan}

Research Findings:
${findings}

Please provide your expert conclusion on the topic: "${topic}"

${languageInstructions[language as keyof typeof languageInstructions]}

Focus on providing insights that leverage your expertise and research findings.
Keep your response professional and concise (2-3 paragraphs).`;
  try {
    const completion = await openai.chat.completions.create({
      model: "gemini-2.0-flash",
      messages: [{ role: "system", content: conclusionPrompt }],
    });
    return completion.choices[0].message.content || '';
  } catch (error:any) {
    console.error('Error in formConclusion:', error);
    return '';
  }
}

interface ResearchParams {
  topic: string;
  agentName: string;
  traits: string[];
  expertise: string[];
  description?: string;
  language: string;
}

export async function conductAgentResearch({
  topic,
  agentName,
  traits,
  expertise,
  description = '',
  language
}: ResearchParams): Promise<ResearchResult> {
  // Step 1: Create research plan
  const plan = await createResearchPlan(topic, expertise, language);
  
  // Step 2: Conduct research based on the plan
  const findings = await conductResearch(topic, plan, language);
  
  // Step 3: Form conclusion based on research
  const conclusion = await formConclusion(
    topic,
    plan,
    findings,
    agentName,
    traits,
    expertise,
    language
  );

  return {
    plan,
    findings,
    conclusion
  };
} 