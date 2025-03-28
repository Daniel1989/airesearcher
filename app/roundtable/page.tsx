'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Meeting } from '@/lib/types/meeting';
import { History, MessageCircle, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import NewMeetingDialog from './components/new-meeting-dialog';

interface MeetingWithMessages extends Meeting {
  messages: {
    id: string;
    round: number;
  }[];
}

export default function RoundtablePage() {
  const [meetings, setMeetings] = useState<MeetingWithMessages[]>([]);
  const [isNewMeetingOpen, setIsNewMeetingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchMeetings() {
      try {
        const response = await fetch('/api/meetings');
        if (!response.ok) throw new Error('Failed to fetch meetings');
        const data = await response.json();
        setMeetings(data);
      } catch (error) {
        console.error('Error fetching meetings:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchMeetings();
  }, []);

  const handleStartMeeting = async (meetingId: string) => {
    try {
      const response = await fetch(`/api/meetings/${meetingId}/start`, {
        method: 'POST',
      });
      if (!response.ok) throw new Error('Failed to start meeting');
      
      router.push(`/roundtable/${meetingId}`);
    } catch (error) {
      console.error('Error starting meeting:', error);
    }
  };

  const handleViewDetails = (meetingId: string) => {
    router.push(`/roundtable/${meetingId}/details`);
  };

  const handleViewHistory = (meetingId: string) => {
    router.push(`/roundtable/${meetingId}`);
  };

  return (
    <main className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Roundtable Meetings</h1>
        <Button onClick={() => setIsNewMeetingOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Meeting
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading meetings...</div>
      ) : meetings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No meetings yet. Create one to get started!
        </div>
      ) : (
        <div className="grid gap-6">
          {meetings.map((meeting) => {
            const totalRounds = meeting.messages.length > 0 
              ? Math.max(...meeting.messages.map(m => m.round))
              : 0;
            
            return (
              <Card key={meeting.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{meeting.title}</span>
                    {meeting.messages.length > 0 && (
                      <span className="text-sm font-normal text-muted-foreground flex items-center gap-1">
                        <MessageCircle className="h-4 w-4" />
                        {meeting.messages.length} messages • {totalRounds} rounds
                      </span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p className="text-muted-foreground">{meeting.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="font-medium">Topic:</span>
                      <span>{meeting.topic}</span>
                      <span className="font-medium">Status:</span>
                      <span className="capitalize">{meeting.status}</span>
                      <span className="font-medium">Participants:</span>
                      <span>{meeting.agents?.length || 0} agents</span>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleViewDetails(meeting.id)}
                      >
                        View Details
                      </Button>
                      {meeting.messages.length > 0 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewHistory(meeting.id)}
                        >
                          <History className="h-4 w-4 mr-2" />
                          View History
                        </Button>
                      )}
                      {meeting.status === 'pending' && (
                        <Button 
                          size="sm"
                          onClick={() => handleStartMeeting(meeting.id)}
                        >
                          Start Meeting
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <NewMeetingDialog
        open={isNewMeetingOpen}
        onOpenChange={setIsNewMeetingOpen}
        onMeetingCreated={(meeting: Meeting) => {
          setMeetings((prev) => [{
            ...meeting,
            messages: []
          } as MeetingWithMessages, ...prev]);
        }}
      />
    </main>
  );
} 