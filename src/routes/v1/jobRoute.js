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
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  jobController.getlistJobs
);
Router.route('/admin/list-jobs').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  jobController.getListJobsAdmin
);
Router.route('/admin/chang-status/:id').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  jobController.changStatus
);
Router.route('/user/list-jobs').get(jobController.getListJobsUser);
export const jobRouter = Router;
