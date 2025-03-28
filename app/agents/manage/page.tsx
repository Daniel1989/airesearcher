'use client';

import { AgentForm } from '@/app/components/agents/agent-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Agent } from '@/lib/types/agent';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export default function ManageAgentsPage() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchAgents();
  }, []);

  async function fetchAgents() {
    try {
      const response = await fetch('/api/agents');
      if (!response.ok) throw new Error('Failed to fetch agents');
      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
      toast.error('Failed to load agents');
    }
  }

  async function handleCreateAgent(data: any) {
    setIsLoading(true);
    try {
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to create agent');
      
      toast.success('Agent created successfully');
      fetchAgents(); // Refresh the list
    } catch (error) {
      console.error('Error creating agent:', error);
      toast.error('Failed to create agent');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Manage AI Agents</h1>
      
      <div className="grid gap-8 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Add New Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <AgentForm
              onSubmit={handleCreateAgent}
              isLoading={isLoading}
            />
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Existing Agents</h2>
          {agents.map((agent) => (
            <Card key={agent.id}>
              <CardHeader>
                <CardTitle>{agent.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  {agent.description}
                </p>
                <div className="space-y-2">
                  <div>
                    <h3 className="font-medium">Traits:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {agent.traits.map((trait) => (
                        <span
                          key={trait}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium">Expertise:</h3>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {agent.expertise.map((expertise) => (
                        <span
                          key={expertise}
                          className="px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                        >
                          {expertise}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="flex gap-4 text-sm text-muted-foreground">
                    <span>Tone: {agent.tone}</span>
                    <span>Language: {agent.language}</span>
                    <span>Status: {agent.isActive ? 'Active' : 'Inactive'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
} 