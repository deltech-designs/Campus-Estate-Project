import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { UserRepository } from '../auth/auth.repository';
import bcrypt from 'bcryptjs';
import type { UserRole } from '@ems/shared';
import type { Request } from 'express';

declare global {
  namespace Express {
    interface User {
      email?: string;
      name?: string;
      role: UserRole;
      id: string;
      avatar?: string;
    }
  }
}

const repo = new UserRepository();

export const initPassport = (): void => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  const callbackUrl =
    process.env.GOOGLE_CALLBACK_URL ||
    `${process.env.API_BASE_URL}/api/auth/google/callback`;

  if (!clientId || !clientSecret) {
    console.log('[PASSPORT] Google Client ID or Secret missing. GoogleStrategy not registered.');
    return;
  }

  // Passport Serialization
  passport.serializeUser((user: Express.User, done) => done(null, user));
  passport.deserializeUser((user: Express.User, done) => done(null, user));

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
          if (stateStr) {
            try {
              const decoded = JSON.parse(Buffer.from(stateStr, 'base64').toString('utf-8'));
              if (decoded.role === 'tenant' || decoded.role === 'manager') {
                role = decoded.role;
              }
            } catch (e) {
              try {
                const decoded = JSON.parse(decodeURIComponent(stateStr));
                if (decoded.role === 'tenant' || decoded.role === 'manager') {
                  role = decoded.role;
                }
              } catch (err) {
                console.error('Failed to parse state in Google Strategy callback:', err);
              }
            }
          }

          const avatar = profile.photos?.[0]?.value;

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
              avatar,
            });
          } else if (avatar && !user.avatar) {
            user.avatar = avatar;
            await user.save();
          }

          const formattedUser: Express.User = {
            id: String(user._id),
            role: user.role,
            email: user.email,
            name: `${user.firstName} ${user.lastName}`,
            avatar: user.avatar,
          };

          return done(null, formattedUser);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
};

