# Project Management Service - Development Guide

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- TypeScript knowledge
- Understanding of EasyCode architecture

### Installation

1. **Install dependencies**:
```bash
cd services/project-management-service
pnpm install
```

2. **Set up environment**:
```bash
cp .env.example .env
# Edit .env with your configuration
```

3. **Start development server**:
```bash
pnpm dev
```

4. **Test the service**:
```bash
curl http://localhost:3012/health
```

## 📁 Project Structure

```
src/
├── controllers/          # Request handlers
│   ├── project.controller.ts
│   ├── task.controller.ts
│   └── ...
├── models/              # TypeScript interfaces
│   ├── project.model.ts
│   ├── task.model.ts
│   └── ...
├── routes/              # API route definitions
│   └── v1/
│       ├── projectRoutes.ts
│       └── ...
├── services/            # Business logic (to be added)
├── middleware/          # Custom middleware (to be added)
├── utils/              # Helper functions (to be added)
└── index.ts            # Main server file
```

## 🔧 Current Implementation Status

### ✅ Completed
- [x] Basic server setup with Express
- [x] TypeScript configuration
- [x] Project model definitions
- [x] Task model definitions
- [x] Basic project CRUD controller
- [x] Project routes (V1 API)
- [x] Health check endpoints
- [x] Mock data for development

### 🚧 In Progress
- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Authentication middleware
- [ ] Task controller implementation
- [ ] File upload handling
- [ ] Service integration layers

### 📋 TODO
- [ ] Milestone management
- [ ] Time tracking
- [ ] Workspace management
- [ ] Comment system
- [ ] Attachment handling
- [ ] Notification integration
- [ ] Real-time updates (WebSocket)
- [ ] Advanced reporting
- [ ] Gantt chart data API
- [ ] Resource allocation
- [ ] Project templates
- [ ] Bulk operations
- [ ] Data export/import
- [ ] Audit logging
- [ ] Performance optimization

## 🌐 API Endpoints

### Projects API (v1)
```
GET    /v1/projects              # List all projects
GET    /v1/projects/:id          # Get project by ID
POST   /v1/projects              # Create new project
PUT    /v1/projects/:id          # Update project
DELETE /v1/projects/:id          # Archive project
GET    /v1/projects/:id/dashboard # Get project dashboard
```

### Tasks API (v1) - Coming Soon
```
GET    /v1/tasks                 # List tasks
POST   /v1/tasks                 # Create task
PUT    /v1/tasks/:id             # Update task
DELETE /v1/tasks/:id             # Delete task
```

## 🔌 Integration Points

### Required Headers
```
x-tenant-id: string    # Multi-tenant isolation
x-user-id: string      # User context
Authorization: Bearer <token>  # Authentication
```

### External Services
- **User Service**: Authentication, user profiles
- **Tenant Service**: Multi-tenant configuration
- **Notification Service**: Task assignments, deadlines
- **Finance Service**: Budget tracking, cost allocation
- **HR Service**: Resource allocation, skills matching

## 🧪 Testing

### Manual Testing
```bash
# Test health endpoint
curl http://localhost:3012/health

# Test projects endpoint (with headers)
curl -H "x-tenant-id: tenant-1" \
     -H "x-user-id: user-1" \
     http://localhost:3012/v1/projects
```

### Unit Tests (To be implemented)
```bash
pnpm test
```

## 🎨 Frontend Integration

The service is designed to work with the main UI application:
- **Projects Page**: `/projects` - Main project listing
- **Project Detail**: `/projects/:id` - Individual project view
- **Task Board**: `/projects/:id/tasks` - Kanban task management
- **Gantt Chart**: `/projects/:id/gantt` - Timeline visualization
- **Reports**: `/projects/reports` - Analytics and reporting

## 🔒 Security Considerations

- Multi-tenant data isolation via `tenantId`
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting implemented
- CORS configuration
- Helmet security headers

## 🚀 Deployment

### Development
```bash
pnpm dev
```

### Production
```bash
pnpm build
pnpm start
```

### Docker (Future)
```bash
docker build -t project-management-service .
docker run -p 3012:3012 project-management-service
```

## 📊 Monitoring & Logging

- Health check endpoint: `/health`
- Structured logging with timestamps
- Request/response logging via Morgan
- Error tracking and reporting

## 🤝 Contributing

1. Follow existing code patterns
2. Add TypeScript types for all data structures
3. Include proper error handling
4. Add JSDoc comments for public methods
5. Test API endpoints manually
6. Update this README for significant changes

## 🔗 Related Documentation

- [Main Architecture Guide](../../docs/architecture/)
- [API Design Guidelines](../../docs/architecture/api-design-guidelines.md)
- [Multi-tenant Strategy](../../docs/architecture/hybrid-tenancy-and-deployment.md)
- [Frontend Integration](../../apps/main-ui/README.md) 