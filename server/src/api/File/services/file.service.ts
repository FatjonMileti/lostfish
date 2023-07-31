import FilesCollection from '../../../data/files.collection';
import path from 'path';
import fs from 'fs';

const createFiles = async (files: any[]) => {
  return await FilesCollection.insertMany(files);
};

const removeFile = async (
  imageId: string,
  propertyId: string = '',
  userId: string = ''
): Promise<boolean> => {
  let filePathString = 'uploads/';
  if (propertyId) {
    filePathString = path.join(filePathString, 'asset-images/');
  }
  if (userId) {
    filePathString = path.join(filePathString, 'user-docs/');
  }

  const rootDir = process.cwd();
  const filePath = path.resolve(rootDir, filePathString, imageId);

  try {
    return await new Promise((resolve, reject) => {
      fs.unlink(filePath, (error: any) => {
        if (error) {
          reject(false);
        } else {
          resolve(true);
        }
      });
    });
  } catch (error) {
    return false;
  }
};

export default { createFiles, removeFile };
