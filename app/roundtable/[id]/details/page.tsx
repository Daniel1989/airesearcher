'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Meeting } from '@/lib/types/meeting';
import { ArrowLeft, Users } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function MeetingDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMeeting() {
      try {
        const response = await fetch(`/api/meetings/${params.id}`);
        if (!response.ok) throw new Error('Failed to fetch meeting');
        const data = await response.json();
        setMeeting(data);
      } catch (error) {
        console.error('Error fetching meeting:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMeeting();
  }, [params.id]);

  const handleStartMeeting = async () => {
    try {
      const response = await fetch(`/api/meetings/${params.id}/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start meeting');
      
      // Navigate to the meeting room
      router.push(`/roundtable/${params.id}`);
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  if (isLoading) {
    return <div className="container py-8">Loading meeting details...</div>;
  }

  if (!meeting) {
    return <div className="container py-8">Meeting not found</div>;
  }

  return (
    <main className="container py-8 mx-auto">
      <div className="mb-8">
        <Link
          href="/roundtable"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Meetings
        </Link>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">{meeting.title}</CardTitle>
            <CardDescription>{meeting.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium mb-2">Discussion Topic</h3>
                <p>{meeting.topic}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Status</h3>
                <p className="capitalize">{meeting.status}</p>
              </div>

              <div>
                <h3 className="font-medium mb-2">Participating Agents</h3>
                <div className="space-y-2">
                  {meeting.agents.map((agent) => (
                    <Card key={agent.id}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <Users className="h-5 w-5 mt-1" />
                          <div>
                            <h4 className="font-medium">{agent.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {agent.description}
                            </p>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {JSON.parse(agent.traits as string).map(
                                (trait: string) => (
                                  <span
                                    key={trait}
                                    className="text-xs px-2 py-1 bg-secondary rounded-full"
                                  >
                                    {trait}
                                  </span>
                                )
                              )}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {meeting.status === 'pending' && (
                <div className="flex justify-end mt-6">
                  <Button onClick={handleStartMeeting}>Start Meeting</Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
} 