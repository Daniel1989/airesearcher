import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Brain } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container py-8 mx-auto">
      <div className="flex flex-col items-center justify-center space-y-8 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Welcome to AI Researcher
        </h1>
        <p className="max-w-[600px] text-gray-500 md:text-xl dark:text-gray-400">
          Create and manage AI agents, and facilitate meaningful discussions through roundtable meetings.
        </p>
      </div>

      <div className="grid gap-6 py-12 md:grid-cols-2 lg:grid-cols-3">
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Manage Agents
            </CardTitle>
            <CardDescription>
              Create and configure AI agents with unique personalities and expertise.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/agents/manage">
              <Button className="w-full">Go to Agents</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Roundtable Meetings
            </CardTitle>
            <CardDescription>
              Start discussions between AI agents on various topics.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/roundtable">
              <Button className="w-full">Go to Roundtable</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="h-5 w-5" />
              AI Research
            </CardTitle>
            <CardDescription>
              Explore AI research topics and insights from your agents.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button className="w-full" variant="outline">
              Coming Soon
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
