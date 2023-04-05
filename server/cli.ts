//cli program
require("dotenv/config");

const chalk = require("chalk");
const dbConnect = require("./src/data");
dbConnect(process.env.DB_CONNECTION_STRING, false);

import { UserDocument } from "./src/api/User/user.interface";
import User from "./src/data/user";

const bcrypt = require("bcrypt");
const inquirer = require("inquirer");
const joi = require("joi");
import { Schema, ValidationResult } from "joi";
import { Role } from "./src/enums";

console.log(chalk.green("Configure digital advertising default user"));
// tslint:disable-next-line: no-any
const validate = (schema: Schema) => (answers: any) => {
  return !schema.validate(answers).error;
};
(async () => {
  type Response = {
    username: string;
    password: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  const response: Response = await inquirer.prompt([
    {
      type: "input",
      name: "email",
      message: "email/username",
      validate: validate(joi.string().required().trim().min(3))
    },
    {
      type: "input",
      name: "password",
      message: "password",
      validate: validate(joi.string().required().trim().min(3))
    },
    {
      type: "input",
      name: "firstName",
      message: "firstName",
      validate: validate(joi.string().required().trim().min(3))
    },
    {
      type: "input",
      name: "lastName",
      message: "lastName",
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
      roles: ["admin"],
      username: response.email,
      hash,
      role: Role.Admin,
      isDisabled: false,
      email: response.email,
      firstName: response.firstName,
      lastName: response.lastName,

      createdAt: new Date()
    }).save();
  } catch (err) {
    console.error(err);
    console.log(chalk.red("could not save user"));
  }

  return process.exit(0);
})();