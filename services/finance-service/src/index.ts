import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import apRoutesV1 from './routes/v1/apRoutes';
import arRoutesV1 from './routes/v1/arRoutes';
import glRoutesV1 from './routes/v1/glRoutes';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3008;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('Finance Service is running!'));
app.use('/v1/ap', apRoutesV1); // Accounts Payable
app.use('/v1/ar', arRoutesV1); // Accounts Receivable
app.use('/v1/gl', glRoutesV1); // General Ledger
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`Finance Service listening on port ${PORT}`));
export default app;
