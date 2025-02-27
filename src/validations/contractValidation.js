import { StatusCodes } from 'http-status-codes';
import Joi from 'joi';
import ApiError from '~/utils/ApiError';
import { OBJECT_ID_RULE, OBJECT_ID_RULE_MESSAGE } from '~/utils/validators';
const createNew = async (req, res, next) => {
  const correctCondition = Joi.object({
    creatorId: Joi.string().required().pattern(OBJECT_ID_RULE).message(OBJECT_ID_RULE_MESSAGE),
    description: Joi.string().required().min(100).max(10000).trim().strict()
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
const update = async (req, res, next) => {
  const correctCondition = Joi.object({
    isAllow: Joi.boolean().default(false)
  });

  try {
    await correctCondition.validateAsync(req.body, {
      abortEarly: false
      // allowUnknown: true // allowUnknown là mình được đẩy thêm fields ngoài những field đã định nghĩa trong correctCondition,
    });
    next();
  } catch (error) {
    const errorMessage = new Error(error).message;
    const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
    next(customError);
  }
};
export const contractValidation = { createNew, update };
