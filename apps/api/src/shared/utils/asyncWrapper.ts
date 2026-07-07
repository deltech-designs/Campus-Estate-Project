import { Request, Response, NextFunction, RequestHandler } from 'express';

/**
 * Wraps an async route handler so that any thrown error is forwarded to
 * Express's next() — which feeds into the global errorHandler middleware.
 */
export const asyncWrapper =
  (fn: RequestHandler): RequestHandler =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
