/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import ApiError from '~/utils/ApiError';
import { ROLE_USER, STATUS } from '~/utils/constants';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  OBJECT_ID_RULE,
  OBJECT_ID_RULE_MESSAGE
} from '~/utils/validators';
import { contractModel } from './contractModel';

const USER_COLLECTION_NAME = 'users';
const shemaValidation = {
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required(),
  role: Joi.string()
    .required()
    .valid(ROLE_USER.ADMIN, ROLE_USER.EMPLOYER, ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER),
  status: Joi.string().valid(STATUS.ACTIVE, STATUS.INACTIVE).default(STATUS.ACTIVE),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
};
let USER_COLLECTION_SCHEMA = Joi.object(shemaValidation);

const validateBeforeCreate = async (data) => {
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const validateBeforeCreateAdmin = async (data) => {
  if (data?.role === ROLE_USER.ADMIN) {
    throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorize !');
  } else if (data?.role === ROLE_USER.EMPLOYER) {
    USER_COLLECTION_SCHEMA = Joi.object({
      ...shemaValidation,
      companyName: Joi.string().required().min(3).max(55).trim().strict()
    });
  } else if (data?.role === ROLE_USER.INTERVIEER) {
    USER_COLLECTION_SCHEMA = Joi.object({
      ...shemaValidation,
      employerId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE)
    });
  }
  return await USER_COLLECTION_SCHEMA.validateAsync(data, { abortEarly: false });
};
const findOneById = async (id) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOne({
        _id: ObjectId.createFromHexString(id.toString())
      });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const findOneByEmail = async (email) => {
  try {
    const result = await GET_DB().collection(USER_COLLECTION_NAME).findOne({
      //  _id: new ObjectId(id),
      email: email,
      _destroy: false
    });
    return result;
  } catch (error) {
    throw new Error(error);
  }
};

const createNew = async (data) => {
  try {
    const valiData = await validateBeforeCreate(data);
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(valiData);
  } catch (error) {
    throw new Error(error);
  }
};
const createNewUserAdmin = async (data) => {
  try {
    const valiData = await validateBeforeCreateAdmin(data);
    if (valiData?.employerId) {
      valiData.employerId = ObjectId.createFromHexString(valiData.employerId);
    }
    return await GET_DB().collection(USER_COLLECTION_NAME).insertOne(valiData);
  } catch (error) {
    throw new Error(error);
  }
};
const statisticsUser = async () => {
  try {
    const users = await GET_DB().collection(USER_COLLECTION_NAME).countDocuments({
      _destroy: false
    });

    return users;
  } catch (error) {
    throw new Error(error);
  }
};
const getListUser = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (parseInt(reqQuery.page) - 1) * limit || 0;
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .find({
        _destroy: false
      })
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const getListEmployer = async (reqQuery) => {
  try {
    const limit = parseInt(reqQuery.limit) || 10;
    const skip = (parseInt(reqQuery.page) - 1) * limit || 0;
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .aggregate([
        {
          $lookup: {
            from: contractModel.CONTRACT_COLLECTION_NAME,
            localField: '_id',
            foreignField: 'creatorId',
            as: 'contract'
          }
        },
        {
          $match: {
            'contract.isAllow': true,
            _destroy: false
          }
        },
        {
          $project: {
            password: 0
          }
        }
      ])
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 })
      .toArray();
    return result;
  } catch (error) {
    throw new Error(error);
  }
};
const deleteUser = async (userId) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(userId.toString())
        },
        {
          $set: {
            _destroy: true
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
const update = async (userId, dataUpdate) => {
  try {
    const result = await GET_DB()
      .collection(USER_COLLECTION_NAME)
      .findOneAndUpdate(
        {
          _id: ObjectId.createFromHexString(userId.toString())
        },
        {
          $set: dataUpdate
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
export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  statisticsUser,
  getListUser,
  getListEmployer,
  createNewUserAdmin,
  deleteUser,
  update
};
