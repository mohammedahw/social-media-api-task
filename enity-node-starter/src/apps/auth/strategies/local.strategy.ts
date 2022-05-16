import passport from 'passport';
import { Strategy } from 'passport-local';
import bcrypt, { hash } from 'bcryptjs';
import { validateEmail } from '../../../utils/index';
import { User } from '@prisma/client';
import { prisma } from 'src/prisma/prisma.service';

const isValidPassword = async (password: string, hashedPassword: string) => {
  return await bcrypt.compare(password, hashedPassword);
};

passport.use(
  'register',
  new Strategy(
    {
      usernameField: 'username',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const { email, name, url }: User = req.body;
        if (!validateEmail(email)) return done('invalid email', null);
        const hashedPassword = await hash(password, 12);
        const user: User = await prisma.user.create({
          data: {
            username: username,
            password: hashedPassword,
            email: email,
            name: name,
            url: url || '',
          },
        });
        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);

passport.use(
  'login',
  new Strategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        if (!validateEmail(email)) return done('invalid email', null);

        // email check
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) return done('invalid email', null);
        // password check
        const isValid = await isValidPassword(password, user.password);
        if (!isValid) return done('invalid password', null);

        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);
