import express from 'express';
import { jobRouter } from './jobRoute';
import { complainRouter } from './complainRoute';
import { contractRouter } from './contractRoute';
import { candidateRouter } from './candidateRoute';
import { authRouter } from './authRoute';
import { userRouter } from './userRoute';
const Router = express.Router();

Router.use('/auth', authRouter);
Router.use('/jobs', jobRouter);
Router.use('/complains', complainRouter);
Router.use('/contracts', contractRouter);
Router.use('/candidates', candidateRouter);
Router.use('/users', userRouter);

export const APIs_V1 = Router;
