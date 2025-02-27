import { StatusCodes } from 'http-status-codes';
import { jobService } from '~/services/jobService';

const createNew = async (req, res, next) => {
  try {
    const createdJob = await jobService.createNew(req.body);
    res.status(StatusCodes.CREATED).json(createdJob);
  } catch (error) {
    next(error);
  }
};
const getlistJobs = async (req, res, next) => {
  try {
    const result = await jobService.getlistJobs(req.jwtDecoded.role, req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const getListJobsUser = async (req, res, next) => {
  try {
    const result = await jobService.getListJobsUser(req.query);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
export const jobController = {
  createNew,
  getlistJobs,
  getListJobsUser
};
