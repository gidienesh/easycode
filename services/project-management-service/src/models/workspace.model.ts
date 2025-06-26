export interface Workspace {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  memberIds: string[];
  projectIds: string[];
  isDefault: boolean;
  createdAt: Date;
  updatedAt: Date;
} 