import express, { Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import activityRoutesV1 from './routes/v1/activityRoutes';
import leadRoutesV1 from './routes/v1/leadRoutes';
// import other v1 routes as they are created

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('CRM Service is running!');
});

// Mount V1 routes
app.use('/v1/activities', activityRoutesV1);
app.use('/v1/leads', leadRoutesV1);
// app.use('/v1/contacts', contactRoutesV1);
// app.use('/v1/accounts', accountRoutesV1);


app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

app.listen(PORT, () => {
  console.log(`CRM Service listening on port ${PORT}`);
});

export default app;
