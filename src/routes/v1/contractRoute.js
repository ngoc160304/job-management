import express from 'express';
import { contractController } from '~/controllers/contractController';
import { contractValidation } from '~/validations/contractValidation';
import { authMiddleware } from '~/middlewares/athuMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/')
  .get(
    authMiddleware.isAuthorized,
    authMiddleware.authorize(ROLE_USER.ADMIN),
    contractController.getListContract
  )
  .post(
    authMiddleware.isAuthorized,
    authMiddleware.authorize(ROLE_USER.JOB_SEEKER),
    contractValidation.createNew,
    contractController.createNew
  );
Router.route('/admin/change-status/:id').put(
  authMiddleware.isAuthorized,
  authMiddleware.authorize(ROLE_USER.ADMIN),
  contractController.changStatus
);

export const contractRouter = Router;
