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
  isAuthenticated: boolean;
  hasPermission: (service: string, module: string, action: string) => boolean;
  hasRole: (role: string) => boolean;
  login: (userData: User) => void;
  refreshUser: () => void;
  logout: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock user service for development
class UserService {
  async getCurrentUser(): Promise<User | null> {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem('currentUser');
    const authToken = localStorage.getItem('authToken');
    
    if (!authToken || !storedUser) {
      return null;
    }
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }
  
  async getDefaultUser(): Promise<User> {
    // Fallback user data for development
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
        'crm-service:reports:read',
        'crm-service:activity-feed:read',
        // Engagements
        'crm-service:email:read',
        'crm-service:whatsapp:read',
        'crm-service:sms:read',
        'crm-service:phone-calls:read',
        'crm-service:meetings:read',
        'crm-service:templates:read',
        'crm-service:analytics:read',
        'crm-service:settings:read',
        // Planner
        'crm-service:calendar:read',
        'crm-service:tasks:read',
        'crm-service:activities:read',
        'crm-service:notes:read',
        'crm-service:reminders:read',
        // Equipment Maintenance - Asset Management
        'equipment-maintenance-service:asset-registry:read',
        'equipment-maintenance-service:asset-registry:write',
        'equipment-maintenance-service:asset-registry:delete',
        'equipment-maintenance-service:asset-registry:approve',
        'equipment-maintenance-service:asset-registry:export',
        'equipment-maintenance-service:asset-types:read',
        'equipment-maintenance-service:asset-types:write',
        'equipment-maintenance-service:asset-types:delete',
        'equipment-maintenance-service:asset-types:approve',
        'equipment-maintenance-service:asset-types:export',
        'equipment-maintenance-service:qr-codes:read',
        'equipment-maintenance-service:qr-codes:write',
        'equipment-maintenance-service:qr-codes:delete',
        'equipment-maintenance-service:qr-codes:approve',
        'equipment-maintenance-service:qr-codes:export',
        // Equipment Maintenance - Work Orders
        'equipment-maintenance-service:work-orders:read',
        'equipment-maintenance-service:work-orders:write',
        'equipment-maintenance-service:work-orders:delete',
        'equipment-maintenance-service:work-orders:approve',
        'equipment-maintenance-service:work-orders:export',
        // Equipment Maintenance - Maintenance Types
        'equipment-maintenance-service:preventive:read',
        'equipment-maintenance-service:preventive:write',
        'equipment-maintenance-service:preventive:delete',
        'equipment-maintenance-service:preventive:approve',
        'equipment-maintenance-service:preventive:export',
        'equipment-maintenance-service:corrective:read',
        'equipment-maintenance-service:corrective:write',
        'equipment-maintenance-service:corrective:delete',
        'equipment-maintenance-service:corrective:approve',
        'equipment-maintenance-service:corrective:export',
        // Equipment Maintenance - Checklists
        'equipment-maintenance-service:checklists:read',
        'equipment-maintenance-service:checklists:write',
        'equipment-maintenance-service:checklists:delete',
        'equipment-maintenance-service:checklists:approve',
        'equipment-maintenance-service:checklists:export',
        // Equipment Maintenance - Scheduling
        'equipment-maintenance-service:schedule:read',
        'equipment-maintenance-service:schedule:write',
        'equipment-maintenance-service:schedule:delete',
        'equipment-maintenance-service:schedule:approve',
        'equipment-maintenance-service:schedule:export',
        // Equipment Maintenance - Technicians
        'equipment-maintenance-service:technicians:read',
        'equipment-maintenance-service:technicians:write',
        'equipment-maintenance-service:technicians:delete',
        'equipment-maintenance-service:technicians:approve',
        'equipment-maintenance-service:technicians:export',
        // Equipment Maintenance - Parts & Inventory
        'equipment-maintenance-service:parts:read',
        'equipment-maintenance-service:parts:write',
        'equipment-maintenance-service:parts:delete',
        'equipment-maintenance-service:parts:approve',
        'equipment-maintenance-service:parts:export',
        // Equipment Maintenance - History & Reports
        'equipment-maintenance-service:history:read',
        'equipment-maintenance-service:history:write',
        'equipment-maintenance-service:history:delete',
        'equipment-maintenance-service:history:approve',
        'equipment-maintenance-service:history:export',
        'equipment-maintenance-service:reports:read',
        'equipment-maintenance-service:reports:write',
        'equipment-maintenance-service:reports:delete',
        'equipment-maintenance-service:reports:approve',
        'equipment-maintenance-service:reports:export',
        'equipment-maintenance-service:analytics:read',
        'equipment-maintenance-service:analytics:write',
        'equipment-maintenance-service:analytics:delete',
        'equipment-maintenance-service:analytics:approve',
        'equipment-maintenance-service:analytics:export',
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
      if (userData) {
        setUser(userData);
      } else {
        // No stored user, user needs to login
        setUser(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load user data');
      setUser(null);
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
  
  const login = (userData: User) => {
    setUser(userData);
  };
  
  const refreshUser = () => {
    loadUserData();
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentTenantId');
    localStorage.removeItem('currentUser');
    // Redirect to login page
    window.location.href = '/login';
  };
  
  return (
    <UserContext.Provider value={{
      user,
      loading,
      error,
      isAuthenticated: !!user,
      hasPermission,
      hasRole,
      login,
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