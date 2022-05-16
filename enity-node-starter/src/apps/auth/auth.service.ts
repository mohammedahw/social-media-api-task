import { User } from '.prisma/client';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '../../utils/config/config';

export const generateTokens = (user: User) => {
  return {
    tokens: {
      accessToken: jwt.sign({ id: user.id }, SECRET_KEY as string),
      refreshToken: jwt.sign({ id: user.id }, SECRET_KEY as string),
    },
    user,
  };
};
