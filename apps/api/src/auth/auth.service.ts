import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserRepository } from './auth.repository';
import { RegisterDto } from './dtos/register.dto';
import { LoginDto } from './dtos/login.dto';
import type { IUser, IJwtPayload } from '@ems/shared';
import type { DocumentType } from '@typegoose/typegoose';
import type { User } from './auth.model';

export class AuthService {
  private repo = new UserRepository();

  async register(dto: RegisterDto): Promise<{ user: IUser; token: string }> {
    const existing = await this.repo.findByEmail(dto.email);
    if (existing) {
      throw { status: 409, message: 'Email already in use', code: 'EMAIL_CONFLICT' };
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);
    const user = await this.repo.create({ ...dto, password: hashedPassword });

    const token = this.signToken(user);
    return { user: this.toPublicUser(user), token };
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

  private signToken(user: DocumentType<User>): string {
    const payload: IJwtPayload = { id: String(user._id), role: user.role };
    return jwt.sign(payload, process.env['JWT_SECRET'] as string, {
      expiresIn: process.env['JWT_EXPIRES_IN'] ?? '7d',
    });
  }

  private toPublicUser(user: DocumentType<User>): IUser {
    return {
      _id: String(user._id),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
      createdAt: (user as unknown as { createdAt: Date }).createdAt?.toISOString() ?? '',
      updatedAt: (user as unknown as { updatedAt: Date }).updatedAt?.toISOString() ?? '',
    };
  }
}
