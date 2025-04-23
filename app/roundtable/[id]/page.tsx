'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Meeting } from '@/lib/types/meeting';
import { ArrowLeft, History, Pause, Play, RotateCw, Square } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface StoredMessage {
  id: string;
  agentName: string;
  content: string;
  round: number;
  createdAt: string;
}

export default function MeetingRoomPage() {
  const params = useParams();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentAgentIndex, setCurrentAgentIndex] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [conversation, setConversation] = useState<Array<{ agentName: string; message: string }>>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [round, setRound] = useState(1);
  const [isRestoringConversation, setIsRestoringConversation] = useState(false);

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

  useEffect(() => {
    async function fetchStoredConversation() {
      try {
        setIsRestoringConversation(true);
        const response = await fetch(`/api/meetings/${params.id}/conversation`);
        if (!response.ok) throw new Error('Failed to fetch conversation');
        const messages: StoredMessage[] = await response.json();
        
        if (messages.length > 0) {
          const formattedConversation = messages.map(msg => ({
            agentName: msg.agentName,
            message: msg.content
          }));
          setConversation(formattedConversation);
          setRound(Math.max(...messages.map(msg => msg.round)) + 1);
        }
      } catch (error) {
        console.error('Error fetching conversation:', error);
      } finally {
        setIsRestoringConversation(false);
      }
    }
    
    if (meeting) {
      fetchStoredConversation();
    }
  }, [params.id, meeting]);

  const handleStartConversation = () => {
    setCurrentAgentIndex(0);
    setIsPaused(false);
    if (conversation.length === 0) {
      setRound(1);
    }
  };

  const handlePauseResume = () => {
    setIsPaused(!isPaused);
  };

  const handleStop = () => {
    setCurrentAgentIndex(-1);
    setIsPaused(false);
  };

  const handleNextRound = () => {
    if (currentAgentIndex === -1) {
      setCurrentAgentIndex(0);
      setRound(prev => prev + 1);
      setIsPaused(false);
    }
  };

  useEffect(() => {
    if (!meeting || currentAgentIndex === -1 || isPaused || isThinking) return;

    const currentAgent = meeting.agents[currentAgentIndex];
    if (!currentAgent) return;

    const generateResponse = async () => {
      setIsThinking(true);
      try {
        const response = await fetch(`/api/meetings/${params.id}/conversation`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            agentId: currentAgent.id,
            conversationHistory: conversation
          }),
        });

        if (response.ok) {
          const data = await response.json();

          setConversation(prev => [...prev, {
            agentName: currentAgent.name,
            message: data.response,
          }]);
        };
        // Move to next agent
        setCurrentAgentIndex(prevIndex => 
          prevIndex + 1 >= meeting.agents.length ? -1 : prevIndex + 1
        );
      } catch (error) {
        console.error('Error generating response:', error);
      } finally {
        setIsThinking(false);
      }
    };

    generateResponse();
  }, [currentAgentIndex, meeting, params.id, isPaused, isThinking, conversation]);

  if (isLoading || isRestoringConversation) {
    return (
      <div className="container py-8">
        {isRestoringConversation ? 'Restoring conversation...' : 'Loading meeting...'}
      </div>
    );
  }

  if (!meeting) {
    return <div className="container py-8 mx-auto">Meeting not found</div>;
  }

  return (
    <main className="container py-8 mx-auto">
      <div className="mb-8">
        <Link
          href="/roundtable"
          className="flex items-center text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Exit Meeting
        </Link>
      </div>

      <Card className="mb-8">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center justify-between">
            <span>Meeting Room: {meeting.title}</span>
            {round > 1 && (
              <span className="text-sm font-normal text-muted-foreground">
                Round {round - 1} Completed
              </span>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-medium mb-3">Discussion Topic</h3>
            <p className="text-muted-foreground">{meeting.topic}</p>
          </div>

          <div className="flex gap-3 pt-2">
            {currentAgentIndex === -1 ? (
              <>
                {conversation.length === 0 ? (
                  <Button onClick={handleStartConversation} size="lg">
                    <Play className="h-4 w-4 mr-3" />
                    Start Conversation
                  </Button>
                ) : (
                  <Button onClick={handleNextRound} size="lg">
                    <RotateCw className="h-4 w-4 mr-3" />
                    Start Round {round}
                  </Button>
                )}
              </>
            ) : (
              <div className="flex gap-3">
                <Button onClick={handlePauseResume} size="lg">
                  {isPaused ? (
                    <>
                      <Play className="h-4 w-4 mr-3" />
                      Resume
                    </>
                  ) : (
                    <>
                      <Pause className="h-4 w-4 mr-3" />
                      Pause
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleStop} size="lg">
                  <Square className="h-4 w-4 mr-3" />
                  Stop
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        {conversation.map((entry, index) => {
          const currentRound = Math.floor(index / meeting.agents.length) + 1;
          const isFirstInRound = index % meeting.agents.length === 0;

          return (
            <div key={index} className="space-y-6">
              {isFirstInRound && index > 0 && (
                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-muted" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-sm text-muted-foreground">
                      Round {currentRound}
                    </span>
                  </div>
                </div>
              )}

              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col gap-3">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium text-primary">{entry.agentName}</h4>
                      <span className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                        Round {currentRound}
                      </span>
                    </div>
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.message}</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
        
        {isThinking && (
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="animate-pulse">Thinking...</div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </main>
  );
}