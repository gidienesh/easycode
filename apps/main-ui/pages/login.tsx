import React, { useState } from 'react';
import { useRouter } from 'next/router';
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
      // Finance - Full access
      'finance-service:accounts:read', 'finance-service:accounts:write',
      'finance-service:transactions:read', 'finance-service:transactions:write',
      'finance-service:reports:read', 'finance-service:reports:write',
      'finance-service:budgets:read', 'finance-service:budgets:write',
      // All other services
      'pos-service:sales:read', 'pos-service:sales:write',
      'inventory-service:products:read', 'inventory-service:products:write',
      'hr-service:employees:read', 'hr-service:employees:write',
      'logistics-service:shipments:read', 'logistics-service:shipments:write',
      'tenant-service:settings:read', 'tenant-service:settings:write',
      'user-service:users:read', 'user-service:users:write'
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
    description: 'Store management, limited admin access',
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
      // Finance - Read access only
      'finance-service:accounts:read',
      'finance-service:transactions:read',
      'finance-service:reports:read',
      // POS and Inventory
      'pos-service:sales:read', 'pos-service:sales:write',
      'inventory-service:products:read', 'inventory-service:products:write',
      // HR - Limited access
      'hr-service:employees:read'
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
    description: 'Basic employee access, POS operations',
    permissions: [
      // CRM - Read only
      'crm-service:leads:read',
      'crm-service:contacts:read',
      'crm-service:accounts:read',
      // POS operations
      'pos-service:sales:read', 'pos-service:sales:write',
      // Inventory - Read only
      'inventory-service:products:read'
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
    description: 'Equipment maintenance specialist',
    permissions: [
      // Equipment Maintenance - Full operational access
      'equipment-maintenance-service:asset-registry:read',
      'equipment-maintenance-service:work-orders:read', 'equipment-maintenance-service:work-orders:write',
      'equipment-maintenance-service:preventive:read', 'equipment-maintenance-service:preventive:write',
      'equipment-maintenance-service:corrective:read', 'equipment-maintenance-service:corrective:write',
      'equipment-maintenance-service:checklists:read', 'equipment-maintenance-service:checklists:write',
      'equipment-maintenance-service:schedule:read',
      'equipment-maintenance-service:parts:read', 'equipment-maintenance-service:parts:write',
      // Inventory - Parts related
      'inventory-service:products:read'
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
    description: 'Financial operations and reporting',
    permissions: [
      // Finance - Full access
      'finance-service:accounts:read', 'finance-service:accounts:write',
      'finance-service:transactions:read', 'finance-service:transactions:write',
      'finance-service:reports:read', 'finance-service:reports:write',
      'finance-service:budgets:read', 'finance-service:budgets:write',
      // CRM - Read access for financial reporting
      'crm-service:accounts:read',
      'crm-service:opportunities:read',
      'crm-service:reports:read',
      // POS - Read access for sales data
      'pos-service:sales:read'
    ]
  }
];

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = DUMMY_USERS.find(u => u.email === email && u.password === password);
    
    if (user) {
      // Store user data in localStorage
      const userData = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        tenantId: user.tenantId,
        permissions: user.permissions
      };
      
      localStorage.setItem('currentUser', JSON.stringify(userData));
      localStorage.setItem('currentTenantId', user.tenantId);
      localStorage.setItem('authToken', 'demo-auth-token');
      
      // Redirect to dashboard
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
    
    setLoading(false);
  };

  const handleQuickLogin = async (user: typeof DUMMY_USERS[0]) => {
    setLoading(true);
    setError('');
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const userData = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      tenantId: user.tenantId,
      permissions: user.permissions
    };
    
    localStorage.setItem('currentUser', JSON.stringify(userData));
    localStorage.setItem('currentTenantId', user.tenantId);
    localStorage.setItem('authToken', 'demo-auth-token');
    
    // Redirect to dashboard
    router.push('/dashboard');
    
    setLoading(false);
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'red';
      case 'manager': return 'blue';
      case 'employee': return 'green';
      case 'technician': return 'orange';
      case 'finance_manager': return 'purple';
      default: return 'gray';
    }
  };

  return (
    <Container size={600} py={40}>
      <Stack gap="xl">
        {/* Main Login Section */}
        <Box>
          <Stack gap="lg">
            <Box ta="center">
              <Title order={1} size="h2" fw={700} c="dark">
                EasyCode Solutions
              </Title>
              <Text size="sm" c="dimmed" mt={5}>
                Sign in to your account
              </Text>
            </Box>
              
            <form onSubmit={handleLogin}>
              <Stack gap="md" maw={400} mx="auto">
                <TextInput
                  label="Email Address"
                  placeholder="Enter your email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.currentTarget.value)}
                  leftSection={<IconUser size={18} />}
                  size="md"
                />
                
                <PasswordInput
                  label="Password"
                  placeholder="Enter your password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.currentTarget.value)}
                  leftSection={<IconLock size={18} />}
                  size="md"
                />
                
                {error && (
                  <Alert icon={<IconAlertCircle size={16} />} color="red">
                    {error}
                  </Alert>
                )}
                
                <Button 
                  type="submit" 
                  fullWidth 
                  size="md"
                  loading={loading}
                  leftSection={<IconLogin size={18} />}
                  mt="md"
                >
                  Sign In
                </Button>
              </Stack>
            </form>
          </Stack>
        </Box>

        {/* Demo Users Section */}
        <Box>
          <Stack gap="md">
            <Box ta="center">
              <Title order={3} size="h4" fw={600} c="dark">
                🚀 Quick Demo Access
              </Title>
              <Text size="sm" c="dimmed" mt={5}>
                Try different user roles instantly
              </Text>
            </Box>
            
            <Divider />
            
            <Stack gap="sm" maw={600} mx="auto">
              {DUMMY_USERS.map((user) => (
                <Group 
                  key={user.id}
                  justify="space-between" 
                  align="center"
                  p="md"
                  style={{ 
                    cursor: 'pointer',
                    borderRadius: '8px',
                    border: '1px solid #e9ecef',
                    transition: 'all 0.2s ease'
                  }}
                  onClick={() => handleQuickLogin(user)}
                  __vars={{
                    '--group-hover-bg': '#f8f9fa'
                  }}
                >
                  <Box flex={1}>
                    <Group gap="xs" mb={4}>
                      <Text fw={600} size="sm">
                        {user.firstName} {user.lastName}
                      </Text>
                      <Badge 
                        color={getRoleBadgeColor(user.role)} 
                        variant="light"
                        size="xs"
                      >
                        {user.role.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </Group>
                    
                    <Text size="xs" c="dimmed" mb={2}>
                      {user.email}
                    </Text>
                    
                    <Text size="xs" c="dimmed">
                      {user.description} • {user.permissions.length} permissions
                    </Text>
                  </Box>
                  
                  <Button 
                    size="xs" 
                    variant="light"
                    loading={loading}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleQuickLogin(user);
                    }}
                  >
                    Login
                  </Button>
                </Group>
              ))}
            </Stack>
          </Stack>
        </Box>
        </Stack>
     </Container>
   );
}