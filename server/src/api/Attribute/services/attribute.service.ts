import express from 'express';
import AttributeSchema from '../attribute.schema';
import { AttributeDocument } from '../attribute.interface';
import axios from '../../../offr-io.request';
import offrIoRequest from '../../../offr-io.request';

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
    const response = await axios.post('/attribute/post', data);
    if (response.status === 201) {
      data.attribute_id = response.data.id;
      await AttributeSchema.create(data);
      return res.send(response.data);
    }

    return res.status(response.status).send(response.data);
  } catch (error: any) {
    return res.status(400).send({ message: 'failed_to_store_in_offr_io', error });
  }
};

const syncAttributesFromOfferIo = async () => {
  try {
    const response = await offrIoRequest.get('/attribute/get');

    const dataToUpdate = response.data.items.map((data: any) => {
      return {
        updateOne: {
          filter: { attribute_id: data.id },
          update: {
            ...data
          },
          upsert: true
        }
      };
    });

    return AttributeSchema.bulkWrite(dataToUpdate, { ordered: false, maxTimeMS: 30000 });
  } catch (error: any) {
    console.log(error);
  }
};

export default {
  findAll,
  createAttribute,
  syncAttributesFromOfferIo
};
