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
const getListJobsAdmin = async (reqQuery) => {
  try {
    const result = await jobModel.getListJobsAdmin(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
const changStatus = async (jobId, status) => {
  try {
    const result = await jobModel.changStatus(jobId, status);
    return result;
  } catch (error) {
    throw error;
  }
};
export const jobService = {
  createNew,
  getlistJobs,
  getListJobsUser,
  getListJobsAdmin,
  changStatus
};
