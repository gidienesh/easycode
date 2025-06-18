export interface UserProfile {
  firstName?: string;
  lastName?: string;
  // Add other profile fields as needed
}

export interface User {
  id: string; // UUID
  tenantId: string;
  username: string; // Or email
  passwordHash: string; // Store hashed passwords only
  profile?: UserProfile;
  roles: string[]; // Array of role IDs or names
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
