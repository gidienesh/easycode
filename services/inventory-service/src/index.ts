import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import itemRoutesV1 from './routes/v1/itemRoutes';
import stockRoutesV1 from './routes/v1/stockRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3006;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('Inventory Service is running!'));
app.use('/v1/items', itemRoutesV1);
app.use('/v1/stock', stockRoutesV1);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`Inventory Service listening on port ${PORT}`));
export default app;
