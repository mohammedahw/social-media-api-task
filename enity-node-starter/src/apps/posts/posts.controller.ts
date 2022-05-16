import { Post, Prisma, User } from '@prisma/client';
import cookieParser = require('cookie-parser');
import { Request, Response } from 'express';
import { prisma } from '../../../src/prisma/prisma.service';

// get all posts
export const getAllPosts = async (req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany();
    return res.status(200).json({ success: true, posts: posts });
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

// get single post by post id
export const getSinglePostById = async (req: Request, res: Response) => {
  try {
    const userReq: any = req.user;
    const postId = parseInt(req.params.postId);
    const post: Post | null = await prisma.post.findUnique({
      where: {
        postId: postId,
      },
    });

    // increment views
    if (post) {
      if (!req.user)
        return res
          .cookie(postId.toString(), postId)
          .json({ success: true, post: post });
      // check if user liked the post
      const user = await prisma.user.findFirst({
        where: {
          id: userReq.id,
        },
        include: { seenPosts: true },
      });

      if (!user)
        return res
          .cookie(postId.toString(), postId)
          .json({ success: true, post: post });

      const isPostSeenByUser = user.seenPosts.filter(
        (post: Post) => postId === post.postId
      );

      if (isPostSeenByUser.length > 0)
        return res.json({ success: true, post: post });

      await prisma.user.update({
        where: {
          id: userReq.id,
        },
        include: {
          seenPosts: true,
        },
        data: {
          seenPosts: { connect: { postId: postId } },
        },
      });
      console.log('1');

      const updatedPost = await prisma.post.update({
        where: {
          postId: postId,
        },
        data: {
          views: { increment: 1 },
        },
      });
      return res.status(200).json({ success: true, post: updatedPost });
    }
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

// get user posts
export const getUserPosts = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        Posts: true,
      },
    });
    return res.status(200).json({ success: true, data: user });
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

// create a post
export const createPost = async (req: Request, res: Response) => {
  try {
    const user: any = req.user;
    if (!user) return res.json('null user');
    const post = await prisma.post.create({
      data: {
        user: { connect: { id: user.id } },
        postBody: req.body.postBody as string,
        postTitle: req.body.postTitle as string,
      },
    });
    return res.status(200).json({ success: true, post: post });
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

// edit post by postId
export const editPost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const userReq: any = req.user;
    if (!userReq) return res.json('null user');
    const user = await prisma.user.findUnique({
      where: {
        id: userReq.id,
      },
      select: { Posts: true },
    });
    if (!user) return res.json('unauthorized');
    const filterdPost = user.Posts.filter(
      (post: Post) => postId === post.postId
    );
    const { postTitle, postBody }: Post = req.body;

    // only edit post body
    if (!postTitle && postBody) {
      const editedPost = await prisma.post.update({
        where: {
          postId: filterdPost[0].postId,
        },
        data: {
          postBody: postBody,
        },
      });
      return res.json({ success: true, post: editedPost });
    }

    // only edit post title
    if (!postBody && postBody) {
      const editedPost = await prisma.post.update({
        where: {
          postId: filterdPost[0].postId,
        },
        data: {
          postTitle: postTitle,
        },
      });
      return res.json({ success: true, post: editedPost });
    }

    // edit both post title and post body
    const editedPost = await prisma.post.update({
      where: {
        postId: filterdPost[0].postId,
      },
      data: {
        postTitle: postTitle,
        postBody: postBody,
      },
    });
    return res.json({ success: true, post: editedPost });
  } catch (e) {
    return res.json({ success: false, error: e });
  }
};

// delete post by postId
export const deletePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const userReq: any = req.user;
    if (!userReq) return res.json('null user');
    const user = await prisma.user.findUnique({
      where: {
        id: userReq.id,
      },
      select: { Posts: true },
    });
    if (!user) return res.json('unauthorized!');
    const post = user.Posts.filter((post: Post) => postId === post.postId);
    if (post.length < 1)
      return res.json('you are unauthorized to delete this post');
    const deletedPost = await prisma.post.delete({
      where: {
        postId: post[0].postId,
      },
    });
    return res.json({ success: true, post: deletedPost });
  } catch (e) {
    return res.status(500).json({ success: false, error: e });
  }
};

// like a post by id
export const likePost = async (req: Request, res: Response) => {
  try {
    const postId = parseInt(req.params.postId);
    const reqUser: any = req.user;

    const user = await prisma.user.findUnique({
      where: {
        id: reqUser.id,
      },
      include: { likedPosts: true },
    });

    if (!user) return res.json('unauthorized');

    const post = await prisma.post.findUnique({
      where: {
        postId: postId,
      },
    });

    if (!post) return res.json('couldnt fint post');

    let isLikedByUser: boolean = false;

    user.likedPosts.forEach((p) => {
      if (p.userId === post.userId) isLikedByUser = true;
    });

    if (isLikedByUser) return res.json('you cant like your own post');

    if (user.likedPosts.includes(post))
      return res.json('you already liked this post');

    await prisma.user.update({
      where: {
        id: reqUser.id,
      },
      data: { likedPosts: { connect: { postId: postId } } },
    });

    await prisma.post.update({
      where: { postId: postId },
      data: {
        likes: { increment: 1 },
        likedBy: { connect: { id: reqUser.id } },
      },
    });

    return res.json({ success: true, post: post });
  } catch (e) {
    return res.json({ success: false, error: e });
  }
};
