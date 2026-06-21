import { Request, Response, NextFunction } from 'express';

interface AppError {
  status?: number;
  message?: string;
  code?: string;
}

export const errorHandler = (
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void => {
  const statusCode = err.status ?? 500;
  const message = err.message ?? 'Internal Server Error';
  const code = err.code ?? 'SERVER_ERROR';

  if (statusCode >= 500) {
    console.error('[ErrorHandler]', err);
  }

  res.status(statusCode).json({ success: false, message, code });
};
