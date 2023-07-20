import express from 'express';
import AttributeSchema from '../attribute.schema';
import { AttributeDocument } from '../attribute.interface';

const findAll = async (req: express.Request, res: express.Response) => {
  try {
    const data = await AttributeSchema.paginate({});
    return res.send(data);
  } catch (error: any) {
    return res.status(400).send({ message: 'failed_to_fetch_data', error });
  }
};

const createAttribute = async (req: express.Request, res: express.Response) => {
  const data = req.body as AttributeDocument;
  try {
    const attribute = await AttributeSchema.create(data);
    res.send(attribute);
  } catch (error: any) {
    return res.status(400).send({ message: 'attribute_not_Stored' });
  }
};

export default {
  findAll,
  createAttribute
};
