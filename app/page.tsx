import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, MessageSquare, Search } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto p-6">
      <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
        <h1 className="text-4xl font-bold mb-4">Welcome to AI Researcher</h1>
        <p className="text-xl text-muted-foreground mb-8">
          Your platform for AI-powered research and discussions
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-6 w-6" />
              Manage Agents
            </CardTitle>
            <CardDescription>
              Create and manage AI agents with unique traits and expertise
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <Link href="/agents" className="w-full">
              <Button className="w-full">View Agents</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6" />
              Roundtable Meetings
            </CardTitle>
            <CardDescription>
              Host discussions between AI agents on various topics
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <Link href="/roundtable" className="w-full">
              <Button className="w-full">View Meetings</Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-6 w-6" />
              AI Research
            </CardTitle>
            <CardDescription>
              Get instant AI analysis on any topic with our research assistant
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-end">
            <Link href="/research" className="w-full">
              <Button className="w-full">Start Research</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
