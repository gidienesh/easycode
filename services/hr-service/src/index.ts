import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import employeeRoutesV1 from './routes/v1/employeeRoutes';
import payrollRoutesV1 from './routes/v1/payrollRoutes';
import leaveRoutesV1 from './routes/v1/leaveRoutes'; // Added this line

dotenv.config();
const app = express();
const PORT = process.env.PORT || 3009;
app.use(express.json());
app.get('/', (req: Request, res: Response) => res.send('HR Service is running!'));

app.use('/v1/employees', employeeRoutesV1);
app.use('/v1/payroll', payrollRoutesV1);
app.use('/v1/leave', leaveRoutesV1); // Added this line

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
app.listen(PORT, () => console.log(`HR Service listening on port ${PORT}`));
export default app;
