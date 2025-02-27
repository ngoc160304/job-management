import express from 'express';
import { candidateController } from '~/controllers/candidateController';
import { candidateValidation } from '~/validations/candidateValidation';
import { authMiddleware } from '~/middlewares/athuMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.authorize([ROLE_USER.EMPLOYER]),
    candidateController.getListCandidate
  )
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
    candidateValidation.createNew,
    candidateController.createNew
  );

export const candidateRouter = Router;
