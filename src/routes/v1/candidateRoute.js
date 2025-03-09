import express from 'express';
import { candidateController } from '~/controllers/candidateController';
import { candidateValidation } from '~/validations/candidateValidation';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
  candidateValidation.createNew,
  candidateController.createNew
);
export const candidateRouter = Router;
