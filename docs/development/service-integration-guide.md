# Service Integration Guide for EasyCode Monorepo

## Overview

This guide explains how to use and integrate services throughout the EasyCode monorepo. We'll use the **Tenant Service** as a primary example since it's a foundational service that other services depend on.

## Monorepo Structure

```
Easy-POS/
├── apps/                    # Frontend applications
│   └── main-ui/            # Main React/Next.js application
├── services/               # Backend microservices
│   ├── tenant-service/     # Tenant management (foundational)
│   ├── user-service/       # User management
│   ├── crm-service/        # Customer relationship management
│   ├── finance-service/    # Financial management
│   └── ...                 # Other services
├── packages/               # Shared packages
│   ├── types/             # Shared TypeScript types
│   └── ui-library/        # Shared UI components
└── pnpm-workspace.yaml    # Workspace configuration
```

## 1. Service Architecture Principles

### 1.1 Service Dependencies
- **Tenant Service**: Foundational service (no dependencies on other services)
- **User Service**: Depends on Tenant Service for tenant validation
- **Business Services**: Depend on both Tenant and User services
- **Frontend Apps**: Consume all services via HTTP APIs

### 1.2 Communication Patterns
- **Synchronous**: HTTP REST APIs for real-time operations
- **Asynchronous**: Event-driven communication (future implementation)
- **Service Discovery**: Direct HTTP calls with service URLs

## 2. Using Tenant Service as an Example

### 2.1 Service Definition

The Tenant Service provides:
- Tenant lifecycle management
- Service entitlements (which services a tenant can access)
- Tenant configuration and settings

**Key Endpoints:**
```typescript
GET /api/tenants/:tenantId/details      // Get tenant information
GET /api/tenants/:tenantId/entitlements // Get tenant service entitlements
```

### 2.2 Service Models

```typescript
// services/tenant-service/src/models/tenant.model.ts
export interface Tenant {
  id: string;
  name: string;
  status: 'active' | 'inactive' | 'suspended';
  createdAt: Date;
  updatedAt: Date;
}

export interface TenantEntitlements {
  tenantId: string;
  services: Record<string, {
    enabled: boolean;
    version?: string;
    modules?: string[];
    config?: Record<string, any>;
  }>;
  version: string;
  lastUpdatedAt: Date;
}
```

## 3. Service-to-Service Communication

### 3.1 HTTP Client Setup

Create a shared HTTP client for service communication:

```typescript
// packages/types/src/http-client.ts
export interface ServiceConfig {
  baseURL: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export class ServiceClient {
  private config: ServiceConfig;

  constructor(config: ServiceConfig) {
    this.config = config;
  }

  async get<T>(endpoint: string): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      signal: AbortSignal.timeout(this.config.timeout || 5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const response = await fetch(`${this.config.baseURL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...this.config.headers,
      },
      body: JSON.stringify(data),
      signal: AbortSignal.timeout(this.config.timeout || 5000),
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### 3.2 Tenant Service Client

```typescript
// packages/types/src/tenant-client.ts
import { ServiceClient } from './http-client';
import { Tenant, TenantEntitlements } from '@easycode/tenant-service';

export class TenantServiceClient extends ServiceClient {
  constructor(baseURL: string) {
    super({ baseURL });
  }

  async getTenantDetails(tenantId: string): Promise<Tenant> {
    return this.get<Tenant>(`/api/tenants/${tenantId}/details`);
  }

  async getTenantEntitlements(tenantId: string): Promise<TenantEntitlements> {
    return this.get<TenantEntitlements>(`/api/tenants/${tenantId}/entitlements`);
  }

  async isServiceEnabled(tenantId: string, serviceName: string): Promise<boolean> {
    try {
      const entitlements = await this.getTenantEntitlements(tenantId);
      return entitlements.services[serviceName]?.enabled || false;
    } catch (error) {
      console.error(`Error checking service entitlement for ${serviceName}:`, error);
      return false;
    }
  }
}
```

## 4. Integration Examples

### 4.1 User Service Integration

