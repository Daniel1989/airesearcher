'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Meeting } from '@/lib/types/meeting';
import { useState, useEffect } from 'react';
import { MultiSelect } from '@/components/ui/multi-select';
import { LanguageSelector } from '@/app/components/language-selector';
import { toast } from 'sonner';

interface NewMeetingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMeetingCreated: (meeting: Meeting) => void;
}

export default function NewMeetingDialog({
  open,
  onOpenChange,
  onMeetingCreated,
}: NewMeetingDialogProps) {
  const [title, setTitle] = useState('');
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
  const [language, setLanguage] = useState('chinese');
  const [isLoading, setIsLoading] = useState(false);
  const [agents, setAgents] = useState<Array<{ id: string; name: string }>>([]);

  // Fetch available agents when dialog opens
  useEffect(() => {
    async function fetchAgents() {
      try {
        const response = await fetch('/api/agents');
        if (!response.ok) throw new Error('Failed to fetch agents');
        const data = await response.json();
        setAgents(data);
      } catch (error) {
        console.error('Error fetching agents:', error);
        toast.error('Failed to load available agents');
      }
    }
    if (open) {
      fetchAgents();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !topic || selectedAgents.length === 0) {
      toast.error('Please fill in all required fields and select at least one agent');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/meetings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          topic,
          description,
          language,
          agentIds: selectedAgents,
        }),
      });

      if (!response.ok) throw new Error('Failed to create meeting');
      const meeting = await response.json();
      
      onMeetingCreated(meeting);
      onOpenChange(false);
      setTitle('');
      setTopic('');
      setDescription('');
      setSelectedAgents([]);
      setLanguage('chinese');
      
      toast.success('Meeting created successfully');
    } catch (error) {
      console.error('Error creating meeting:', error);
      toast.error('Failed to create meeting');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Meeting</DialogTitle>
            <DialogDescription>
              Set up a new roundtable meeting with AI agents.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="topic">Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter discussion topic"
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meeting description"
              />
            </div>
            <div className="grid gap-2">
              <Label>Discussion Language</Label>
              <LanguageSelector
                value={language}
                onValueChange={setLanguage}
                className="w-full"
              />
            </div>
            <div className="grid gap-2">
              <Label>Select Agents</Label>
              <MultiSelect
                options={agents.map(agent => ({
                  value: agent.id,
                  label: agent.name,
                }))}
                value={selectedAgents}
                onChange={setSelectedAgents}
                placeholder="Select agents..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Creating...' : 'Create Meeting'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
} 