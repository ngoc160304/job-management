import { jobModel } from '~/models/jobModel';
const createNew = async (reqBody) => {
  try {
    const createdJob = await jobModel.createNew(reqBody);
    const getNewJob = await jobModel.findOneById(createdJob.insertedId);
    return getNewJob;
  } catch (error) {
    throw error;
  }
};
const getlistJobs = async (user, reqQuey) => {
  try {
    const result = await jobModel.getlistJobs(user, reqQuey);
    return result;
  } catch (error) {
    throw error;
  }
};
const getListJobsUser = async (reqQuery) => {
  try {
    const result = await jobModel.getListJobsUser(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
export const jobService = {
  createNew,
  getlistJobs,
  getListJobsUser
};
