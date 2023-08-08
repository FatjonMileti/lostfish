import config from '../../config';
export const filesMapper = (files: any) => {
  return files.map((file: any) => {
    const { key, filename, ...rest } = file;
    const fileUrl = file.mimetype.startsWith('image')
      ? `${config.api_url}/api/file/${key ?? filename}`
      : `${config.api_url}/api/file/pdf/${key ?? filename}`;

    rest.key = !key ? filename : key;
    rest.filename = !filename ? key : filename;
    rest.link = fileUrl;

    return rest;
  });
};