```typescript
// services/user-service/src/services/tenantIntegration.service.ts
import { TenantServiceClient } from '@easycode/types';

export class TenantIntegrationService {
  private tenantClient: TenantServiceClient;

  constructor() {
    this.tenantClient = new TenantServiceClient(
      process.env.TENANT_SERVICE_URL || 'http://localhost:3002'
    );
  }

  async validateTenant(tenantId: string): Promise<boolean> {
    try {
      const tenant = await this.tenantClient.getTenantDetails(tenantId);
      return tenant.status === 'active';
    } catch (error) {
      console.error(`Tenant validation failed for ${tenantId}:`, error);
      return false;
    }
  }

  async checkUserServiceEntitlement(tenantId: string): Promise<boolean> {
    return this.tenantClient.isServiceEnabled(tenantId, 'user-service');
  }
}

// services/user-service/src/controllers/user.controller.ts
import { TenantIntegrationService } from '../services/tenantIntegration.service';

export class UserController {
  private tenantIntegration: TenantIntegrationService;

  constructor() {
    this.tenantIntegration = new TenantIntegrationService();
  }

  async createUser(req: Request, res: Response) {
    const { tenantId, userData } = req.body;

    // Validate tenant before creating user
    const isTenantValid = await this.tenantIntegration.validateTenant(tenantId);
    if (!isTenantValid) {
      return res.status(400).json({ error: 'Invalid or inactive tenant' });
    }

    // Check if user service is enabled for this tenant
    const isServiceEnabled = await this.tenantIntegration.checkUserServiceEntitlement(tenantId);
    if (!isServiceEnabled) {
      return res.status(403).json({ error: 'User service not enabled for this tenant' });
    }

    // Proceed with user creation
    // ... user creation logic
  }
}
```

### 4.2 Frontend Integration

```typescript
// apps/main-ui/src/services/tenantService.ts
import { TenantServiceClient } from '@easycode/types';

export class TenantService {
  private client: TenantServiceClient;

  constructor() {
    this.client = new TenantServiceClient(
      process.env.NEXT_PUBLIC_TENANT_SERVICE_URL || 'http://localhost:3002'
    );
  }

  async getTenantInfo(tenantId: string) {
    try {
      const [tenant, entitlements] = await Promise.all([
        this.client.getTenantDetails(tenantId),
        this.client.getTenantEntitlements(tenantId)
      ]);

      return { tenant, entitlements };
    } catch (error) {
      console.error('Failed to fetch tenant info:', error);
      throw error;
    }
  }

  async getEnabledServices(tenantId: string) {
    const entitlements = await this.client.getTenantEntitlements(tenantId);
    return Object.entries(entitlements.services)
      .filter(([_, config]) => config.enabled)
      .map(([serviceName, config]) => ({
        name: serviceName,
        version: config.version,
        modules: config.modules || []
      }));
  }
}

// apps/main-ui/src/hooks/useTenant.ts
import { useState, useEffect } from 'react';
import { TenantService } from '../services/tenantService';

export function useTenant(tenantId: string) {
  const [tenant, setTenant] = useState(null);
  const [entitlements, setEntitlements] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const tenantService = new TenantService();
    
    tenantService.getTenantInfo(tenantId)
      .then(({ tenant, entitlements }) => {
        setTenant(tenant);
        setEntitlements(entitlements);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, [tenantId]);

  return { tenant, entitlements, loading, error };
}
```

### 4.3 React Component Usage

