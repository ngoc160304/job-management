import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const COMPLAIN_COLLECTION_NAME = 'complains';
const COMPLAIN_COLLECTION_SHEMA = Joi.object({
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  isResolved: Joi.boolean().default(false),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await COMPLAIN_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newComplain = {
      ...valiData,
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId)
    };
    return await GET_DB().collection(COMPLAIN_COLLECTION_NAME).insertOne(newComplain);
  } catch (error) {
    throw new Error(error);
  }
};
const getListComplain = async () => {
  try {
    const reuslt = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .find({
        _destroy: false
      })
      .toArray();
    return reuslt;
  } catch (error) {
    throw error;
  }
};
const resolve = async (complainId) => {
  try {
    const result = await GET_DB()
      .collection(COMPLAIN_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(complainId.toString())
        },
        {
          $set: {
            isResolved: true
          }
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
const statisticsComplain = async () => {
  try {
    const complains = await GET_DB().collection(COMPLAIN_COLLECTION_NAME).countDocuments({
      _destroy: false
    });

    return complains;
  } catch (error) {
    throw new Error(error);
  }
};
export const complainModel = {
  COMPLAIN_COLLECTION_NAME,
  COMPLAIN_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListComplain,
  resolve,
  statisticsComplain
};
