import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import shipmentRoutesV1 from './routes/v1/shipmentRoutes';
import carrierRoutesV1 from './routes/v1/carrierRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3010;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('Logistics Service is running!'));
app.use('/v1/shipments', shipmentRoutesV1);
app.use('/v1/carriers', carrierRoutesV1);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`Logistics Service listening on port ${PORT}`));
export default app;
