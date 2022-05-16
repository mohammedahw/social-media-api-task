import { Router } from 'express';
import { authRouter } from './apps/auth/auth.router';
import { postsRouter } from './apps/posts/posts.router';
import { userRouter } from './apps/users/users.router';

const router = Router();

router.use('/auth', authRouter);
router.use('/users', userRouter);
router.use('/posts', postsRouter);

export default router;
