export interface TimeEntry {
  id: string;
  tenantId: string;
  projectId: string;
  taskId?: string;
  userId: string;
  description?: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in minutes
  isRunning: boolean;
  createdAt: Date;
  updatedAt: Date;
} 