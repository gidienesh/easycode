import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { 
  Project, 
  ProjectStatus, 
  ProjectPriority, 
  ProjectVisibility,
  CreateProjectDto, 
  UpdateProjectDto, 
  ProjectFilterDto 
} from '../models/project.model';

// Mock data store (replace with actual database)
const projects: Project[] = [
  {
    id: 'proj-1',
    tenantId: 'tenant-1',
    name: 'EasyCode Platform Enhancement',
    description: 'Major platform upgrade with new features and performance improvements',
    status: ProjectStatus.ACTIVE,
    priority: ProjectPriority.HIGH,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-06-30'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    projectManagerId: 'user-1',
    teamMemberIds: ['user-1', 'user-2', 'user-3'],
    budget: 150000,
    actualCost: 45000,
    currency: 'USD',
    progress: 65,
    completedTasks: 13,
    totalTasks: 20,
    tags: ['platform', 'enhancement', 'high-priority'],
    category: 'Development',
    isArchived: false,
    visibility: ProjectVisibility.TEAM
  },
  {
    id: 'proj-2',
    tenantId: 'tenant-1',
    name: 'Client Onboarding Automation',
    description: 'Automate the client onboarding process to reduce manual work',
    status: ProjectStatus.PLANNING,
    priority: ProjectPriority.MEDIUM,
    startDate: new Date('2024-03-01'),
    endDate: new Date('2024-05-15'),
    createdAt: new Date('2024-02-20'),
    updatedAt: new Date('2024-02-25'),
    projectManagerId: 'user-2',
    teamMemberIds: ['user-2', 'user-4'],
    budget: 75000,
    actualCost: 0,
    currency: 'USD',
    progress: 15,
    completedTasks: 2,
    totalTasks: 12,
    tags: ['automation', 'client', 'efficiency'],
    category: 'Process Improvement',
    isArchived: false,
    visibility: ProjectVisibility.ORGANIZATION
  }
];

