import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../providers/UserProvider';
import {
  Paper,
  TextInput,
  PasswordInput,
  Button,
  Title,
  Text,
  Container,
  Group,
  Card,
  Badge,
  Stack,
  Alert,
  Divider,
  Grid,
  Box
} from '@mantine/core';
import { IconUser, IconLock, IconAlertCircle, IconLogin } from '@tabler/icons-react';
import { User } from '../types/User';

// Mock user data with different roles
const DUMMY_USERS = [
  {
    id: 'admin-1',
    email: 'admin@demo.com',
    password: 'admin123',
    firstName: 'John',
    lastName: 'Admin',
    role: 'admin',
    tenantId: 'demo-tenant',
    description: 'Full system access, all services enabled',
    permissions: [
      // All CRM permissions
      'crm-service:leads:read', 'crm-service:leads:write', 'crm-service:leads:delete',
      'crm-service:contacts:read', 'crm-service:contacts:write', 'crm-service:contacts:delete',
      'crm-service:accounts:read', 'crm-service:accounts:write', 'crm-service:accounts:delete',
      'crm-service:opportunities:read', 'crm-service:opportunities:write', 'crm-service:opportunities:delete',
      'crm-service:reports:read', 'crm-service:reports:write',
      // Equipment Maintenance - Full access
      'equipment-maintenance-service:asset-registry:read', 'equipment-maintenance-service:asset-registry:write',
      'equipment-maintenance-service:work-orders:read', 'equipment-maintenance-service:work-orders:write',
      'equipment-maintenance-service:preventive:read', 'equipment-maintenance-service:preventive:write',
      'equipment-maintenance-service:corrective:read', 'equipment-maintenance-service:corrective:write',
      'equipment-maintenance-service:checklists:read', 'equipment-maintenance-service:checklists:write',
      'equipment-maintenance-service:schedule:read', 'equipment-maintenance-service:schedule:write',
      'equipment-maintenance-service:technicians:read', 'equipment-maintenance-service:technicians:write',
      'equipment-maintenance-service:parts:read', 'equipment-maintenance-service:parts:write',
      'equipment-maintenance-service:history:read', 'equipment-maintenance-service:history:write',
      'equipment-maintenance-service:reports:read', 'equipment-maintenance-service:reports:write',
      'equipment-maintenance-service:analytics:read', 'equipment-maintenance-service:analytics:write',
      // Project Management - Full access
      'project-management-service:projects:read', 'project-management-service:projects:write',
      'project-management-service:tasks:read', 'project-management-service:tasks:write',
      'project-management-service:timeline:read', 'project-management-service:timeline:write',
      'project-management-service:gantt:read', 'project-management-service:gantt:write',
      'project-management-service:calendar:read', 'project-management-service:calendar:write',
      'project-management-service:resources:read', 'project-management-service:resources:write',
      'project-management-service:time-tracking:read', 'project-management-service:time-tracking:write',
      'project-management-service:milestones:read', 'project-management-service:milestones:write',
      'project-management-service:workspaces:read', 'project-management-service:workspaces:write',
      'project-management-service:reports:read', 'project-management-service:reports:write',
      'project-management-service:dashboards:read', 'project-management-service:dashboards:write',
      'project-management-service:files:read', 'project-management-service:files:write',
      'project-management-service:comments:read', 'project-management-service:comments:write',
      'project-management-service:activity:read', 'project-management-service:activity:write',
      // HR - Full access
      'hr-service:employees:read', 'hr-service:employees:write',
      'hr-service:departments:read', 'hr-service:departments:write',
      'hr-service:positions:read', 'hr-service:positions:write',
      'hr-service:payroll:read', 'hr-service:payroll:write',
      'hr-service:leave:read', 'hr-service:leave:write',
      'hr-service:performance:read', 'hr-service:performance:write',
      'hr-service:recruitment:read', 'hr-service:recruitment:write',
      'hr-service:reports:read', 'hr-service:reports:write',
      // Finance - Full access
      'finance-service:gl:read', 'finance-service:gl:write',
      'finance-service:accounts:read', 'finance-service:accounts:write',
      'finance-service:journal-entries:read', 'finance-service:journal-entries:write',
      'finance-service:ap:read', 'finance-service:ap:write',
      'finance-service:ar:read', 'finance-service:ar:write',
      'finance-service:assets:read', 'finance-service:assets:write',
      'finance-service:invoices:read', 'finance-service:invoices:write',
      'finance-service:payments:read', 'finance-service:payments:write',
      'finance-service:bank-reconciliation:read', 'finance-service:bank-reconciliation:write',
      'finance-service:trial-balance:read', 'finance-service:trial-balance:write',
      'finance-service:reports:read', 'finance-service:reports:write',
      'finance-service:balance-sheet:read', 'finance-service:balance-sheet:write',
      'finance-service:income-statement:read', 'finance-service:income-statement:write',
      'finance-service:cash-flow:read', 'finance-service:cash-flow:write',
      'finance-service:budgets:read', 'finance-service:budgets:write',
      'finance-service:tax:read', 'finance-service:tax:write',
      'finance-service:currency:read', 'finance-service:currency:write',
      'finance-service:dimensions:read', 'finance-service:dimensions:write',
      'finance-service:audit:read', 'finance-service:audit:write',
      'finance-service:dashboards:read', 'finance-service:dashboards:write'
    ]
  },
  {
    id: 'manager-1',
    email: 'manager@demo.com',
    password: 'manager123',
    firstName: 'Sarah',
    lastName: 'Manager',
    role: 'manager',
    tenantId: 'demo-tenant',
    description: 'Department manager with read/write access to most modules',
    permissions: [
      // CRM - Read/Write access
      'crm-service:leads:read', 'crm-service:leads:write',
      'crm-service:contacts:read', 'crm-service:contacts:write',
      'crm-service:accounts:read', 'crm-service:accounts:write',
      'crm-service:opportunities:read', 'crm-service:opportunities:write',
      'crm-service:reports:read',
      // Equipment Maintenance - Limited access
      'equipment-maintenance-service:asset-registry:read',
      'equipment-maintenance-service:work-orders:read', 'equipment-maintenance-service:work-orders:write',
      'equipment-maintenance-service:preventive:read',
      'equipment-maintenance-service:corrective:read',
      'equipment-maintenance-service:checklists:read',
      'equipment-maintenance-service:schedule:read',
      'equipment-maintenance-service:technicians:read',
      'equipment-maintenance-service:parts:read',
      'equipment-maintenance-service:history:read',
      'equipment-maintenance-service:reports:read',
      // Project Management - Read/Write access
      'project-management-service:projects:read', 'project-management-service:projects:write',
      'project-management-service:tasks:read', 'project-management-service:tasks:write',
      'project-management-service:timeline:read',
      'project-management-service:gantt:read',
      'project-management-service:calendar:read', 'project-management-service:calendar:write',
      'project-management-service:resources:read',
      'project-management-service:time-tracking:read', 'project-management-service:time-tracking:write',
      'project-management-service:milestones:read',
      'project-management-service:workspaces:read',
      'project-management-service:reports:read',
      'project-management-service:dashboards:read',
      'project-management-service:files:read', 'project-management-service:files:write',
      'project-management-service:comments:read', 'project-management-service:comments:write',
      'project-management-service:activity:read',
      // HR - Limited access
      'hr-service:employees:read',
      'hr-service:departments:read',
      'hr-service:positions:read',
      'hr-service:leave:read',
      'hr-service:performance:read', 'hr-service:performance:write',
      'hr-service:reports:read',
      // Finance - Read only
      'finance-service:reports:read',
      'finance-service:balance-sheet:read',
      'finance-service:income-statement:read',
      'finance-service:dashboards:read'
    ]
  },
  {
    id: 'employee-1',
    email: 'employee@demo.com',
    password: 'employee123',
    firstName: 'Mike',
    lastName: 'Employee',
    role: 'employee',
    tenantId: 'demo-tenant',
    description: 'Regular employee with limited access to specific modules',
    permissions: [
      // CRM - Read only
      'crm-service:leads:read',
      'crm-service:contacts:read',
      'crm-service:accounts:read',
      'crm-service:opportunities:read',
      // Equipment Maintenance - Very limited
      'equipment-maintenance-service:asset-registry:read',
      'equipment-maintenance-service:work-orders:read',
      'equipment-maintenance-service:checklists:read',
      'equipment-maintenance-service:history:read',
      // Project Management - Limited access
      'project-management-service:projects:read',
      'project-management-service:tasks:read', 'project-management-service:tasks:write',
      'project-management-service:timeline:read',
      'project-management-service:calendar:read',
      'project-management-service:time-tracking:read', 'project-management-service:time-tracking:write',
      'project-management-service:files:read',
      'project-management-service:comments:read', 'project-management-service:comments:write',
      'project-management-service:activity:read',
      // HR - Self-service only
      'hr-service:leave:read', 'hr-service:leave:write',
      'hr-service:leave-balances:read',
      'hr-service:leave-requests:read', 'hr-service:leave-requests:write'
    ]
  },
  {
    id: 'technician-1',
    email: 'technician@demo.com',
    password: 'tech123',
    firstName: 'Alex',
    lastName: 'Technician',
    role: 'technician',
    tenantId: 'demo-tenant',
    description: 'Field technician with specialized equipment maintenance access',
    permissions: [
      // Equipment Maintenance - Specialized access
      'equipment-maintenance-service:asset-registry:read',
      'equipment-maintenance-service:work-orders:read', 'equipment-maintenance-service:work-orders:write',
      'equipment-maintenance-service:preventive:read', 'equipment-maintenance-service:preventive:write',
      'equipment-maintenance-service:corrective:read', 'equipment-maintenance-service:corrective:write',
      'equipment-maintenance-service:checklists:read', 'equipment-maintenance-service:checklists:write',
      'equipment-maintenance-service:schedule:read',
      'equipment-maintenance-service:parts:read',
      'equipment-maintenance-service:history:read', 'equipment-maintenance-service:history:write',
      // Project Management - Task focused
      'project-management-service:tasks:read', 'project-management-service:tasks:write',
      'project-management-service:time-tracking:read', 'project-management-service:time-tracking:write',
      'project-management-service:files:read',
      'project-management-service:comments:read', 'project-management-service:comments:write',
      // HR - Self-service
      'hr-service:leave:read', 'hr-service:leave:write',
      'hr-service:leave-balances:read',
      'hr-service:leave-requests:read', 'hr-service:leave-requests:write'
    ]
  },
  {
    id: 'finance-1',
    email: 'finance@demo.com',
    password: 'finance123',
    firstName: 'Emma',
    lastName: 'Finance',
    role: 'finance_manager',
    tenantId: 'demo-tenant',
    description: 'Finance manager with full financial module access',
    permissions: [
      // Finance - Full access
      'finance-service:gl:read', 'finance-service:gl:write',
      'finance-service:accounts:read', 'finance-service:accounts:write',
      'finance-service:journal-entries:read', 'finance-service:journal-entries:write',
      'finance-service:ap:read', 'finance-service:ap:write',
      'finance-service:ar:read', 'finance-service:ar:write',
      'finance-service:assets:read', 'finance-service:assets:write',
      'finance-service:invoices:read', 'finance-service:invoices:write',
      'finance-service:payments:read', 'finance-service:payments:write',
      'finance-service:bank-reconciliation:read', 'finance-service:bank-reconciliation:write',
      'finance-service:trial-balance:read', 'finance-service:trial-balance:write',
      'finance-service:reports:read', 'finance-service:reports:write',
      'finance-service:balance-sheet:read', 'finance-service:balance-sheet:write',
      'finance-service:income-statement:read', 'finance-service:income-statement:write',
      'finance-service:cash-flow:read', 'finance-service:cash-flow:write',
      'finance-service:budgets:read', 'finance-service:budgets:write',
      'finance-service:tax:read', 'finance-service:tax:write',
      'finance-service:currency:read', 'finance-service:currency:write',
      'finance-service:dimensions:read', 'finance-service:dimensions:write',
      'finance-service:audit:read', 'finance-service:audit:write',
      'finance-service:dashboards:read', 'finance-service:dashboards:write',
      // CRM - Read access for customer billing
      'crm-service:accounts:read',
      'crm-service:contacts:read',
      // Project Management - Read access for project billing
      'project-management-service:projects:read',
      'project-management-service:time-tracking:read',
      'project-management-service:reports:read',
      // HR - Payroll access
      'hr-service:employees:read',
      'hr-service:payroll:read', 'hr-service:payroll:write',
      'hr-service:reports:read'
    ]
  }
];

