'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';
import { AgentPersonality } from '@/lib/types/agent';

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  traits: z.array(z.string()),
  expertise: z.array(z.string()),
  tone: z.enum(['professional', 'friendly', 'academic', 'casual']),
  language: z.string().min(2, 'Language must be at least 2 characters'),
});

interface AgentFormProps {
  initialData?: AgentPersonality;
  onSubmit: (data: AgentPersonality) => void;
  isLoading?: boolean;
}

export function AgentForm({ initialData, onSubmit, isLoading }: AgentFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      traits: [],
      expertise: [],
      tone: 'professional',
      language: 'English',
    },
  });

  const addTrait = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        const traits = form.getValues('traits');
        if (!traits.includes(value)) {
          form.setValue('traits', [...traits, value]);
        }
        e.currentTarget.value = '';
      }
    }
  };

  const removeTrait = (trait: string) => {
    const traits = form.getValues('traits');
    form.setValue('traits', traits.filter((t) => t !== trait));
  };

  const addExpertise = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      const value = e.currentTarget.value.trim();
      if (value) {
        const expertise = form.getValues('expertise');
        if (!expertise.includes(value)) {
          form.setValue('expertise', [...expertise, value]);
        }
        e.currentTarget.value = '';
      }
    }
  };

  const removeExpertise = (expertise: string) => {
    const expertiseList = form.getValues('expertise');
    form.setValue('expertise', expertiseList.filter((e) => e !== expertise));
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Agent name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Describe the agent's personality and purpose"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="traits"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Traits</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add traits (press Enter)"
                  onKeyDown={addTrait}
                />
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((trait) => (
                  <Badge key={trait} variant="secondary">
                    {trait}
                    <button
                      type="button"
                      onClick={() => removeTrait(trait)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="expertise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Expertise</FormLabel>
              <FormControl>
                <Input
                  placeholder="Add expertise areas (press Enter)"
                  onKeyDown={addExpertise}
                />
              </FormControl>
              <div className="flex flex-wrap gap-2 mt-2">
                {field.value.map((expertise) => (
                  <Badge key={expertise} variant="secondary">
                    {expertise}
                    <button
                      type="button"
                      onClick={() => removeExpertise(expertise)}
                      className="ml-1"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="tone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tone</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a tone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="professional">Professional</SelectItem>
                  <SelectItem value="friendly">Friendly</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="casual">Casual</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="language"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Language</FormLabel>
              <FormControl>
                <Input placeholder="Primary language" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving...' : 'Save Agent'}
        </Button>
      </form>
    </Form>
  );
} 