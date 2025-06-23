import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// Types
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
  lastLogin?: string;
}

export interface UserPermission {
  service: string;
  module: string;
  actions: string[];
}

export interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  hasPermission: (service: string, module: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  refreshUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user service for development
class UserService {
  async getCurrentUser(): Promise<User> {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Mock user data - in real app this would come from auth service
    return {
      id: 'user-1',
      email: 'admin@demo.com',
      firstName: 'John',
      lastName: 'Doe',
      avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=random',
      role: 'admin',
      permissions: [
        // CRM
        'crm-service:leads:read',
        'crm-service:contacts:read',
        'crm-service:accounts:read',
        'crm-service:opportunities:read',
        'crm-service:activities:read',
        'crm-service:reports:read',
        'crm-service:email-templates:read',
        'crm-service:sms-templates:read',
        'crm-service:call-logs:read',
        'crm-service:meeting-notes:read',
        'crm-service:whatsapp-logs:read',
        'crm-service:activity-feed:read',
        // Equipment Maintenance
        'equipment-maintenance-service:asset-registry:read',
        'equipment-maintenance-service:work-orders:read',
        'equipment-maintenance-service:preventive:read',
        'equipment-maintenance-service:corrective:read',
        'equipment-maintenance-service:checklists:read',
        'equipment-maintenance-service:history:read',
        'equipment-maintenance-service:schedule:read',
        'equipment-maintenance-service:technicians:read',
        'equipment-maintenance-service:parts:read',
        'equipment-maintenance-service:reports:read',
        'equipment-maintenance-service:analytics:read',
        'equipment-maintenance-service:qr-codes:read',
        'equipment-maintenance-service:asset-types:read',
        // Project Management
        'project-management-service:projects:read',
        'project-management-service:tasks:read',
        'project-management-service:timeline:read',
        'project-management-service:gantt:read',
        'project-management-service:calendar:read',
        'project-management-service:resources:read',
        'project-management-service:time-tracking:read',
        'project-management-service:milestones:read',
        'project-management-service:workspaces:read',
        'project-management-service:reports:read',
        'project-management-service:dashboards:read',
        'project-management-service:files:read',
        'project-management-service:comments:read',
        'project-management-service:activity:read',
        // HR
        'hr-service:employees:read',
        'hr-service:departments:read',
        'hr-service:positions:read',
        'hr-service:payroll:read',
        'hr-service:leave:read',
        'hr-service:leave-balances:read',
        'hr-service:leave-requests:read',
        'hr-service:performance:read',
        'hr-service:recruitment:read',
        'hr-service:job-requisitions:read',
        'hr-service:candidates:read',
        'hr-service:interviews:read',
        'hr-service:onboarding:read',
        'hr-service:offboarding:read',
        'hr-service:documents:read',
        'hr-service:reports:read',
        'hr-service:org-chart:read',
        // Finance
        'finance-service:gl:read',
        'finance-service:accounts:read',
        'finance-service:journal-entries:read',
        'finance-service:ap:read',
        'finance-service:ar:read',
        'finance-service:assets:read',
        'finance-service:invoices:read',
        'finance-service:payments:read',
        'finance-service:bank-reconciliation:read',
        'finance-service:trial-balance:read',
        'finance-service:reports:read',
        'finance-service:balance-sheet:read',
        'finance-service:income-statement:read',
        'finance-service:cash-flow:read',
        'finance-service:budgets:read',
        'finance-service:tax:read',
        'finance-service:currency:read',
        'finance-service:dimensions:read',
        'finance-service:audit:read',
        'finance-service:dashboards:read',
      ],
      tenantId: 'demo-tenant',
      isActive: true,
      lastLogin: new Date().toISOString(),
    };
  }
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const userService = new UserService();
  
  const loadUserData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const userData = await userService.getCurrentUser();
      setUser(userData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    loadUserData();
  }, []);
  
  const hasPermission = (service: string, module: string, action: string): boolean => {
    if (!user) return false;
    
    const permissionKey = `${service}:${module}:${action}`;
    return user.permissions.includes(permissionKey);
  };
  
  const hasRole = (role: string): boolean => {
    return user?.role === role;
  };
  
  const refreshUser = () => {
    loadUserData();
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentTenantId');
    // Redirect to login page
    window.location.href = '/login';
  };
  
  return (
    <UserContext.Provider value={{
      user,
      loading,
      error,
      hasPermission,
      hasRole,
      refreshUser,
      logout
    }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 