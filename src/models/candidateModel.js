import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
const CANDIDATE_COLLECTION_NAME = 'candidates';
const CANDIDATE_COLLECTION_SHEMA = Joi.object({
  jobSeekerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  jobId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  employerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  coverLetter: Joi.string().required().min(100).max(10000),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await CANDIDATE_COLLECTION_SHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newCandidate = {
      ...valiData,
      jobSeekerId: ObjectId.createFromHexString(valiData.jobSeekerId),
      jobId: ObjectId.createFromHexString(valiData.jobId),
      employerId: ObjectId.createFromHexString(valiData.employerId)
    };
    return await GET_DB().collection(CANDIDATE_COLLECTION_NAME).insertOne(newCandidate);
  } catch (error) {
    throw new Error(error);
  }
};
const getListCandidate = async () => {
  try {
    const reuslt = await GET_DB()
      .collection(CANDIDATE_COLLECTION_NAME)
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
      .collection(CANDIDATE_COLLECTION_NAME)
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
const statisticsCandidate = async () => {
  try {
    const jobs = await GET_DB().collection(CANDIDATE_COLLECTION_NAME).countDocuments({
      _destroy: false
    });

    return jobs;
  } catch (error) {
    throw new Error(error);
  }
};
export const candidateModel = {
  CANDIDATE_COLLECTION_NAME,
  CANDIDATE_COLLECTION_SHEMA,
  createNew,
  findOneById,
  getListCandidate,
  udpate,
  statisticsCandidate
};
