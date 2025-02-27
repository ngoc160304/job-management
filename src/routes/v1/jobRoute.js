import express from 'express';
import { jobController } from '~/controllers/jobController';
import { jobValidation } from '~/validations/jobValidation';
import { authMiddleware } from '~/middlewares/athuMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  jobValidation.createNew,
  jobController.createNew
);
Router.route('/list-jobs').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER, ROLE_USER.ADMIN]),
  jobController.getlistJobs
);
Router.route('/list-jobs-user').get(jobController.getListJobsUser);
export const jobRouter = Router;
