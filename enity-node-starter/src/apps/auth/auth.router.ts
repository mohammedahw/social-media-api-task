import { Router } from 'express';
import passport from 'passport';
import { login, register } from './auth.contoller';

const authRouter = Router();

// register
authRouter.post(
  '/register',
  passport.authenticate('register', { session: false }),
  register
);

// login
authRouter.post(
  '/login',
  passport.authenticate('login', { session: false }),
  login
);

export { authRouter };
