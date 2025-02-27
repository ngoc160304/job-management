import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const CONTRACT_COLLECTION_NAME = 'contracts';
const CONTRACT_COLLECTION_SHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  description: Joi.string().required().min(100).max(10000).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  isAllow: Joi.boolean().default(false),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await CONTRACT_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newContract = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId)
    };
    return await GET_DB().collection(CONTRACT_COLLECTION_NAME).insertOne(newContract);
  } catch (error) {
    throw new Error(error);
  }
};
const getListContract = async () => {
  try {
    const reuslt = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .find({
        _destroy: false
      })
      .toArray();
    return reuslt;
  } catch (error) {
    throw error;
  }
};

const udpate = async (contractId, updateData) => {
  try {
    const result = await GET_DB()
      .collection(CONTRACT_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(contractId.toString())
        },
        {
          $set: updateData
        },
        {
          returnDocument: 'after'
        }
      );
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

export const contractModel = {
  CONTRACT_COLLECTION_NAME,
  CONTRACT_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListContract,
  udpate
};
