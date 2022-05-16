import { Router } from 'express';
import authenticateToken from 'src/middlewares/authorization';
import isLoggedIn from 'src/middlewares/isLoggedIn';
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePostById,
  likePost,
} from './posts.controller';

const postsRouter = Router();

// get all posts
postsRouter.get('/', getAllPosts);

// get single post by id
postsRouter.get('/:postId', isLoggedIn, getSinglePostById);

// create post
postsRouter.post('/', authenticateToken, createPost);

// edit a post by id
postsRouter.patch('/:postId', authenticateToken, editPost);

// delete a post by id
postsRouter.delete('/:postId', authenticateToken, deletePost);

// like a post by id
postsRouter.patch('/:postId/like', authenticateToken, likePost);

export { postsRouter };
