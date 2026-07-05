import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import type { IJwtPayload, UserRole } from '@ems/shared';

declare global {
  namespace Express {
    interface User {
      id: string;
      role: UserRole;
    }
  }
}

export interface AuthRequest extends Request {
  user?: { id: string; role: UserRole };
}

export const authenticate = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): void => {
  const token = req.cookies?.ems_token as string | undefined;

  if (!token) {
    res
      .status(401)
      .json({ success: false, message: 'Unauthorized — no token', code: 'NO_TOKEN' });
    return;
  }

  try {
    const payload = jwt.verify(
      token,
      process.env['JWT_SECRET'] as string,
    ) as IJwtPayload;

    req.user = { id: payload.id, role: payload.role };
    next();
  } catch {
    res
      .status(401)
      .json({ success: false, message: 'Invalid or expired token', code: 'INVALID_TOKEN' });
  }
};
