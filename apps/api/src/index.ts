import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import { connectDb } from './config/db';
import app from './app';

const PORT = process.env.PORT ?? 5000;

async function bootstrap(): Promise<void> {
  await connectDb();
  app.listen(PORT, () => {
    console.log(`🚀 EMS API running on http://localhost:${PORT}`);
  });
}

bootstrap().catch((err: unknown) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
