import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { UserRepository } from '../auth/auth.repository';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@ems/shared';
import type { Request } from 'express';

const repo = new UserRepository();

export const initPassport = (): void => {
  const clientId = process.env['GOOGLE_CLIENT_ID'];
  const clientSecret = process.env['GOOGLE_CLIENT_SECRET'];
  const callbackUrl = process.env['GOOGLE_CALLBACK_URL'] || 'http://localhost:5000/api/auth/google/callback';

  if (!clientId || !clientSecret) {
    console.log('[PASSPORT] Google Client ID or Secret missing. GoogleStrategy not registered.');
    return;
  }

  passport.use(
    new GoogleStrategy(
      {
        clientID: clientId,
        clientSecret: clientSecret,
        callbackURL: callbackUrl,
        passReqToCallback: true,
      },
      async (req: Request, _accessToken: string, _refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Retrieve state to determine dynamic preferredRole (e.g. tenant or manager)
          const stateStr = req.query['state'] as string;
          let role: UserRole = 'tenant';
          try {
            if (stateStr) {
              const decoded = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
              if (decoded.role) {
                role = decoded.role as UserRole;
              }
            }
          } catch (e) {
            console.error('Failed to parse state in Google Strategy callback:', e);
          }

          let user = await repo.findByEmail(email);
          if (!user) {
            const firstName = profile.name?.givenName || profile.displayName.split(' ')[0] || 'Google';
            const lastName = profile.name?.familyName || profile.displayName.split(' ')[1] || 'User';
            const randomPassword = await bcrypt.hash(Math.random().toString(36).substring(2, 15), 12);
            
            user = await repo.create({
              firstName,
              lastName,
              email: email.toLowerCase(),
              password: randomPassword,
              role,
              isActive: true,
            });
          }

          return done(null, user as unknown as Express.User);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
};
