import { Router } from "express";
import authenticateToken from "../../middleware/authorization";
import { deleteUser, editUserInfo, getAllUsers } from "./users.controller";

export const usersRouter = Router();

// get all users
usersRouter.get("/", getAllUsers);

// edit user info
usersRouter.patch("/:id", authenticateToken, editUserInfo);

// delete user
usersRouter.delete("/:id", authenticateToken, deleteUser);
