import { StatusCodes } from 'http-status-codes';
import { contractSercice } from '~/services/contractSercice';
const getListContract = async (req, res, next) => {
  try {
    const result = await contractSercice.getListContract();
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const createNew = async (req, res, next) => {
  try {
    const result = await contractSercice.createNew(req.body);
    res.status(StatusCodes.OK).json(result);
  } catch (error) {
    next(error);
  }
};
const update = async (req, res, next) => {
  try {
    const contractId = req.params.id;
    const updatedColumn = await contractSercice.update(contractId, req.body);
    res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
const changStatus = async (req, res, next) => {
  try {
    const contractId = req.params.id;
    const updatedColumn = await contractSercice.changStatus(contractId, req.query.status);
    res.status(StatusCodes.NON_AUTHORITATIVE_INFORMATION).json(updatedColumn);
  } catch (error) {
    next(error);
  }
};
export const contractController = { getListContract, createNew, update, changStatus };
