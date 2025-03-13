import { candidateES } from '~/elasticsearch/candidateES';
import { candidateModel } from '~/models/candidateModel';
const createNew = async (reqBody, user) => {
  try {
    const result = await candidateModel.createNew(reqBody);
    const getNewCandidate = await candidateModel.findOneById(result.insertedId);
    await candidateES.createNew(getNewCandidate, user);
    return getNewCandidate;
  } catch (error) {
    throw error;
  }
};
const update = async (candidateId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    };
    const updatedCandidate = await candidateModel.update(candidateId, updateData);
    return updatedCandidate;
  } catch (error) {
    throw error;
  }
};
const getListCandidates = async (user) => {
  try {
    const result = await candidateES.getListCandidates(user);
    return result;
  } catch (error) {
    throw error;
  }
};
export const candidateSercice = {
  createNew,
  update,
  getListCandidates
};
