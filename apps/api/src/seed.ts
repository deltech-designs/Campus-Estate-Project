import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import { connectDb } from './config/db';
import { UserModel } from './auth/auth.model';

async function seedAdmin(): Promise<void> {
  try {
    await connectDb();

    const adminEmail = 'admin@estate.com';
    const existingAdmin = await UserModel.findOne({ email: adminEmail });

    if (existingAdmin) {
      console.log('💡 Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash('AdminPassword123!', 12);
      await UserModel.create({
        firstName: 'Central',
        lastName: 'Admin',
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true,
        isDeleted: false,
      });
      console.log('✅ Admin user seeded successfully! (admin@estate.com / AdminPassword123!)');
    }

    await mongoose.connection.close();
    console.log('🔌 Connection closed.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
}

seedAdmin();
