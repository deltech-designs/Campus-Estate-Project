import { UserModel, User } from './auth.model';
import type { DocumentType } from '@typegoose/typegoose';

export class UserRepository {
  async findByEmail(email: string): Promise<DocumentType<User> | null> {
    return UserModel.findOne({ email: email.toLowerCase(), isDeleted: false });
  }

  async findById(id: string): Promise<DocumentType<User> | null> {
    return UserModel.findOne({ _id: id, isDeleted: false });
  }

  async findByResetToken(token: string): Promise<DocumentType<User> | null> {
    return UserModel.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
      isDeleted: false,
    });
  }

  async create(data: Partial<User>): Promise<DocumentType<User>> {
    return UserModel.create(data);
  }
}
