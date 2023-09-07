import multer, { Multer, StorageEngine } from 'multer';
import config from '../config/index';
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = config.useAzureStorage ? multer({ storage }) : multer({ dest: 'uploads/' });

export const singleUpload = upload.single('file');
export const multipleUpload = upload.array('files');
