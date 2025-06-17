import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import tenantRoutes from './routes/tenantRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Tenant Service is running!');
});

app.use('/api/tenants', tenantRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Tenant Service listening on port ${PORT}`);
});

export default app;
