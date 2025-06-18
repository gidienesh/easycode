import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Root route
app.get('/', (req: Request, res: Response) => {
  res.send('User Service is running!');
});

// Mount user routes
app.use('/api/users', userRoutes);

// Basic error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`User Service listening on port ${PORT}`);
});

export default app; // For potential testing or OpenNext