export class ProjectController {
  // GET /v1/projects
  static async getAllProjects(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const filters: ProjectFilterDto = req.query;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      let filteredProjects = projects.filter(p => p.tenantId === tenantId);

      // Apply filters
      if (filters.status && filters.status.length > 0) {
        filteredProjects = filteredProjects.filter(p => filters.status!.includes(p.status));
      }

      if (filters.priority && filters.priority.length > 0) {
        filteredProjects = filteredProjects.filter(p => filters.priority!.includes(p.priority));
      }

      if (filters.projectManagerId) {
        filteredProjects = filteredProjects.filter(p => p.projectManagerId === filters.projectManagerId);
      }

      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProjects = filteredProjects.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.description?.toLowerCase().includes(searchLower)
        );
      }

      // Pagination
      const page = parseInt(filters.page?.toString() || '1');
      const limit = parseInt(filters.limit?.toString() || '10');
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;

      const paginatedProjects = filteredProjects.slice(startIndex, endIndex);

      res.json({
        projects: paginatedProjects,
        pagination: {
          page,
          limit,
          total: filteredProjects.length,
          totalPages: Math.ceil(filteredProjects.length / limit)
        }
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /v1/projects/:id
  static async getProjectById(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const project = projects.find(p => p.id === id && p.tenantId === tenantId);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      res.json(project);
    } catch (error) {
      console.error('Error fetching project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // POST /v1/projects
  static async createProject(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const userId = req.headers['x-user-id'] as string;
      const projectData: CreateProjectDto = req.body;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
      }

      // Validation
      if (!projectData.name || !projectData.startDate || !projectData.projectManagerId) {
        return res.status(400).json({ 
          error: 'Missing required fields: name, startDate, projectManagerId' 
        });
      }

      const newProject: Project = {
        id: uuidv4(),
        tenantId,
        name: projectData.name,
        description: projectData.description,
        status: ProjectStatus.PLANNING,
        priority: ProjectPriority.MEDIUM,
        startDate: new Date(projectData.startDate),
        endDate: projectData.endDate ? new Date(projectData.endDate) : undefined,
        createdAt: new Date(),
        updatedAt: new Date(),
        projectManagerId: projectData.projectManagerId,
        teamMemberIds: projectData.teamMemberIds || [],
        budget: projectData.budget,
        actualCost: 0,
        currency: projectData.currency || 'USD',
        progress: 0,
        completedTasks: 0,
        totalTasks: 0,
        workspaceId: projectData.workspaceId,
        tags: projectData.tags || [],
        category: projectData.category,
        templateId: projectData.templateId,
        customFields: projectData.customFields,
        isArchived: false,
        visibility: projectData.visibility || ProjectVisibility.TEAM,
        notificationSettings: projectData.notificationSettings
      };

      projects.push(newProject);

      // TODO: Send notification to project manager and team members
      // TODO: Create default tasks if template is specified
      // TODO: Integrate with finance service if budget is set

      res.status(201).json(newProject);
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // PUT /v1/projects/:id
  static async updateProject(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const userId = req.headers['x-user-id'] as string;
      const { id } = req.params;
      const updateData: UpdateProjectDto = req.body;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const projectIndex = projects.findIndex(p => p.id === id && p.tenantId === tenantId);

      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }

      const existingProject = projects[projectIndex];

      // Update project
      const updatedProject: Project = {
        ...existingProject,
        ...updateData,
        updatedAt: new Date(),
        // Preserve certain fields that shouldn't be overwritten
        id: existingProject.id,
        tenantId: existingProject.tenantId,
        createdAt: existingProject.createdAt
      };

      projects[projectIndex] = updatedProject;

      // TODO: Send notifications for significant changes
      // TODO: Update related tasks if project dates change
      // TODO: Integrate with finance service if budget changes

      res.json(updatedProject);
    } catch (error) {
      console.error('Error updating project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // DELETE /v1/projects/:id
  static async deleteProject(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const projectIndex = projects.findIndex(p => p.id === id && p.tenantId === tenantId);

      if (projectIndex === -1) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Instead of hard delete, mark as archived
      projects[projectIndex].isArchived = true;
      projects[projectIndex].updatedAt = new Date();

      // TODO: Archive all related tasks
      // TODO: Send notification to team members
      // TODO: Update finance records

      res.json({ message: 'Project archived successfully' });
    } catch (error) {
      console.error('Error deleting project:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  // GET /v1/projects/:id/dashboard
  static async getProjectDashboard(req: Request, res: Response) {
    try {
      const tenantId = req.headers['x-tenant-id'] as string;
      const { id } = req.params;

      if (!tenantId) {
        return res.status(400).json({ error: 'Tenant ID is required' });
      }

      const project = projects.find(p => p.id === id && p.tenantId === tenantId);

      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }

      // Mock dashboard data
      const dashboard = {
        project: {
          id: project.id,
          name: project.name,
          status: project.status,
          progress: project.progress,
          budget: project.budget,
          actualCost: project.actualCost
        },
        metrics: {
          totalTasks: project.totalTasks,
          completedTasks: project.completedTasks,
          overdueTasks: 2, // Mock data
          upcomingDeadlines: 3, // Mock data
          teamProductivity: 85, // Mock data
          budgetUtilization: project.budget ? (project.actualCost || 0) / project.budget * 100 : 0
        },
        recentActivity: [
          {
            id: '1',
            action: 'Task completed',
            description: 'Database migration task completed',
            timestamp: new Date(),
            userId: 'user-1'
          }
        ],
        upcomingMilestones: [
          {
            id: '1',
            name: 'Beta Release',
            dueDate: new Date('2024-04-15'),
            progress: 75
          }
        ]
      };

      res.json(dashboard);
    } catch (error) {
      console.error('Error fetching project dashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 