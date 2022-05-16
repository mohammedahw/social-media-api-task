import { User } from "@prisma/client";
import { compare, hash } from "bcrypt";
import * as passport from "passport";
import { Strategy } from "passport-local";
import { prisma } from "../../../../prisma/prisma.client";
import { validateEmail } from "../../../utils/validateEmail";

passport.use(
  "register",
  new Strategy(
    {
      usernameField: "username",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, username, password, done) => {
      try {
        const { email, name, url }: User = req.body;
        if (!validateEmail(email)) return done("invalid email", null);
        const hashedPassword = await hash(password, 12);
        const user: User = await prisma.user.create({
          data: {
            username: username,
            password: hashedPassword,
            email: email,
            name: name,
            url: url || "",
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
  "login",
  new Strategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        if (!validateEmail(email)) return done("invalid email", null);

        // email check
        const user = await prisma.user.findUnique({
          where: {
            email: email,
          },
        });

        if (!user) return done("invalid email", null);
        // password check
        const isValid = await compare(password, user.password);
        if (!isValid) return done("invalid password", null);

        return done(null, user);
      } catch (e) {
        return done(e, null);
      }
    }
  )
);
