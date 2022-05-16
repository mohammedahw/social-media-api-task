import { User } from "@prisma/client";
import { Request, Response } from "express";
import { prisma } from "../../../prisma/prisma.client";
import generateTokens from "../../utils/generate-tokens";

// register
export const register = async (req: Request, res: Response) => {
  // add viewed posts from cookies
  const user = req.user as User;
  Object.keys(req.cookies).map(async (value) => {
    const postId = parseInt(value);
    console.log(postId);
    await prisma.user.update({
      where: {
        id: user.id,
      },
      include: {
        seenPosts: true,
      },
      data: {
        seenPosts: { connect: { postId: postId } },
      },
    });
    await prisma.post.update({
      where: {
        postId: postId,
      },
      data: { views: { increment: 1 } },
    });
  });
  return res.json(generateTokens(user));
};

// login
export const login = async (req: Request, res: Response) => {
  const user = req.user as User;

  const userInfo = await prisma.user.findUnique({
    where: {
      id: user.id,
    },
    select: { Posts: true, seenPosts: true },
  });

  if (!userInfo) return res.json("invalid information");

  const userPosts = userInfo.Posts;

  for (const post of userPosts) {
    Object.keys(req.cookies).map(async (value) => {
      const postId = parseInt(value);
      if (post.postId !== postId) {
        await prisma.user.update({
          where: {
            id: user.id,
          },
          include: {
            seenPosts: true,
          },
          data: {
            seenPosts: { connect: { postId: postId } },
          },
        });
        await prisma.post.update({
          where: {
            postId: postId,
          },
          data: { views: { increment: 1 } },
        });
      }
    });
  }

  return res.json(generateTokens(user));
};
