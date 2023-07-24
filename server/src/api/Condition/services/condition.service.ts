import express from 'express';
import ConditionSchema from '../condition.schema';
import { ConditionDocument } from '../condition.interface';
import httpStatus from 'http-status';

const findAll = async (req: express.Request, res: express.Response) => {
  try {
    const responseData = await ConditionSchema.paginate({
      required: true,
      is_system: true,
      type_string: 'File Upload'
    });
    return res.send(responseData);
  } catch (error: any) {
    return res.status(400).send({ message: 'failed_to_fetch_data', error });
  }
};

const createCondition = async (req: express.Request, res: express.Response) => {
  const data = req.body as ConditionDocument;
  try {
    const condition = await ConditionSchema.create(data);

    res.status(httpStatus.CREATED).send(condition);
  } catch (error: any) {
    return res.status(httpStatus.BAD_REQUEST).send({ message: 'condition+not_saved' });
  }
};

export default {
  findAll,
  createCondition
};
