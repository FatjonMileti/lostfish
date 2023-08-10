import path from 'path';
import { Request } from 'express';
const rfs = require('rotating-file-stream');
const morgan = require('morgan');

morgan.token('req-body', (req: Request) => JSON.stringify(req.body));

export const logFormat: string =
  '[:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] :req-body - :response-time ms';

const accessLogStream = rfs.createStream('access.log', {
  size: '10M',
  interval: '5d',
  path: path.join(__dirname, '../', 'logs')
});

export const logStream = morgan(logFormat, { stream: accessLogStream });
