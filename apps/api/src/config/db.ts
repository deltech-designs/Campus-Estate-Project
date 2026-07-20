import mongoose, { Connection } from 'mongoose';

export async function connectDb(): Promise<void> {
  const uri = process.env['MONGODB_URI'];
  if (!uri) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  await mongoose.connect(uri);
  console.log('✅ MongoDB connected');

  const conn: Connection = mongoose.connection;

  conn.on('error', (err: unknown) => {
    console.error('MongoDB connection error:', err);
  });

  conn.on('disconnected', () => {
    console.warn('MongoDB disconnected');
  });
}
