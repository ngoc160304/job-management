import { complainModel } from '~/models/complainModel';
const getListComplain = async () => {
  try {
    const reuslt = await complainModel.getListComplain();
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const createNew = async (reqBody) => {
  try {
    const result = await complainModel.createNew(reqBody);
    const getNewComplain = await complainModel.findOneById(result.insertedId);
    return getNewComplain;
  } catch (error) {
    throw error;
  }
};
const resolve = async (complainId) => {
  try {
    const reuslt = await complainModel.resolve(complainId);
    return reuslt;
  } catch (error) {
    throw error;
  }
};
export const complainSercice = {
  getListComplain,
  createNew,
  resolve
};
