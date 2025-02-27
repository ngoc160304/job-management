import express from 'express';
import { userRouter } from './userRoute';
import { jobRouter } from './jobRoute';
import { complainRouter } from './complainRoute';
import { contractRouter } from './contractRoute';
import { candidateRouter } from './candidateRoute';
const Router = express.Router();

Router.use('/users', userRouter);
Router.use('/jobs', jobRouter);
Router.use('/complains', complainRouter);
Router.use('/contracts', contractRouter);
Router.use('/candidates', candidateRouter);

export const APIs_V1 = Router;
