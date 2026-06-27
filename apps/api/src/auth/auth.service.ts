import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from './auth.repository';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import { ForgotPasswordDto } from './dtos/forgot-password.dto';
import { ResetPasswordDto } from './dtos/reset-password.dto';
import { VerifyOtpDto } from './dtos/verify-otp.dto';
import type { IUser, IJwtPayload } from '@ems/shared';
import type { DocumentType } from '@typegoose/typegoose';
import type { User } from './auth.model';

export class AuthService {
  private repo = new UserRepository();

  async register(dto: RegisterDto): Promise<{ user: IUser; token?: string; otpRequired?: boolean; otp?: string }> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw { status: 409, message: 'Email already in use', code: 'EMAIL_CONFLICT' };
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const isGoogle = dto.password === 'GoogleOAuthPassword123!';
    const user = await this.repo.create({ ...dto, password: hashedPassword, isActive: isGoogle });

    if (isGoogle) {
      const token = this.signToken(user);
      return { user: this.toPublicUser(user), token };
    } else {
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      user.otpCode = otp;
      user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
      await user.save();

      console.log(`[MOCK EMAIL] OTP for ${dto.email}: ${otp}`);

      return { user: this.toPublicUser(user), otpRequired: true, otp };
    }
  }

  async login(dto: LoginDto): Promise<{ user: IUser; token: string }> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) {
      throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };
    }

    const isMatch = await bcrypt.compare(dto.password, user.password);
    if (!isMatch) {
      throw { status: 401, message: 'Invalid credentials', code: 'INVALID_CREDENTIALS' };
    }

    const token = this.signToken(user);
    return { user: this.toPublicUser(user), token };
  }

  async getMe(userId: string): Promise<IUser> {
    const user = await this.repo.findById(userId);
    if (!user) {
      throw { status: 404, message: 'User not found', code: 'NOT_FOUND' };
    }
    return this.toPublicUser(user);
  }

  async forgotPassword(dto: ForgotPasswordDto): Promise<string> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) {
      throw { status: 404, message: 'No account with that email address exists', code: 'USER_NOT_FOUND' };
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    user.resetPasswordToken = token;
    user.resetPasswordExpires = new Date(Date.now() + 3600000); // 1 hour
    await user.save();

    console.log(`[MOCK EMAIL] Password Reset Link: http://localhost:3000/reset-password?token=${token}`);

    return token;
  }

  async resetPassword(dto: ResetPasswordDto): Promise<void> {
    const user = await this.repo.findByResetToken(dto.token);
    if (!user) {
      throw { status: 400, message: 'Password reset token is invalid or has expired', code: 'INVALID_TOKEN' };
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();
  }

  async verifyOtp(dto: VerifyOtpDto): Promise<{ user: IUser; token: string }> {
    const user = await this.repo.findByEmail(dto.email);
    if (!user) {
      throw { status: 404, message: 'User not found', code: 'USER_NOT_FOUND' };
    }

    if (user.isActive) {
      throw { status: 400, message: 'Account is already active', code: 'ALREADY_ACTIVE' };
    }

    if (!user.otpCode || user.otpCode !== dto.code || !user.otpExpires || user.otpExpires < new Date()) {
      throw { status: 400, message: 'Invalid or expired OTP code', code: 'INVALID_OTP' };
    }

    user.isActive = true;
    user.otpCode = undefined;
    user.otpExpires = undefined;
    await user.save();

    const token = this.signToken(user);
    return { user: this.toPublicUser(user), token };
  }

  private signToken(user: DocumentType<User>): string {
    const payload: IJwtPayload = { id: String(user._id), role: user.role };
    return jwt.sign(payload, process.env['JWT_SECRET'] as string, {
      expiresIn: (process.env['JWT_EXPIRES_IN'] ?? '7d') as jwt.SignOptions['expiresIn'],
    });
  }

  private toPublicUser(user: DocumentType<User>): IUser {
    return {
      _id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      isActive: user.isActive,
      createdAt: (user as unknown as { createdAt: Date }).createdAt?.toISOString() ?? '',
      updatedAt: (user as unknown as { updatedAt: Date }).updatedAt?.toISOString() ?? '',
    };
  }
}