interface LoginPageProps {
  onLogin: (user: User) => void;
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useUser();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Find user by email and password
    const user = DUMMY_USERS.find(
      u => u.email === email && u.password === password
    );

    if (user) {
      // Store auth token and user data
      localStorage.setItem('authToken', 'dummy-token-' + user.id);
      localStorage.setItem('currentTenantId', user.tenantId);
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions,
        tenantId: user.tenantId,
        isActive: true,
        lastLogin: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
      };
      localStorage.setItem('currentUser', JSON.stringify(userData));
      
      // Update user context
      login(userData);
      
      onLogin(userData);
      navigate('/dashboard');
    } else {
      setError('Invalid email or password');
    }

    setLoading(false);
  };

  const handleQuickLogin = (user: typeof DUMMY_USERS[0]) => {
    setLoading(true);
    
    // Simulate login delay
    setTimeout(() => {
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        permissions: user.permissions,
        tenantId: user.tenantId,
        isActive: true,
        lastLogin: new Date().toISOString(),
        avatar: `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=random`
      };
      
      // Store user data in localStorage
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('authToken', 'demo-token-' + userData.id);
      localStorage.setItem('currentTenantId', userData.tenantId);
      
      // Update user context
      login(userData);
      
      // Call onLogin callback if provided
      if (onLogin) {
        onLogin(userData);
      }
      
      setLoading(false);
      // Navigate to dashboard
      navigate('/dashboard');
    }, 500);
  };

  return (
    <Container size={1200} my={40}>
      <Grid>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper withBorder shadow="md" p={30} mt={30} radius="md">
            <Title ta="center" mb={20}>
              EasyCode Login
            </Title>
            
            <form onSubmit={handleLogin}>
              <Stack>
                <TextInput
                  label="Email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  leftSection={<IconUser size={16} />}
                  required
                />
                
                <PasswordInput
                  label="Password"
                  placeholder="Your password"
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  leftSection={<IconLock size={16} />}
                  required
                />
                
                {error && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red">
                    {error}
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  loading={loading}
                  leftSection={<IconLogin size={16} />}
                  fullWidth
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Paper>
        </Grid.Col>
        
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Box mt={30}>
            <Title order={3} mb={20}>
              Demo Users - Quick Login
            </Title>
            <Text size="sm" c="dimmed" mb={20}>
              Click on any user card to auto-fill login credentials
            </Text>
            
            <Stack gap="md">
              {DUMMY_USERS.map((user) => (
                <Card 
                  key={user.id} 
                  withBorder 
                  shadow="sm" 
                  p="md" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleQuickLogin(user)}
                >
                  <Group justify="space-between" mb="xs">
                    <Text fw={500}>
                      {user.firstName} {user.lastName}
                    </Text>
                    <Badge 
                      color={
                        user.role === 'admin' ? 'red' :
                        user.role === 'manager' ? 'blue' :
                        user.role === 'finance_manager' ? 'green' :
                        user.role === 'technician' ? 'orange' : 'gray'
                      }
                      variant="light"
                    >
                      {user.role.replace('_', ' ').toUpperCase()}
                    </Badge>
                  </Group>
                  
                  <Text size="sm" c="dimmed" mb="xs">
                    {user.email}
                  </Text>
                  
                  <Text size="xs" c="dimmed">
                    {user.description}
                  </Text>
                  
                  <Divider my="xs" />
                  
                  <Group gap="xs">
                    <Text size="xs" fw={500}>Password:</Text>
                    <Text size="xs" c="dimmed">{user.password}</Text>
                  </Group>
                </Card>
              ))}
            </Stack>
          </Box>
        </Grid.Col>
      </Grid>
    </Container>
  );
}

export default LoginPage;