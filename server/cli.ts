//cli program
require('dotenv/config');
const chalk = require('chalk');
const dbConnect = require('./src/data');
dbConnect(process.env.DB_CONNECTION_STRING, false);
import User from './src/data/user';

const bcrypt = require('bcrypt');
const inquirer = require('inquirer');
const joi = require('joi');
import { Schema } from 'joi';
import { Role } from './src/enums';

console.log(chalk.green('Configure digital advertising default user'));
// tslint:disable-next-line: no-any
const validate = (schema: Schema) => (answers: any) => {
  return !schema.validate(answers).error;
};
(async () => {
  type Response = {
    username: string;
    password: string;
    email: string;
    first_name: string;
    last_name: string;
  };
  const response: Response = await inquirer.prompt([
    {
      type: 'input',
      name: 'email',
      message: 'email/username',
      validate: validate(joi.string().required().trim().min(3))
    },
    {
      type: 'input',
      name: 'password',
      message: 'password',
      validate: validate(joi.string().required().trim().min(3))
    },
    {
      type: 'input',
      name: 'first_name',
      message: 'first_name',
      validate: validate(joi.string().required().trim().min(3))
    },
    {
      type: 'input',
      name: 'last_name',
      message: 'last_name',
      validate: validate(joi.string().required().trim().min(3))
    }
  ]);

  const hash: string = await new Promise((resolve, reject) => {
    bcrypt.hash(response.password, 12, (err: Error, res: string) => {
      if (err) return reject(err);

      resolve(res);
    });
  });
  try {
    await new User({
      username: response.email,
      hash,
      role: Role.Admin,
      is_disabled: false,
      email: response.email,
      first_name: response.first_name,
      last_name: response.last_name,
      created_at: new Date()
    }).save();
    
  } catch (err) {
    console.error(err);
    console.log(chalk.red('could not save user'));
  }

  return process.exit(0);
})();