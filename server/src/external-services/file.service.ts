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

const removeFile = (imageId: string, propertyId: string = '', userId: string = '') => {
  let filePathString = '../../uploads/';
  if (propertyId) {
    filePathString = filePathString + `asset-images/`;
  }
  if (userId) {
    filePathString = filePathString + `user-docs/`;
  }

  const filePath = path.join(__dirname, filePathString, imageId);

  try {
    return new Promise((resolve, reject) => {
      fs.unlink(filePath, (error: any) => {
        if (error) {
          reject(error);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    return false;
  }
};

export default {
  readFile,
  removeFile
};
