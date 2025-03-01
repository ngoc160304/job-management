import { StatusCodes } from 'http-status-codes';
import { userModel } from '~/models/userModel';
import ApiError from '~/utils/ApiError';
import bcryptjs from 'bcryptjs';
import { pickUser } from '~/utils/formatter';
import { env } from '~/config/environment';
import { JwtProvider } from '~/providers/JwtProvider';
import { jobModel } from '~/models/jobModel';
import { complainModel } from '~/models/complainModel';
import { candidateModel } from '~/models/candidateModel';
const createNew = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist');
    }
    const nameFromEmail = reqBody.email.split('@')[0];
    const newUser = {
      ...reqBody,
      username: nameFromEmail,
      password: bcryptjs.hashSync(reqBody.password, 8)
    };
    const craetedUser = await userModel.createNew(newUser);
    const getNewUser = await userModel.findOneById(craetedUser.insertedId);

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};
const login = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (!existUser) {
      throw new ApiError(StatusCodes.NOT_FOUND, 'Account not found');
    }

    const userInfo = {
      _id: existUser._id,
      email: existUser.email,
      role: existUser.role
    };
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );
    const refreshToken = await JwtProvider.generateToken(
      userInfo,
      env.REFRESH_TOKEN_SECRET_SIGNATURE,
      env.REFRESH_TOKEN_LIFE
    );

    return { accessToken, refreshToken, ...pickUser(existUser) };
  } catch (error) {
    throw error;
  }
};
const refreshToken = async (clietRefreshToken) => {
  try {
    const refreshTokenDecoded = await JwtProvider.verifyToken(
      clietRefreshToken,
      env.REFRESH_TOKEN_SECRET_SIGNATURE
    );
    const userInfo = {
      _id: refreshTokenDecoded._id,
      email: refreshTokenDecoded.email,
      role: refreshTokenDecoded.role
    };
    const accessToken = await JwtProvider.generateToken(
      userInfo,
      env.ACCESS_TOKEN_SECRET_SIGNATURE,
      env.ACCESS_TOKEN_LIFE
    );
    return { accessToken };
  } catch (error) {
    throw error;
  }
};
const statistics = async () => {
  try {
    const users = await userModel.statisticsUser();
    const jobs = await jobModel.statisticsJobs();
    const complains = await complainModel.statisticsComplain();
    const candidates = await candidateModel.statisticsCandidate();
    return {
      users,
      jobs,
      complains,
      candidates
    };
  } catch (error) {
    throw error;
  }
};
const getListUser = async (reqQuery) => {
  try {
    const result = await userModel.getListUser(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
const getListEmployer = async (reqQuery) => {
  try {
    const result = await userModel.getListEmployer(reqQuery);
    return result;
  } catch (error) {
    throw error;
  }
};
const createNewAdmin = async (reqBody) => {
  try {
    const existUser = await userModel.findOneByEmail(reqBody.email);
    if (existUser) {
      throw new ApiError(StatusCodes.CONFLICT, 'Email already exist');
    }
    const nameFromEmail = reqBody.email.split('@')[0];
    const newUser = {
      ...reqBody,
      username: nameFromEmail,
      password: bcryptjs.hashSync(reqBody.password, 8)
    };
    const craetedUser = await userModel.createNewUserAdmin(newUser);
    const getNewUser = await userModel.findOneById(craetedUser.insertedId);

    return pickUser(getNewUser);
  } catch (error) {
    throw error;
  }
};
const deleteUser = async (userId) => {
  try {
    await userModel.deleteUser(userId);
    return {
      isSuccess: true
    };
  } catch (error) {
    throw error;
  }
};
const update = async (userId, updateData) => {
  try {
    await userModel.update(userId, updateData);
    return {
      isSuccess: true
    };
  } catch (error) {
    throw error;
  }
};
export const userService = {
  createNew,
  login,
  refreshToken,
  statistics,
  getListUser,
  getListEmployer,
  createNewAdmin,
  deleteUser,
  update
};
