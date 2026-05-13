import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { error } from './response';

type RequestPart = 'body' | 'query' | 'params';

export const validate = (schema: Joi.ObjectSchema, source: RequestPart = 'body') => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error: validationError, value } = schema.validate(req[source], {
      abortEarly: false,
      stripUnknown: true,
    });

    if (validationError) {
      const messages = validationError.details.map((d) => d.message).join('; ');
      res.status(400).json(error(messages, 400));
      return;
    }

    req[source] = value;
    next();
  };
};
