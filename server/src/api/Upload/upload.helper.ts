import config from '../../config';
export const filesMapper = (files: any) => {
  return files.map((file: any) => {
    const { key, filename, ...rest } = file;
    rest.key = !key ? filename : key;
    rest.filename = !filename ? key : filename;
    rest.link = `${config.api_url}/api/file/${key ? key : filename}`;
    return rest;
  });
};
