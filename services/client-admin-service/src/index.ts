import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import adminDefinitionRoutes from './routes/adminDefinitionRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Client Admin Service is running!');
});

// Routes for managing service definitions, features, etc.
app.use('/api/admin/definitions', adminDefinitionRoutes);

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`Client Admin Service listening on port ${PORT}`);
});

export default app;
