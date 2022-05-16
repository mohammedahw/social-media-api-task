import { Router } from "express";
import authenticateToken from "../../middleware/authorization";
import isLoggedIn from "../../middleware/isLoggedIn";
import {
  createPost,
  deletePost,
  editPost,
  getAllPosts,
  getSinglePostById,
  likePost,
} from "./posts.controller";

export const postsRouter = Router();

// get all posts
postsRouter.get("/", getAllPosts);

// get single post by id
postsRouter.get("/:postId", isLoggedIn, getSinglePostById);

// create post
postsRouter.post("/", authenticateToken, createPost);

// edit a post by id
postsRouter.patch("/:postId", authenticateToken, editPost);

// delete a post by id
postsRouter.delete("/:postId", authenticateToken, deletePost);

// like a post by id
postsRouter.patch("/:postId/like", authenticateToken, likePost);
