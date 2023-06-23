import fs from 'fs';
import path from 'path';

const readFile = (imageId: string) => {
  const filePath = path.join(__dirname, '../../uploads/asset-images/', imageId);
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err: any, data: any) => {
      if (err) {
        reject(err);
      }

      resolve(data);
    });
  });
};

export default {
  readFile
};
