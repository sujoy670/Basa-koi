import { Request, Response, NextFunction } from 'express';
import { sendError } from '../utils/response';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response {
  console.error('Unhandled Server Error:', err);

  const isProduction = process.env.NODE_ENV === 'production';
  return sendError(
    res,
    'INTERNAL_SERVER_ERROR',
    isProduction ? 'An unexpected internal server error occurred' : err.message,
    500,
    isProduction ? undefined : err.stack
  );
}

