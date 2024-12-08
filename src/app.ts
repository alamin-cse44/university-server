import express, { Application, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';

// parser
app.use(express.json());
app.use(cors());

// application routing
app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

const test = async (req: Request, res: Response) => {
  Promise.reject();
};

app.get('/test', test);

// global error handler
app.use(globalErrorHandler);

// not found
app.use(notFound);

export default app;
