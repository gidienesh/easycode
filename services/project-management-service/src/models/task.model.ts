export interface Task {
  id: string;
  tenantId: string;
  projectId: string;
  
  // Basic info
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  
  // Dates
  createdAt: Date;
  updatedAt: Date;
  startDate?: Date;
  dueDate?: Date;
  completedAt?: Date;
  
  // Assignment
  assigneeId?: string;
  assignedBy: string;
  watchers: string[]; // User IDs who should be notified
  
  // Hierarchy
  parentTaskId?: string;
  subtasks: string[]; // Task IDs
  
  // Dependencies
  dependencies: TaskDependency[];
  blockedBy: string[]; // Task IDs that block this task
  blocks: string[]; // Task IDs that this task blocks
  
  // Progress
  progress: number; // 0-100
  estimatedHours?: number;
  actualHours?: number;
  
  // Checklist
  checklist: TaskChecklistItem[];
  
  // Categorization
  tags: string[];
  labels: string[];
  
  // Custom fields
  customFields?: Record<string, any>;
  
  // Activity
  lastActivityAt: Date;
  activityCount: number;
  commentCount: number;
  attachmentCount: number;
}

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  IN_REVIEW = 'in_review',
  BLOCKED = 'blocked',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum TaskPriority {
  LOWEST = 'lowest',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  HIGHEST = 'highest'
}

export enum DependencyType {
  FINISH_TO_START = 'finish_to_start',
  START_TO_START = 'start_to_start',
  FINISH_TO_FINISH = 'finish_to_finish',
  START_TO_FINISH = 'start_to_finish'
}

export interface TaskDependency {
  taskId: string;
  type: DependencyType;
  lag?: number; // in hours
}

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  completedAt?: Date;
  completedBy?: string;
  createdAt: Date;
}

// DTOs
export interface CreateTaskDto {
  title: string;
  description?: string;
  projectId: string;
  assigneeId?: string;
  priority?: TaskPriority;
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  parentTaskId?: string;
  dependencies?: TaskDependency[];
  tags?: string[];
  labels?: string[];
  checklist?: Omit<TaskChecklistItem, 'id' | 'createdAt' | 'completedAt' | 'completedBy'>[];
  customFields?: Record<string, any>;
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  startDate?: Date;
  dueDate?: Date;
  estimatedHours?: number;
  actualHours?: number;
  progress?: number;
  dependencies?: TaskDependency[];
  tags?: string[];
  labels?: string[];
  customFields?: Record<string, any>;
}

export interface TaskFilterDto {
  projectId?: string;
  status?: TaskStatus[];
  priority?: TaskPriority[];
  assigneeId?: string;
  assignedBy?: string;
  parentTaskId?: string;
  tags?: string[];
  labels?: string[];
  dueDateFrom?: Date;
  dueDateTo?: Date;
  createdFrom?: Date;
  createdTo?: Date;
  search?: string;
  includeSubtasks?: boolean;
  includeCompleted?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TaskSummary {
  id: string;
  title: string;
  status: TaskStatus;
  priority: TaskPriority;
  progress: number;
  assigneeId?: string;
  dueDate?: Date;
  projectId: string;
  subtaskCount: number;
  commentCount: number;
  attachmentCount: number;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  userId: string;
  action: TaskActivityAction;
  details?: Record<string, any>;
  timestamp: Date;
}

export enum TaskActivityAction {
  CREATED = 'created',
  UPDATED = 'updated',
  STATUS_CHANGED = 'status_changed',
  ASSIGNED = 'assigned',
  COMMENTED = 'commented',
  ATTACHMENT_ADDED = 'attachment_added',
  CHECKLIST_UPDATED = 'checklist_updated',
  DEPENDENCY_ADDED = 'dependency_added',
  DEPENDENCY_REMOVED = 'dependency_removed'
} 