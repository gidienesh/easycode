export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: string;
  permissions: string[];
  tenantId: string;
  isActive: boolean;
  lastLogin: string;
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hasPermission: (service: string, module: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  login: (userData: User) => void;
  refreshUser: () => void;
  logout: () => void;
}