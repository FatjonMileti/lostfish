import { ValidationResult, Schema } from "joi";
import { Request, Response, NextFunction } from "express";

export default (schema: Schema, data?: object) => {
  return (req: Request, res: Response, next: NextFunction): Response | void => {
    let model: ValidationResult;
    if (data) model = schema.validate(data, { abortEarly: false });
    else model = schema.validate(req.body, { abortEarly: false });

    if (model.error) {
      return res.status(400).json({
        message: "Cererea include erori de validare",
        errors: model.error.details,
        valid: false,
      });
    } else {
      res.locals.model = model.value;
      if (!data) return next();
    }
  };
};
