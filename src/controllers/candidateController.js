import { StatusCodes } from 'http-status-codes';
import { candidateSercice } from '~/services/candidateSercice';

const createNew = async (req, res, next) => {
  try {
    const result = await candidateSercice.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};

export const candidateController = {
  createNew
};
