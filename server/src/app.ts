import * as process from 'process';
require('dotenv').config();
const compression = require('compression');
import createError, { HttpError } from 'http-errors';
const helmet = require('helmet');
import express, { Request, Response, Application, NextFunction } from 'express';
import multer from 'multer';
require('express-async-errors');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const chalk = require('chalk');
const cors = require('cors');
const session = require('express-session');
const dbConnect = require('./data');
const MongoStore = require('connect-mongo');
import MailService from './utils/email/index';
import config from './config';
const upload = multer({ dest: 'uploads/asset-images' });
const app: Application = express();

app.use(compression());

if (config.node_env !== 'test') dbConnect(process.env.DB_CONNECTION_STRING);

if (config.behind_proxy) {
  console.log(chalk.bold.red('app set to trust proxy'));
  app.set('trust proxy', 1);
}

const mailService = MailService.getInstance();

if (config.node_env === 'development') {
  mailService.createLocalConnection();
} else if (config.node_env === 'production') {
  mailService.createConnection();
}

const packageJson = require('../package.json');
console.log(
  chalk.bold.green(`Started ${packageJson.name} PORT ${process.env.PORT || 3000} NODE_ENV ${app.get('env')}`)
);

// view engine setup
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'hbs');

app.use(cors());
// app.use(helmet.contentSecurityPolicy());
app.use(helmet.dnsPrefetchControl());
app.use(helmet.expectCt());
app.use(helmet.frameguard());
app.use(helmet.hidePoweredBy());
app.use(helmet.hsts());
app.use(helmet.ieNoOpen());
app.use(helmet.noSniff());
app.use(helmet.permittedCrossDomainPolicies());
app.use(helmet.referrerPolicy());
app.use(helmet.xssFilter());
app.use(
  logger(
    '[:date[iso]] :remote-addr :remote-user :method :url HTTP/:http-version :status :res[content-length] - :response-time ms'
  )
);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/url-to-file', express.static(path.join(__dirname, '..', 'uploads/asset-images')));

app.use(
  session({
    resave: true,
    rolling: true,
    saveUninitialized: false,
    secret: process.env.SESSION_SECRET,
    store: MongoStore.create({
      mongoUrl: process.env.DB_CONNECTION_STRING
    }),
    sameSite: true,
    maxAge: 1000 * 60 * 60,
    cookie: {
      maxAge: 1000 * 60 * 60,
      sameSite: 'lax',
      httpOnly: true,
      secure: true
    },
    name: 'fsdlm'
  })
);

app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));
app.use('/', require('./routes/index'));
app.use('/api', require('./api/index'));

app.post('/upload', upload.array('images'), (req, res) => {
  console.log(req.files); // Here you will see the uploaded files
  res.status(200).send(req.files);
});

// catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// error handler
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  if (process.env.NODE_ENV !== 'test' && ((err.status && err.status !== 404) || !err.status)) {
    console.error(chalk.red(new Date().toISOString(), err.stack || err.message || err));
  }

  res.status(err.status || 500).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
  });
});

module.exports = app;
