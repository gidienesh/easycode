export interface Attachment {
  id: string;
  tenantId: string;
  entityType: 'project' | 'task';
  entityId: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  url: string;
  uploadedBy: string;
  createdAt: Date;
} 