```tsx
// apps/main-ui/src/components/TenantDashboard.tsx
import React from 'react';
import { useTenant } from '../hooks/useTenant';
import { Card, Text, Badge, Group, LoadingOverlay } from '@mantine/core';

interface TenantDashboardProps {
  tenantId: string;
}

export function TenantDashboard({ tenantId }: TenantDashboardProps) {
  const { tenant, entitlements, loading, error } = useTenant(tenantId);

  if (loading) {
    return <LoadingOverlay visible />;
  }

  if (error) {
    return (
      <Card className="card">
        <div className="alert alert-error">
          Failed to load tenant information: {error.message}
        </div>
      </Card>
    );
  }

  const enabledServices = Object.entries(entitlements?.services || {})
    .filter(([_, config]) => config.enabled)
    .map(([serviceName, config]) => serviceName);

  return (
    <Card className="card">
      <div className="card-header">
        <h2 className="card-title">{tenant?.name}</h2>
        <Badge color={tenant?.status === 'active' ? 'green' : 'red'}>
          {tenant?.status}
        </Badge>
      </div>
      
      <div className="card-content">
        <Text size="sm" color="dimmed" mb="md">
          Tenant ID: {tenantId}
        </Text>
        
        <div className="mt-4">
          <h3 className="text-lg font-semibold mb-2">Enabled Services</h3>
          <Group>
            {enabledServices.map(service => (
              <Badge key={service} color="blue">
                {service}
              </Badge>
            ))}
          </Group>
        </div>
      </div>
    </Card>
  );
}
```

## 5. Environment Configuration

### 5.1 Service URLs

```bash
# .env files for each service
# services/tenant-service/.env
PORT=3002
NODE_ENV=development

# services/user-service/.env
PORT=3003
NODE_ENV=development
TENANT_SERVICE_URL=http://localhost:3002

# apps/main-ui/.env.local
NEXT_PUBLIC_TENANT_SERVICE_URL=http://localhost:3002
NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3003
```

### 5.2 Docker Compose (for local development)

```yaml
# docker-compose.yml
version: '3.8'
services:
  tenant-service:
    build: ./services/tenant-service
    ports:
      - "3002:3002"
    environment:
      - NODE_ENV=development
      - PORT=3002

  user-service:
    build: ./services/user-service
    ports:
      - "3003:3003"
    environment:
      - NODE_ENV=development
      - PORT=3003
      - TENANT_SERVICE_URL=http://tenant-service:3002
    depends_on:
      - tenant-service

  main-ui:
    build: ./apps/main-ui
    ports:
      - "3000:3000"
    environment:
      - NEXT_PUBLIC_TENANT_SERVICE_URL=http://localhost:3002
      - NEXT_PUBLIC_USER_SERVICE_URL=http://localhost:3003
```

## 6. Error Handling and Resilience

### 6.1 Circuit Breaker Pattern

```typescript
// packages/types/src/circuit-breaker.ts
export class CircuitBreaker {
  private failures = 0;
  private lastFailureTime = 0;
  private state: 'CLOSED' | 'OPEN' | 'HALF_OPEN' = 'CLOSED';
  private readonly threshold = 5;
  private readonly timeout = 60000; // 1 minute

  async execute<T>(fn: () => Promise<T>): Promise<T> {
    if (this.state === 'OPEN') {
      if (Date.now() - this.lastFailureTime > this.timeout) {
        this.state = 'HALF_OPEN';
      } else {
        throw new Error('Circuit breaker is OPEN');
      }
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  private onSuccess(): void {
    this.failures = 0;
    this.state = 'CLOSED';
  }

  private onFailure(): void {
    this.failures++;
    this.lastFailureTime = Date.now();
    
    if (this.failures >= this.threshold) {
      this.state = 'OPEN';
    }
  }
}
```

### 6.2 Retry Logic

```typescript
// packages/types/src/retry.ts
export async function withRetry<T>(
  fn: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;
      
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Exponential backoff
      await new Promise(resolve => 
        setTimeout(resolve, delay * Math.pow(2, attempt - 1))
      );
    }
  }

  throw lastError!;
}
```

## 7. Testing Service Integration

### 7.1 Unit Tests

