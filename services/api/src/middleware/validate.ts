import { Request, Response, NextFunction } from 'express';
import { AnyZodObject, ZodError } from 'zod';
import { sendError } from '../utils/response';

export function validate(schema: AnyZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = await schema.parseAsync(req.body);
      next();
    } catch (error) {
      if (error instanceof ZodError) {
        return sendError(
          res,
          'VALIDATION_ERROR',
          'Request data validation failed',
          422,
          error.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          }))
        );
      }
      return sendError(res, 'BAD_REQUEST', 'Invalid request body', 400);
    }
  };
}

