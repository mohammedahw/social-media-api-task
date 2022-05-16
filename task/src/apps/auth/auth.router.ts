import { Router } from "express";
import * as passport from "passport";
import { login, register } from "./auth.controller";

export const authRouter = Router();

// register
authRouter.post(
  "/register",
  passport.authenticate("register", { session: false }),
  register
);

// login
authRouter.post(
  "/login",
  passport.authenticate("login", { session: false }),
  login
);
