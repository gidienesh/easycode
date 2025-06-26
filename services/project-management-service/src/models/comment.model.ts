export interface Comment {
  id: string;
  tenantId: string;
  entityType: 'project' | 'task';
  entityId: string;
  userId: string;
  content: string;
  parentCommentId?: string;
  mentionedUserIds: string[];
  createdAt: Date;
  updatedAt: Date;
} 