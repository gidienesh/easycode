import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import saleRoutesV1 from './routes/v1/saleRoutes';
import registerRoutesV1 from './routes/v1/registerRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3011;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('POS Service is running!'));
app.use('/v1/sales', saleRoutesV1);
app.use('/v1/registers', registerRoutesV1);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`POS Service listening on port ${PORT}`));
export default app;
