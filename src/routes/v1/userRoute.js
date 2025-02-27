import express from 'express';
import { userController } from '~/controllers/userController';
import { userValidations } from '~/validations/userValidation';
import { authMiddleware } from '~/middlewares/athuMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/').post(userValidations.createNew, userController.createNew);
Router.route('/login').post(userValidations.login, userController.login);
Router.route('/refresh_token').get(userController.refreshToken);
Router.route('/logout').delete(userController.logout);
Router.route('/statistics').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.statistics
);
export const userRouter = Router;
