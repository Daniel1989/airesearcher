import { Agent } from './agent';

export interface Meeting {
  id: string;
  title: string;
  topic: string;
  description?: string;
  status: 'pending' | 'active' | 'completed';
  agents: Agent[];
  createdAt: Date;
  updatedAt: Date;
} 