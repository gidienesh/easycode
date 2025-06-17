import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import notificationRoutesV1 from './routes/v1/notificationRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3005;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('Notification Service is running!'));
app.use('/v1/notifications', notificationRoutesV1); // Or just /v1/send
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`Notification Service listening on port ${PORT}`));
export default app;
