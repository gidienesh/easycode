import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes (will be created)
import projectRoutesV1 from './routes/v1/projectRoutes';
import taskRoutesV1 from './routes/v1/taskRoutes';
import milestoneRoutesV1 from './routes/v1/milestoneRoutes';
import timeTrackingRoutesV1 from './routes/v1/timeTrackingRoutes';
import workspaceRoutesV1 from './routes/v1/workspaceRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3012; // Unique port for project management service

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// General middleware
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({
    service: 'Project Management Service',
    status: 'running',
    version: '0.1.0',
    timestamp: new Date().toISOString()
  });
});

app.get('/health', (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// API Routes - V1
app.use('/v1/projects', projectRoutesV1);
app.use('/v1/tasks', taskRoutesV1);
app.use('/v1/milestones', milestoneRoutesV1);
app.use('/v1/time-tracking', timeTrackingRoutesV1);
app.use('/v1/workspaces', workspaceRoutesV1);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl,
    method: req.method
  });
});

// Global error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error('Error:', err.stack);
  
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Project Management Service listening on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 Health check: http://localhost:${PORT}/health`);
});

export default app; 