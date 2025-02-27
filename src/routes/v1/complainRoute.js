import express from 'express';
import { complainController } from '~/controllers/complainController';
import { complainValidation } from '~/validations/complainValidation';
import { authMiddleware } from '~/middlewares/athuMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.authorize([ROLE_USER.ADMIN]),
    complainController.getListComplain
  )
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
    complainValidation.createNew,
    complainController.createNew
  );
Router.route('/resolve/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  complainController.resolve
);

export const complainRouter = Router;
