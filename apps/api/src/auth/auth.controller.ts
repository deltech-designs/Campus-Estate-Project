import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { sendSuccess } from '../shared/utils/response';
import type { AuthRequest } from '../shared/middleware/authenticate';

const service = new AuthService();

const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env['NODE_ENV'] === 'production',
  sameSite: 'lax' as const,
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
