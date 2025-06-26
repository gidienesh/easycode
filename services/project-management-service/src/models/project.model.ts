export interface Project {
  id: string;
  tenantId: string; // For multi-tenant isolation
  name: string;
  description?: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  
  // Dates
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  
  // People
  projectManagerId: string;
  teamMemberIds: string[];
  clientId?: string; // Link to CRM service
  
  // Financial
  budget?: number;
  actualCost?: number;
  currency?: string;
  
  // Progress tracking
  progress: number; // 0-100
  completedTasks: number;
  totalTasks: number;
  
  // Categorization
  workspaceId?: string;
  tags: string[];
  category?: string;
  
  // Template and customization
  templateId?: string;
  customFields?: Record<string, any>;
  
  // Integration points
  crmOpportunityId?: string; // Link to CRM opportunity
  financeProjectId?: string; // Link to finance service
  
  // Settings
  isArchived: boolean;
  visibility: ProjectVisibility;
  notificationSettings?: ProjectNotificationSettings;
}

export enum ProjectStatus {
  PLANNING = 'planning',
  ACTIVE = 'active',
  ON_HOLD = 'on_hold',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  ARCHIVED = 'archived'
}

export enum ProjectPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum ProjectVisibility {
  PRIVATE = 'private',
  TEAM = 'team',
  ORGANIZATION = 'organization',
  PUBLIC = 'public'
}

export interface ProjectNotificationSettings {
  taskAssignments: boolean;
  statusChanges: boolean;
  milestoneUpdates: boolean;
  budgetAlerts: boolean;
  deadlineReminders: boolean;
}

export interface ProjectTemplate {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  category: string;
  
  // Template structure
  defaultTasks: ProjectTemplateTask[];
  defaultMilestones: ProjectTemplateMilestone[];
  estimatedDuration: number; // in days
  
  // Settings
  isPublic: boolean;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
  usageCount: number;
}

export interface ProjectTemplateTask {
  name: string;
  description?: string;
  estimatedHours: number;
  dependencies: string[]; // task names
  assigneeRole?: string;
  priority: ProjectPriority;
  tags: string[];
}

export interface ProjectTemplateMilestone {
  name: string;
  description?: string;
  daysFromStart: number;
  isRequired: boolean;
}

// DTOs for API
export interface CreateProjectDto {
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  projectManagerId: string;
  teamMemberIds?: string[];
  budget?: number;
  currency?: string;
  workspaceId?: string;
  tags?: string[];
  category?: string;
  templateId?: string;
  customFields?: Record<string, any>;
  visibility?: ProjectVisibility;
  notificationSettings?: ProjectNotificationSettings;
}

export interface UpdateProjectDto {
  name?: string;
  description?: string;
  status?: ProjectStatus;
  priority?: ProjectPriority;
  startDate?: Date;
  endDate?: Date;
  projectManagerId?: string;
  teamMemberIds?: string[];
  budget?: number;
  actualCost?: number;
  currency?: string;
  tags?: string[];
  category?: string;
  customFields?: Record<string, any>;
  visibility?: ProjectVisibility;
  notificationSettings?: ProjectNotificationSettings;
}

export interface ProjectFilterDto {
  status?: ProjectStatus[];
  priority?: ProjectPriority[];
  projectManagerId?: string;
  workspaceId?: string;
  category?: string;
  tags?: string[];
  startDateFrom?: Date;
  startDateTo?: Date;
  endDateFrom?: Date;
  endDateTo?: Date;
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ProjectSummary {
  id: string;
  name: string;
  status: ProjectStatus;
  priority: ProjectPriority;
  progress: number;
  startDate: Date;
  endDate?: Date;
  projectManagerId: string;
  teamMemberCount: number;
  taskCount: number;
  budget?: number;
  actualCost?: number;
} 