import { Request, Response } from "express";
import { PrismaClient, Role } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import md5 from "md5";
import { sign } from "jsonwebtoken";
import { BASE_URL, SECRET } from "../global";
import fs, { exists } from "fs";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllUser = async (request: Request, response: Response) => {
  try {
    const { search } = request.query;
    const alluser = await prisma.user.findMany({
      where: { name: { contains: search?.toString() || "" } },
    });
    return response
      .json({
        status: true,
        data: alluser,
        message: `User Has Retrivied`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const createUser = async (request: Request, response: Response) => {
  try {
    const { name, email, password, role } = request.body;
    const uuid = uuidv4();

    const newUser = await prisma.user.create({
      data: { uuid, name, email, password: md5(password), role },
    });

    return response
      .json({
        status: true,
        data: newUser,
        message: `New User Has Created`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error.${error}`,
      })
      .status(400);
  }
};

export const updatedUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name, email, password, role } = request.body;
    const updateUser = await prisma.user.update({
      where: { idUser: Number(id) },
      data: { name, email, password, role },
    });

    return response
      .json({
        status: true,
        data: updateUser,
        message: `Menu has update`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const deleteAllUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const findUser = await prisma.user.findFirst({
      where: { idUser: Number(id) },
    });
    if (!findUser)
      return response
        .status(200)
        .json({ status: false, message: `Menu is not found` });

    // check the old picture in the folder
    let path = `${BASE_URL}/../public/profil_picture/${findUser.profile_picture}`;
    let exists = fs.existsSync(path);
    // delete the old exists picture if reapload new file
    if (exists && findUser.profile_picture !== ``) fs.unlinkSync(path);

    const deletedUser = await prisma.user.delete({
      where: { idUser: Number(id) },
    });
    return response
      .json({
        status: true,
        data: deleteAllUser,
        message: `Menu has deleted`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error ${error}`,
      })
      .status(400);
  }
};

export const authentication = async (request: Request, response: Response) => {
  try {
    const { email, password } = request.body;

    const findUser = await prisma.user.findFirst({
      where: { email, password: md5(password) },
    });

    if (!findUser)
      return response.status(200).json({
        status: false,
        logged: false,
        message: `Email or password is invalid`,
      });

    let data = {
      id: findUser.idUser,
      name: findUser.name,
      email: findUser.email,
      role: findUser.role,
    };

    let payload = JSON.stringify(data);

    // generate token
    let token = sign(payload, SECRET || "token");

    return response
      .status(200)
      .json({ status: true, logged: true, message: `Login Success`, token });
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is an error. ${error}`,
      })
      .status(400);
  }
};

export const profileUser = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const findUser = await prisma.user.findFirst({
      where: { idUser: Number(id) },
    });
    if (!findUser) {
      return response.json({ status: false, message: "User not found" });
    }

    let filename = findUser.profile_picture;

    if (request.file) {
      filename = request.file.filename;
      let path = `${BASE_URL}/public/profile_picture/${filename}`;
      let exists = fs.existsSync(path);
      if (exists && findUser.profile_picture !== ``) {
        fs.unlinkSync(path);
      }
    }

    const updateUser = await prisma.user.update({
      where: { idUser: Number(id) },
      data: {
        profile_picture: filename,
      },
    });

    return response
      .json({
        status: true,
        data: updateUser,
        message: "User has retrivied successfully",
      })
      .status(200);
  } catch (error) {
    return response
      .json({ status: false, message: `There is an error.${error}` })

      .status(400);
  }
};
