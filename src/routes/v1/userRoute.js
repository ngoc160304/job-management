import express from 'express';
import { userController } from '~/controllers/userController';
import { userValidations } from '~/validations/userValidation';
import { authMiddleware } from '~/middlewares/athuMiddleware';
import { ROLE_USER } from '~/utils/constants';
const Router = express.Router();

Router.route('/').post(userValidations.createNew, userController.createNew);
Router.route('/admin').post(userController.createNewAdmin);
Router.route('/login').post(userValidations.login, userController.login);
Router.route('/refresh_token').get(userController.refreshToken);
Router.route('/logout').delete(userController.logout);
Router.route('/admin/statistics').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.statistics
);
Router.route('/admin/list-user').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.getListUser
);
Router.route('/list-employer').get(userController.getListEmployer);

Router.route('/delete/:id').delete(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.ADMIN]),
  userController.deleteUser
);
Router.route('/update/:id').put(authMiddleware.isAuthorized, userController.update);
export const userRouter = Router;
