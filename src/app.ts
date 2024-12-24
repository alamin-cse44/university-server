import express, { Application, Request, Response } from 'express';
const app: Application = express();
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import cookieParser from 'cookie-parser';

// parser
app.use(express.json());
app.use(cookieParser())
app.use(cors({origin: ['http://localhost:5173']}));

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
