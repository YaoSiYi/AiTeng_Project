import { Request, Response, NextFunction } from 'express';
import { Schema } from 'joi';

export const validate = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        code: 400,
        message: messages.join('; '),
        data: { errors: messages },
      });
    }

    next();
  };
};

export const validateQuery = (schema: Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error, value } = schema.validate(req.query, { abortEarly: false, convert: true });

    if (error) {
      const messages = error.details.map((detail) => detail.message);
      return res.status(400).json({
        code: 400,
        message: messages.join('; '),
        data: { errors: messages },
      });
    }

    req.query = value;
    next();
  };
};
