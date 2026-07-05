import express, { Application } from 'express';
import session from 'express-session';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import helmet from 'helmet';
import { initPassport } from './config/passport';
import { errorHandler } from './shared/middleware/errorHandler';
import authRoutes from './auth/auth.routes';
import propertyRoutes from './properties/properties.routes';
import tenantRoutes from './tenants/tenants.routes';
import leaseRoutes from './leases/leases.routes';
import maintenanceRoutes from './maintenance/maintenance.routes';
import paymentRoutes from './payments/payments.routes';
import vendorRoutes from './vendors/vendors.routes';
import staffRoutes from './staff/staff.routes';

// Initialize Passport Strategies
initPassport();

const app: Application = express();

app.use(helmet());
app.use(
  session({
    secret: process.env['SESSION_SECRET'] || 'keyboard_cat',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env['NODE_ENV'] === 'production' },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// ─── Global middleware ────────────────────────────────────────────────────────
if (process.env['NODE_ENV'] !== 'test') {
  app.use(morgan('dev'));
}

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps, curl, postman)
      if (!origin) {
        callback(null, true);
        return;
      }
      
      const allowedOrigins = [
        process.env['CLIENT_ORIGIN'] || 'http://localhost:3000',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ];
      
      const isAllowed = allowedOrigins.includes(origin) || 
        (process.env['NODE_ENV'] !== 'production' && (
          origin.startsWith('http://localhost:') || 
          origin.startsWith('http://127.0.0.1:') || 
          origin.startsWith('http://192.168.') ||
          origin.startsWith('http://10.') ||
          origin.startsWith('http://172.')
        ));

      if (isAllowed) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
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
