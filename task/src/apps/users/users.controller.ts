import { prisma } from "../../../prisma/prisma.client";
import { Response, Request } from "express";
import { User } from "@prisma/client";
import { validateEmail } from "../../utils/validateEmail";

export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    return res.json({ success: true, users: users });
  } catch (e) {
    res.json({ success: false, error: e });
  }
};

export const editUserInfo = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userReq: any = req.user;
    if (id !== userReq.id) return res.json("unauthorized");
    const { email, name, username }: User = req.body;

    const oldUserInfo = await prisma.user.findUnique({
      where: {
        id: id,
      },
    });

    if (!oldUserInfo) return res.json("null user");

    // edit email only
    if (email && !name && !username) {
      if (!validateEmail(email))
        return res.json({ success: false, message: "invalid email" });
      const editedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: email,
        },
      });
      return res.json({ success: true, user: editedUser });
    }

    // edit name only
    if (name && !email && !username) {
      const editedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
        },
      });
      return res.json({ success: true, user: editedUser });
    }

    // edit username only
    if (username && !name && !email) {
      if (oldUserInfo.hasUpdatedUsername)
        return res.json({
          success: false,
          message: "you have already updated your username",
        });
      const editedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          username,
          hasUpdatedUsername: true,
        },
      });
      return res.json({ success: false, user: editedUser });
    }

    // edit name and email
    if (name && email && !username) {
      if (!validateEmail(email))
        return res.json({ success: false, message: "invalid email" });
      const editedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          email: email,
        },
      });
      return res.json({ success: true, user: editedUser });
    }

    // edit email and username
    if (email && username && !name) {
      if (!validateEmail(email))
        return res.json({ success: false, message: "invalid email" });
      if (oldUserInfo.hasUpdatedUsername) {
        return res.json({
          success: false,
          message: "you have already updated your username",
        });
      }
      const editedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          email: email,
          username: username,
        },
      });
      return res.json({ success: true, user: editedUser });
    }

    // edit name and username
    if (name && username && !email) {
      if (oldUserInfo.hasUpdatedUsername) {
        return res.json({
          success: false,
          message: "you have already updated your username",
        });
      }
      const editedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          name: name,
          username: username,
        },
      });
      return res.json({ success: true, user: editedUser });
    }

    // edit all info
    if (oldUserInfo.hasUpdatedUsername)
      return res.json({
        success: false,
        message: "you have already updated you username",
      });
    if (!validateEmail(email))
      return res.json({ success: false, message: "invalid email" });
    const editedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: {
        username: username,
        name: name,
        email: email,
      },
    });
    return res.json({ success: true, user: editedUser });
  } catch (e) {
    return res.json({ success: false, error: e });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const userReq: any = req.user;
    if (id !== userReq.id) return res.json("unauthorized");
    const deletedUser = await prisma.user.delete({
      where: {
        id: id,
      },
    });
    return res.json({ success: true, user: deletedUser });
  } catch (e) {
    return res.json({ success: false, error: e });
  }
};
