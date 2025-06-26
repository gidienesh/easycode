export interface Milestone {
  id: string;
  tenantId: string;
  projectId: string;
  name: string;
  description?: string;
  dueDate: Date;
  completedAt?: Date;
  status: 'pending' | 'completed';
  progress: number;
  createdAt: Date;
  updatedAt: Date;
} 