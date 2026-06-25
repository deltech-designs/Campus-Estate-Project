import express, { Application } from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { errorHandler } from './shared/middleware/errorHandler';
import authRoutes from './auth/auth.routes';
import propertyRoutes from './properties/properties.routes';
import tenantRoutes from './tenants/tenants.routes';
import leaseRoutes from './leases/leases.routes';
import maintenanceRoutes from './maintenance/maintenance.routes';
import paymentRoutes from './payments/payments.routes';
import vendorRoutes from './vendors/vendors.routes';
import staffRoutes from './staff/staff.routes';

const app: Application = express();

// ─── Global middleware ────────────────────────────────────────────────────────
app.use(
  cors({
    origin: process.env['CLIENT_ORIGIN'] ?? 'http://localhost:3003',
    credentials: true,
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ─── Health check ─────────────────────────────────────────────────────────────
app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'EMS API is healthy' });
});

// ─── Feature routers ──────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/tenants', tenantRoutes);
app.use('/api/leases', leaseRoutes);
app.use('/api/maintenance', maintenanceRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/vendors', vendorRoutes);
app.use('/api/staff', staffRoutes);

// ─── Global error handler (must be last) ─────────────────────────────────────
app.use(errorHandler);

export default app;
