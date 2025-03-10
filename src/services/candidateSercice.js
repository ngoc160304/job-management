import { candidateModel } from '~/models/candidateModel';
const createNew = async (reqBody) => {
  try {
    const result = await candidateModel.createNew(reqBody);
    const getNewCandidate = await candidateModel.findOneById(result.insertedId);
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
export const candidateSercice = {
  createNew,
  update
};
