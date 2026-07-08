import { NextFunction, Request, Response, CookieOptions } from 'express';
import passport from 'passport';
import { AuthService } from './auth.service';
import { sendSuccess } from '../shared/utils/response';
import type { AuthRequest } from '../shared/middleware/authenticate';
import type { UserRole } from '@ems/shared';
import type { DocumentType } from '@typegoose/typegoose';
import type { User } from './auth.model';

const service = new AuthService();

const isProduction = process.env['NODE_ENV'] === 'production';

const COOKIE_OPTIONS: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? 'none' : 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { user, token, otpRequired, otp } = await service.register(req.body);
  if (otpRequired) {
    sendSuccess(res, { user, otpRequired, otp }, 'OTP sent for verification', 201);
  } else {
    res.cookie('ems_token', token!, COOKIE_OPTIONS);
    sendSuccess(res, { user }, 'Registration successful', 201);
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { user, token } = await service.login(req.body);
  res.cookie('ems_token', token, COOKIE_OPTIONS);
  sendSuccess(res, { user }, 'Login successful');
};

export const logout = (_req: Request, res: Response): void => {
  res.clearCookie('ems_token');
  sendSuccess(res, null, 'Logged out successfully');
};

export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  const user = await service.getMe(req.user!.id);
  sendSuccess(res, { user }, 'User fetched');
};

export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  const token = await service.forgotPassword(req.body);
  sendSuccess(res, { token }, 'Password reset instructions sent');
};

export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  await service.resetPassword(req.body);
  sendSuccess(res, null, 'Password reset successful');
};

export const verifyOtp = async (req: Request, res: Response): Promise<void> => {
  const { user, token } = await service.verifyOtp(req.body);
  res.cookie('ems_token', token, COOKIE_OPTIONS);
  sendSuccess(res, { user }, 'OTP verified successfully and logged in');
};

export const googleLogin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  let role = (req.query['role'] as string) || 'tenant';
  if (role !== 'tenant' && role !== 'manager') {
    role = 'tenant';
  }
  const from = (req.query['from'] as string) || '/overview';

  const state = Buffer.from(JSON.stringify({ role, from })).toString('base64');
  const clientId = process.env['GOOGLE_CLIENT_ID'];
  const callbackUrl = process.env['GOOGLE_CALLBACK_URL'] || 'http://localhost:5000/api/auth/google/callback';

  if (!clientId) {
    console.log('[MOCK OAUTH] Google Client ID not configured. Bypassing consent screen and redirecting to callback.');
    res.redirect(`${callbackUrl}?code=mock_code&state=${encodeURIComponent(JSON.stringify({ role, from }))}`);
    return;
  }

  passport.authenticate('google', {
    scope: ['profile', 'email'],
    state,
    session: false,
  })(req, res, next);
};

export const googleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const code = req.query['code'] as string;
  const stateStr = req.query['state'] as string;

  const clientOrigin = process.env['CLIENT_ORIGIN'] || 'http://localhost:3000';

  if (!code || !stateStr) {
    res.redirect(`${clientOrigin}/login?error=missing_oauth_params`);
    return;
  }

  let from = '/overview';
  try {
    const decoded = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
    from = decoded.from || '/overview';
  } catch (e) {
    // If decoding base64 fails (e.g. mock redirect has url encoded json)
    try {
      const decoded = JSON.parse(decodeURIComponent(stateStr));
      from = decoded.from || '/overview';
    } catch (err) {}
  }

  const clientId = process.env['GOOGLE_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CLIENT_SECRET'];
  const isMock = !clientId || !clientSecret || code === 'mock_code' || code.startsWith('mock_');

  if (isMock) {
    try {
      let role: UserRole = 'tenant';
      try {
        const decoded = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
        if (decoded.role === 'tenant' || decoded.role === 'manager') {
          role = decoded.role;
        }
      } catch (e) {
        try {
          const decoded = JSON.parse(decodeURIComponent(stateStr));
          if (decoded.role === 'tenant' || decoded.role === 'manager') {
            role = decoded.role;
          }
        } catch (err) {}
      }
      const { user, token } = await service.processGoogleOAuth(code, role);
      res.cookie('ems_token', token, COOKIE_OPTIONS);
      res.redirect(`${clientOrigin}${from}`);
    } catch (err) {
      console.error('Google OAuth mock callback handler error:', err);
      res.redirect(`${clientOrigin}/login?error=google_oauth_failed`);
    }
    return;
  }

  return new Promise<void>((resolve, reject) => {
    passport.authenticate('google', { session: false }, (err: unknown, user: DocumentType<User> | undefined) => {
      if (err) {
        return reject(err);
      }
      if (!user) {
        res.redirect(`${clientOrigin}/login?error=google_oauth_failed`);
        return resolve();
      }

      try {
        const token = service.signToken(user);
        res.cookie('ems_token', token, COOKIE_OPTIONS);
        res.redirect(`${clientOrigin}${from}`);
        resolve();
      } catch (signErr) {
        reject(signErr);
      }
    })(req, res, next);
  });
};
