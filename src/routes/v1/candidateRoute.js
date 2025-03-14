import express from 'express';
import { candidateController } from '~/controllers/candidateController';
import { candidateValidation } from '~/validations/candidateValidation';
import { authMiddleware } from '~/middlewares/authMiddleware';
import { ROLE_USER } from '~/utils/constants';
import { cloudProvider } from '~/providers/cloudinaryProvider';
const multer = require('multer');

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed!'), false);
    }
  },
  limits: {
    fileSize: 5 * 1024 * 1024
  }
});
const Router = express.Router();

Router.route('/').post(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.JOB_SEEKER]),
  upload.single('cvLink'),
  cloudProvider.handleUpload,
  candidateValidation.createNew,
  candidateController.createNew
);

/** Xóa */
// Router.route('/delete/:id').delete(
//   authMiddleware.isAuthorized,
//   authMiddleware.authorize([ROLE_USER.EMPLOYER]),
//   candidateController.deleteCandidate
// );
/** Thay đổi trạng thái */
// Router.route('/change-status/:id')
/** xem chi tiết */
// Router.route('/details/:id');
Router.route('/list-candidate').get(
  authMiddleware.isAuthorized,
  authMiddleware.authorize([ROLE_USER.EMPLOYER]),
  candidateController.getListCandidates
);
export const candidateRouter = Router;
