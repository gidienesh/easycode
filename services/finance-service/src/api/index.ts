import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';

// Import routes
import glRoutes from './routes/gl.routes';
import apRoutes from './routes/ap.routes';
import arRoutes from './routes/ar.routes';
import faRoutes from './routes/fa.routes';
import reportRoutes from './routes/report.routes';
import dashboardRoutes from './routes/dashboard.routes';

const app = express();
const PORT = process.env.PORT || 3013;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3013'],
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Limit each IP to 1000 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(compression());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging
app.use(morgan('combined'));

// Tenant validation middleware
app.use((req, res, next) => {
  const tenantId = req.headers['x-tenant-id'] as string;
  const userId = req.headers['x-user-id'] as string;
  
  if (!tenantId) {
    return res.status(400).json({ error: 'x-tenant-id header is required' });
  }
  
  if (!userId) {
    return res.status(400).json({ error: 'x-user-id header is required' });
  }
  
  req.tenantId = tenantId;
  req.userId = userId;
  next();
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    service: 'finance-service',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// API routes
app.use('/api/v1/gl', glRoutes);
app.use('/api/v1/ap', apRoutes);
app.use('/api/v1/ar', arRoutes);
app.use('/api/v1/fa', faRoutes);
app.use('/api/v1/reports', reportRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Finance Service Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Finance Service endpoint not found' });
});

app.listen(PORT, () => {
  console.log(`🏛️ Finance Service API running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

// Type declarations
declare global {
  namespace Express {
    interface Request {
      tenantId: string;
      userId: string;
    }
  }
}

export default app; 