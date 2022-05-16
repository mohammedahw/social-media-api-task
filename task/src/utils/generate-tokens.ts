import { User } from "@prisma/client";
import * as jwt from "jsonwebtoken";

export default function generateTokens(user: User) {
  return {
    tokens: {
      accessToken: jwt.sign({ id: user.id }, process.env.SECRET_KEY as string, {
        expiresIn: "7d",
      }),
      refreshToken: jwt.sign(
        { id: user.id },
        process.env.SECRET_KEY as string,
        { expiresIn: "14d" }
      ),
    },
    user,
  };
}
