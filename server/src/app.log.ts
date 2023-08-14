import path from 'path';
import { Request } from 'express';
import * as rfs from 'rotating-file-stream';
import morgan from 'morgan';

morgan.token('req-body', (req: Request) => JSON.stringify(req.body));

export const logFormat: string =
  '[:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :req-body - :response-time ms';

const accessLogStream = rfs.createStream('access.log', {
  size: '10M',
  interval: '5d',
  path: path.join(__dirname, '../', 'logs')
});

export const logStream = morgan(logFormat, { stream: accessLogStream });
