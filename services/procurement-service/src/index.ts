import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import poRoutesV1 from './routes/v1/poRoutes';
import supplierRoutesV1 from './routes/v1/supplierRoutes';
import requisitionRoutesV1 from './routes/v1/requisitionRoutes';
import goodsReceiptRoutesV1 from './routes/v1/goodsReceiptRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3007;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('Procurement Service is running!'));

app.use('/v1/purchase-orders', poRoutesV1);
app.use('/v1/suppliers', supplierRoutesV1);
app.use('/v1/requisitions', requisitionRoutesV1);
app.use('/v1/goods-receipts', goodsReceiptRoutesV1);
// Add other routes for RFx, contracts, etc.

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`Procurement Service listening on port ${PORT}`));
export default app;
