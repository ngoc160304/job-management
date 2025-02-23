/* eslint-disable no-console */
import express from 'express';
import { CLOSE_DB, CONNECT_DB } from '~/config/mongodb';
import cors from 'cors';
// import { mapOrder } from '~/utils/sorts.js';
// import { mapOrder } from '~/utils/sorts';
import { errorHandlingMiddleware } from './middlewares/errorHandlingMiddleware';
import exitHook from 'async-exit-hook';
import { env } from './config/environment';
// import { APIs_V1 } from '~/routes/v1';
import { corsOptions } from './config/cors';
import cookieParser from 'cookie-parser';
const START_SERVER = () => {
  const app = express();
  app.use(cookieParser());
  app.use(cors(corsOptions));
  app.use(express.json());
  app.use(errorHandlingMiddleware);
  app.listen(env.APP_PORT, env.APP_HOST, () => {
    // eslint-disable-next-line no-console
    console.log(`Running at ${env.APP_HOST}:${env.APP_PORT}/`);
  });
  exitHook(() => {
    CLOSE_DB();
  });
};
(async () => {
  try {
    await CONNECT_DB();
    console.log('Connected to MongoDB Cloud Atlas!');
    START_SERVER();
  } catch (error) {
    console.log(error);
    process.exit(0);
  }
})();
