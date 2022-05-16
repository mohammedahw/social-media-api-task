import * as express from "express";
import passport = require("passport");
import { authRouter } from "./apps/auth/auth.router";
import { postsRouter } from "./apps/posts/posts.router";
import { usersRouter } from "./apps/users/users.router";
import "./apps/auth/strategies/local.stratgey";
import * as dotenv from "dotenv";
const cookieParser = require("cookie-parser");

dotenv.config();
const app = express();

//middleware
app.use(passport.initialize());
app.use(express.json());
app.use(express.Router());
app.use(cookieParser());

// routes
app.use("/api/users", usersRouter);
app.use("/api/posts", postsRouter);
app.use("/api/auth", authRouter);

// initalizing server
app.listen(process.env.PORT, () => {
  console.log("server is live");
});
