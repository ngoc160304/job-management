import { StatusCodes } from 'http-status-codes';
import { candidateSercice } from '~/services/candidateSercice';

const createNew = async (req, res, next) => {
  try {
    const result = await candidateSercice.createNew(req.body, req.jwtDecoded);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListCandidates = async (req, res, next) => {
  try {
    const result = await candidateSercice.getListCandidates(req.jwtDecoded);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const deleteCandidate = async (req, res, next) => {
  try {
    const result = await candidateSercice.deleteCandidate(req.params.id);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const candidateController = {
  createNew,
  getListCandidates,
  deleteCandidate
};
