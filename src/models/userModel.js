/* eslint-disable indent */
import Joi from 'joi';
import { ObjectId } from 'mongodb';
import { GET_DB } from '~/config/mongodb';
import { ROLE_USER, SKILLS } from '~/utils/constants';
import { EMAIL_RULE, EMAIL_RULE_MESSAGE } from '~/utils/validators';

const USER_COLLECTION_NAME = 'users';
const shemaValidation = {
  email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
  password: Joi.string().required(),
  username: Joi.string().required(),
  role: Joi.string()
    .required()
    .valid(ROLE_USER.ADMIN, ROLE_USER.EMPLOYER, ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER),
  createdAt: Joi.date().timestamp('javascript').default(Date.now),
  _destroy: Joi.boolean().default(false)
};
let USER_COLLECTION_SCHEMA = Joi.object(shemaValidation);

const validateBeforeCreate = async (data) => {
  const roleReponse = data?.role;
  let validate = {};
  if (roleReponse === ROLE_USER.JOB_SEEKER) {
    validate = {
      skills: Joi.array()
        .required()
        .items(Joi.string().valid(...SKILLS)),
      desiredSalary: Joi.number().required().min(200),
      expensive: Joi.number().required()
    };
  } else if (roleReponse === ROLE_USER.EMPLOYER) {
    validate = {
      companyName: Joi.string().required().min(3).max(50).trim().strict()
    };
  }
  USER_COLLECTION_SCHEMA = Joi.object({
    ...shemaValidation,
    ...validate
  });
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

export const userModel = {
  USER_COLLECTION_NAME,
  USER_COLLECTION_SCHEMA,
  createNew,
  findOneById,
  findOneByEmail,
  statisticsUser
};
