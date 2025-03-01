import { contractModel } from '~/models/contractModel';
const getListContract = async () => {
  try {
    const reuslt = await contractModel.getListContract();
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const createNew = async (reqBody) => {
  try {
    const result = await contractModel.createNew(reqBody);
    const getNewContract = await contractModel.findOneById(result.insertedId);
    return getNewContract;
  } catch (error) {
    throw error;
  }
};
const update = async (contractId, reqBody) => {
  try {
    const updateData = {
      ...reqBody,
      updatedAt: Date.now()
    };
    const updatedContract = await contractModel.update(contractId, updateData);
    return updatedContract;
  } catch (error) {
    throw error;
  }
};
const changStatus = async (contractId, stauts) => {
  try {
    const updatedContract = await contractModel.changStatus(contractId, stauts);
    return updatedContract;
  } catch (error) {
    throw error;
  }
};
export const contractSercice = {
  getListContract,
  createNew,
  update,
  changStatus
};
