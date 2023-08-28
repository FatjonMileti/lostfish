import multer, { Multer, StorageEngine } from 'multer';
import config from '../config';
const storage: StorageEngine = multer.memoryStorage();
const upload: Multer = config.uses3Bucket ? multer({ storage }) : multer({ dest: 'uploads/' });

export const singleUpload = upload.single('file');
export const multipleUpload = upload.array('files');
