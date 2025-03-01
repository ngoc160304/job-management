import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { JOB_LOCATION, STATUS } from '~/utils/constants';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';

const JOB_COLLECTION_NAME = 'jobs';
const JOB_COLLECTION_SCHEMA = Joi.object({
  creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
  title: Joi.string().required().min(3).max(50).trim().strict(),
  description: Joi.string().required().min(3).max(256).trim().strict(),
  benefit: Joi.string().required().min(3).max(256).trim().strict(),
  requirements: Joi.array().required(),
  salary: Joi.number().required().min(200),
  status: Joi.string()
    .valid(STATUS.ACTIVE, STATUS.INACTIVE, STATUS.PENDING, STATUS.REJECT)
    .default(STATUS.PENDING),
  applicationDeadline: Joi.date().greater('now'),
  jobLocation: Joi.string()
    .required()
    .valid(...JOB_LOCATION)
    .min(3)
    .max(50)
    .trim()
    .strict(),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
});
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const validateBeforeCreate = async (data) => {
  return await JOB_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    const newJob = {
      ...valiData,
      creatorId: ObjectId.createFromHexString(valiData.creatorId)
    };
    return await GET_DB().collection(JOB_COLLECTION_NAME).insertOne(newJob);
  } catch (error) {
    throw new Error(error);
  }
};
const getlistJobs = async (user, reqQuery) => {
  try {
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (parseInt(reqQuery.page) - 1) * limit || 0;
    let jobs = null;
    jobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .aggregate([
        { $match: { creatorId: ObjectId.createFromHexString(user._id), _destroy: false } },
        { $sort: { createdAt: -1 } },
        { $skip: skip },
        { $limit: limit }
      ])
      .toArray();
    let result = {
      jobs: jobs
    };

    if (reqQuery.limit) {
      const totalJobs = jobs.length;
      result = {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        limit: limit,
        page: reqQuery.page || 1,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const statisticsJobs = async () => {
  try {
    const jobs = await GET_DB().collection(JOB_COLLECTION_NAME).countDocuments({
      _destroy: false
    });

    return jobs;
  } catch (error) {
    throw new Error(error);
  }
};
const getListJobsUser = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery.limit) || 3;
    const skip = (parseInt(reqQuery.page) - 1) * limit || 0;
    const listJobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .find({
        _destroy: false,
        status: 'active'
      })
      .skip(skip)
      .limit(limit)
      .sort({
        createdAt: -1
      })
      .toArray();
    let result = {
      jobs: listJobs
    };
    if (reqQuery.limit) {
      const totalJobs = listJobs.length;
      result = {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        limit: limit,
        page: reqQuery.page || 1,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getListJobsAdmin = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (parseInt(reqQuery.page) - 1) * limit || 0;
    let jobs = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .find({
        _destroy: false
      })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
    let result = {
      jobs: jobs
    };

    if (reqQuery.limit) {
      const totalJobs = jobs.length;
      result = {
        totalJobs,
        totalPages: Math.ceil(totalJobs / limit),
        limit: limit,
        page: reqQuery.page || 1,
        ...result
      };
    }
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const changStatus = async (jobId, status) => {
  try {
    const result = await GET_DB()
      .collection(JOB_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(jobId.toString())
        },
        {
          $set: {
            status: status
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
export const jobModel = {
  JOB_COLLECTION_NAME,
  JOB_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  getlistJobs,
  statisticsJobs,
  getListJobsUser,
  getListJobsAdmin,
  changStatus
};
