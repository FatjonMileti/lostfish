// Built-in Node.js Modules
import * as process from 'process';
import path from 'path';

// External Dependencies
import createError, { HttpError } from 'http-errors';
import helmet from 'helmet';
import express, { Request, Response, Application, NextFunction } from 'express';
import 'express-async-errors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import chalk from 'chalk';
import cors from 'cors';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import compression from 'compression';

// API Routes
import routerApi from './api/index';

// Internal Dependencies
import config from './config/index';
import dbConnect from './data';
import MailService from './utils/email/index';
import { logFormat, logStream } from './app.log';

// Create Express app instance
const app: Application = express();

// Apply compression middleware for response compression
app.use(compression());

// Apply rateLimiter to all endpoints
// app.use(generalLimiter);

// Connect to the database if not in 'test' environment
if (config.stage !== 'test') {
  dbConnect(config.connectionString as string);
}

// Set 'trust proxy' if behind a proxy server
if (config.behind_proxy) {
  console.log(chalk.bold.red('app set to trust proxy'));
  app.set('trust proxy', 1);
}

// Initialize MailService instance for email handling
const mailService: MailService = MailService.getInstance();

// Create email connection based on environment
if (config.stage === 'development') {
  mailService.createLocalConnection();
} else if (['stage', 'production'].includes(config.stage)) {
  mailService.createConnection();
}

// Get package information and log app details
const packageJson = require('../package.json');
console.log(
  chalk.bold.green(`Started ${packageJson.name} PORT ${process.env.PORT || 3000} NODE_ENV ${app.get('env')}`)
);

// Configure view engine and views directory
app.set('views', path.join(__dirname, '..', 'views'));
app.set('view engine', 'hbs');

// Security Middleware
// --------------------
// Configure security-related middleware to enhance the application's security.

// Enable Cross-Origin Resource Sharing (CORS) for controlled data sharing.
app.use(cors());

// Configure Helmet middleware for various security headers
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

// Logs Middleware
// ----------------
// Configure logging middleware to capture and record request and response data.

// Define a custom token to log the request body.
app.use(morgan(logFormat));
app.use(logStream);

// Parse request body as JSON and url-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Parse cookies using cookie-parser middleware
app.use(cookieParser());

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Configure session management using express-session and MongoStore
export const sessionMiddleware = session({
  resave: true,
  rolling: true,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET as string,
  store: MongoStore.create({
    mongoUrl: process.env.DB_CONNECTION_STRING as string
  }),
  cookie: {
    maxAge: 1000 * 60 * 60,
    sameSite: 'lax',
    httpOnly: true,
    secure: true
  },
  name: 'fsdlm'
});

app.use(sessionMiddleware);

// Serve documentation files from '/docs' route
if (config.stage === 'development') {
  app.use('/docs', express.static(path.join(__dirname, '..', 'docs')));
}

// Route handlers
// --------------
// Include the main index route and API routes
app.use('/', require('./routes/index'));
app.use('/api', routerApi);

// Catch 404 and forward to error handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(createError(404));
});

// Error handling middleware
// ------------------------
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
  // Log error details if not in 'test' environment
  if (config.stage !== 'test' && ((err.status && err.status !== 404) || !err.status)) {
    console.error(chalk.red(new Date().toISOString(), err.stack || err.message || err));
  }

  // Respond with error details
  res.status(err.status || 500).json({
    message: err.message,
    stack: ['stage', 'production'].includes(config.stage) ? undefined : err.stack
  });
});

// Export the Express app instance
module.exports = app;
