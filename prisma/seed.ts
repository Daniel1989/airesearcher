import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Delete existing records
  await prisma.agent.deleteMany();

  // Create initial agents
  const agents = [
    {
      name: 'Research Assistant',
      description: 'A helpful assistant focused on academic research and analysis',
      traits: JSON.stringify(['analytical', 'precise', 'thorough']),
      expertise: JSON.stringify(['academic writing', 'data analysis', 'literature review']),
      tone: 'academic',
      language: 'English',
    },
    {
      name: 'Creative Writer',
      description: 'An imaginative assistant for creative writing and storytelling',
      traits: JSON.stringify(['creative', 'expressive', 'engaging']),
      expertise: JSON.stringify(['storytelling', 'content creation', 'creative writing']),
      tone: 'friendly',
      language: 'English',
    },
    {
      name: 'Technical Expert',
      description: 'A technical assistant specializing in programming and development',
      traits: JSON.stringify(['technical', 'detail-oriented', 'systematic']),
      expertise: JSON.stringify(['programming', 'system design', 'debugging']),
      tone: 'professional',
      language: 'English',
    },
  ];

  for (const agent of agents) {
    await prisma.agent.create({
      data: agent,
    });
  }

  console.log('Database has been seeded');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 