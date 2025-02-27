/* eslint-disable indent */
import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';
import {
  EMAIL_RULE,
  EMAIL_RULE_MESSAGE,
  PASSWORD_RULE,
  PASSWORD_RULE_MESSAGE
} from '~/utils/validators';
import { ROLE_USER, SKILLS } from '~/utils/constants';
const createNew = async (req, res, next) => {
  const roleReponse = req.body.role;
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
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    role: Joi.string()
      .required()
      .valid(ROLE_USER.ADMIN, ROLE_USER.EMPLOYER, ROLE_USER.INTERVIEER, ROLE_USER.JOB_SEEKER),
    ...validate
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    });
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};
const login = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE)
  });
  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
    });
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};
export const userValidations = {
  createNew,
  login
};
