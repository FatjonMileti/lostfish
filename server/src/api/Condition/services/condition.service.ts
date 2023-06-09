import express from 'express';
import ConditionSchema from '../condition.schema';
import { ConditionDocument } from '../condition.interface';
import offrIoRequest from '../../../offr-io.request';

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
    const response = await offrIoRequest.post('/condition/post', data);
    if (response.status === 201) {
      data.condition_id = response.data.id;
      await ConditionSchema.create(data);
      return res.send(response.data);
    }

    return res.status(response.status).send(response.data);
  } catch (error: any) {
    return res.status(400).send({ message: 'failed_to_store_in_offr_io', error });
  }
};

const syncConditionsFromOfferIo = async () => {
  try {
    const response = await offrIoRequest.get('/condition/get');

    const dataToUpdate = response.data.items.map((data: any) => {
      return {
        updateOne: {
          filter: { condition_id: data.id },
          update: {
            ...data
          },
          upsert: true
        }
      };
    });

    return ConditionSchema.bulkWrite(dataToUpdate, { ordered: false, maxTimeMS: 30000 });
  } catch (error: any) {
    console.log(error);
  }
};

export default {
  findAll,
  createCondition,
  syncConditionsFromOfferIo
};
