'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, ClipboardCheck } from 'lucide-react';

interface ResearchResult {
  plan: string;
  findings: string;
  conclusion: string;
}

export default function ResearchPage() {
  const [topic, setTopic] = useState('');
  const [description, setDescription] = useState('');
  const [language, setLanguage] = useState('english');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ResearchResult | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic,
          description,
          language,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to conduct research');
      }

      setResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">AI Research Assistant</h1>
      
      <div className="grid gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Research Topic</CardTitle>
            <CardDescription>
              Enter a topic to research and get AI-powered analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Input
                  id="topic"
                  placeholder="Enter your research topic"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Additional Context (Optional)</Label>
                <Textarea
                  id="description"
                  placeholder="Provide any additional context or specific aspects you'd like to explore"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="h-24"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Response Language</Label>
                <Select value={language} onValueChange={setLanguage}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="chinese">Chinese</SelectItem>
                    <SelectItem value="japanese">Japanese</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Button type="submit" disabled={isLoading || !topic}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Researching...
                  </>
                ) : (
                  'Start Research'
                )}
              </Button>
            </form>
          </CardContent>
        </Card>

        {error && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-red-500">{error}</div>
            </CardContent>
          </Card>
        )}

        {result && (
          <div className="grid gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Research Plan
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(result.plan)}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{result.plan}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Research Findings
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(result.findings)}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{result.findings}</div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Expert Conclusion
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => copyToClipboard(result.conclusion)}
                  >
                    <ClipboardCheck className="h-4 w-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose dark:prose-invert max-w-none">
                  <div className="whitespace-pre-wrap">{result.conclusion}</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
} 