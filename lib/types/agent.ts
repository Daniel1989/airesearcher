export interface AgentPersonality {
  name: string;
  description: string;
  traits: string[];
  expertise: string[];
  tone: 'professional' | 'friendly' | 'academic' | 'casual';
  language: string;
}

export interface Agent {
  id: string;
  name: string;
  description: string;
  traits: string[];
  expertise: string[];
  tone: 'professional' | 'friendly' | 'academic' | 'casual';
  language: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
} 