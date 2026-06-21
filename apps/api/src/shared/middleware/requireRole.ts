import { Response, NextFunction } from 'express';
import type { AuthRequest } from './authenticate';

export const requireRole =
  (...roles: string[]) =>
  (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403).json({
        success: false,
        message: 'Forbidden — insufficient role',
        code: 'INSUFFICIENT_ROLE',
      });
      return;
    }
    next();
  };