```typescript
// services/user-service/src/services/__tests__/tenantIntegration.service.test.ts
import { TenantIntegrationService } from '../tenantIntegration.service';
import { TenantServiceClient } from '@easycode/types';

jest.mock('@easycode/types');

describe('TenantIntegrationService', () => {
  let service: TenantIntegrationService;
  let mockTenantClient: jest.Mocked<TenantServiceClient>;

  beforeEach(() => {
    mockTenantClient = {
      getTenantDetails: jest.fn(),
      getTenantEntitlements: jest.fn(),
      isServiceEnabled: jest.fn(),
    } as any;

    (TenantServiceClient as jest.Mock).mockImplementation(() => mockTenantClient);
    service = new TenantIntegrationService();
  });

  describe('validateTenant', () => {
    it('should return true for active tenant', async () => {
      mockTenantClient.getTenantDetails.mockResolvedValue({
        id: 'test-tenant',
        name: 'Test Tenant',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.validateTenant('test-tenant');
      expect(result).toBe(true);
    });

    it('should return false for inactive tenant', async () => {
      mockTenantClient.getTenantDetails.mockResolvedValue({
        id: 'test-tenant',
        name: 'Test Tenant',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const result = await service.validateTenant('test-tenant');
      expect(result).toBe(false);
    });
  });
});
```

### 7.2 Integration Tests

```typescript
// services/user-service/src/__tests__/integration/tenant-integration.test.ts
import request from 'supertest';
import app from '../../index';
import { TenantServiceClient } from '@easycode/types';

jest.mock('@easycode/types');

describe('User Service - Tenant Integration', () => {
  let mockTenantClient: jest.Mocked<TenantServiceClient>;

  beforeEach(() => {
    mockTenantClient = {
      getTenantDetails: jest.fn(),
      getTenantEntitlements: jest.fn(),
      isServiceEnabled: jest.fn(),
    } as any;

    (TenantServiceClient as jest.Mock).mockImplementation(() => mockTenantClient);
  });

  describe('POST /api/users', () => {
    it('should create user for valid active tenant', async () => {
      mockTenantClient.getTenantDetails.mockResolvedValue({
        id: 'test-tenant',
        name: 'Test Tenant',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      mockTenantClient.isServiceEnabled.mockResolvedValue(true);

      const response = await request(app)
        .post('/api/users')
        .send({
          tenantId: 'test-tenant',
          userData: {
            email: 'test@example.com',
            name: 'Test User',
          },
        });

      expect(response.status).toBe(201);
    });

    it('should reject user creation for inactive tenant', async () => {
      mockTenantClient.getTenantDetails.mockResolvedValue({
        id: 'test-tenant',
        name: 'Test Tenant',
        status: 'inactive',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/users')
        .send({
          tenantId: 'test-tenant',
          userData: {
            email: 'test@example.com',
            name: 'Test User',
          },
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Invalid or inactive tenant');
    });
  });
});
```

## 8. Best Practices

### 8.1 Service Communication
- **Use typed interfaces** for all service communications
- **Implement proper error handling** with meaningful error messages
- **Add request/response logging** for debugging
- **Use circuit breakers** for fault tolerance
- **Implement retry logic** with exponential backoff

### 8.2 Security
- **Validate tenant context** in all service operations
- **Use service-to-service authentication** (JWT tokens, API keys)
- **Implement rate limiting** to prevent abuse
- **Log security events** for monitoring

### 8.3 Performance
- **Cache tenant entitlements** to reduce API calls
- **Use connection pooling** for database connections
- **Implement request batching** where appropriate
- **Monitor service response times**

### 8.4 Monitoring
- **Add health check endpoints** to all services
- **Implement distributed tracing** (OpenTelemetry)
- **Log structured data** for better analysis
- **Set up alerts** for service failures

## 9. Development Workflow

### 9.1 Starting Services Locally

```bash
# Start all services
pnpm dev

# Start specific service
cd services/tenant-service && pnpm dev

# Start with Docker
docker-compose up
```

### 9.2 Testing

```bash
# Run all tests
pnpm test

# Run tests for specific service
cd services/tenant-service && pnpm test

# Run integration tests
pnpm test:integration
```

### 9.3 Building

```bash
# Build all services
pnpm build

# Build specific service
cd services/tenant-service && pnpm build
```

This guide provides a comprehensive approach to service integration in the EasyCode monorepo. The tenant service example demonstrates the foundational patterns that can be applied to all other services in the ecosystem. 