import { Router } from 'express';
import { deleteUser, editUserInfo, getAllUsers } from './users.controller';

const userRouter = Router();

userRouter.get('/', getAllUsers);

userRouter.patch('/:id', editUserInfo);

userRouter.delete(':/id', deleteUser);

export { userRouter };
