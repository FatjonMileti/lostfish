import FilesCollection from '../../../data/files.collection';

const createFiles = async (files: any[]) => {
  const addedFiles = await FilesCollection.insertMany(files);
  return addedFiles;
};

export default { createFiles };
