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
import { ROLE_USER } from '~/utils/constants';
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    email: Joi.string().required().pattern(EMAIL_RULE).message(EMAIL_RULE_MESSAGE),
    password: Joi.string().required().pattern(PASSWORD_RULE).message(PASSWORD_RULE_MESSAGE),
    role: Joi.string().required().valid(ROLE_USER.JOB_SEEKER)
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
