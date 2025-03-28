"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { LanguageSelector } from "@/components/ui/language-selector";

export default function NewMeetingPage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [topic, setTopic] = useState("");
  const [language, setLanguage] = useState("chinese");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/meetings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description,
          topic,
          language,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create meeting");
      }

      const data = await response.json();
      router.push(`/roundtable/${data.id}`);
    } catch (error) {
      console.error("Error creating meeting:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle>Create New Meeting</CardTitle>
          <CardDescription>Set up a new roundtable discussion with AI agents.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Meeting Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter meeting title"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter meeting description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="topic">Discussion Topic</Label>
              <Input
                id="topic"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="Enter discussion topic"
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Discussion Language</Label>
              <LanguageSelector
                value={language}
                onValueChange={setLanguage}
                className="w-full"
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Meeting"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
} 