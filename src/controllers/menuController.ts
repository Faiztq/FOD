import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import { BASE_URL } from "../global";
import fs, { exists } from "fs";
import path from "path";
import { exist } from "joi";

const prisma = new PrismaClient({ errorFormat: "pretty" });

export const getAllMenus = async (request: Request, response: Response) => {
  try {
    const { search } = request.query;
    const allMenus = await prisma.menu.findMany({
      where: { name: { contains: search?.toString() || "" } },
    });
    return response
      .json({
        status: true,
        data: allMenus,
        message: `Menus has retrieved`,
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

export const createMenu = async (request: Request, response: Response) => {
  try {
    const { name, price, category, description } = request.body;
    const uuid = uuidv4();

    // add from data filename
    let filename = "";
    if (request.file) filename = request.file.filename;

    const newMenu = await prisma.menu.create({
      data: {
        uuid,
        name,
        price: Number(price),
        category,
        description,
        picture: filename,
      },
    });

    return response
      .json({
        status: true,
        data: newMenu,
        message: `New Menu has created`,
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

export const updateMenu = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const { name, price, category, description } = request.body;

    const findMenu = await prisma.menu.findFirst({
      where: { idMenu: Number(id) },
    });
    if (!findMenu)
      return response
        .status(200)
        .json({ status: false, message: `Menu is not found` });

    // default value filename of save data
    let filename = findMenu.picture;
    if (request.file) {
      // update filename by uploaded picture
      filename = request.file.filename;
      // check the old picture in the folder
      let path = `${BASE_URL}../public/menu_picture/${findMenu.picture}`;
      let exists = fs.existsSync(path);
      // delete the old exists picture if repload new life
      if (exists && findMenu.picture !== ``) fs.unlinkSync(path); // untuk menghapus
    }

    const updateMenu = await prisma.menu.update({
      data: {
        name: name || findMenu.name,
        price: price ? Number(price) : findMenu.price,
        category: category || findMenu.category,
        description: description || findMenu.description,
        picture: filename
      },
      where: { idMenu: Number(id) },
    });

    return response
      .json({
        status: true,
        data: updateMenu,
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

export const deleteMenu = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const findMenu = await prisma.menu.findFirst({
      where: { idMenu: Number(id) },
    });
    if (!findMenu)
      return response
        .status(200)
        .json({ status: false, message: `Menu is not found` });

    // check the old picture in the folder
    let path = `${BASE_URL}/../public/menu_picture/${findMenu.picture}`;
    let exists = fs.existsSync(path);
    // delete the old exists picture if reapload new file
    if (exists && findMenu.picture !== ``) fs.unlinkSync(path);

    const deletedMenu = await prisma.menu.delete({
      where: { idMenu: Number(id) },
    });
    return response
      .json({
        status: true,
        data: deletedMenu,
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

export const changePicture = async (request: Request, response: Response) => {
  try {
    const { id } = request.params;
    const findMenu = await prisma.menu.findFirst({
      where: { idMenu: Number(id) },
    });
    if (!findMenu)
      return response
        .status(200)
        .json({ status: false, massage: `Menu is not found` });

    // default value filename of save data
    let filename = findMenu.picture;
    if (request.file) {
      // update filename by uploaded picture
      filename = request.file.filename;
      // check the old picture in the folder
      let path = `${BASE_URL}../public/menu_picture/${findMenu.picture}`;
      let exists = fs.existsSync(path);
      // delete the old exists picture if repload new life
      if (exists && findMenu.picture !== ``) fs.unlinkSync(path); // untuk menghapus
    }

    // process to update picture in database
    const updatePicture = await prisma.menu.update({
      data: { picture: filename },
      where: { idMenu: Number(id) },
    });

    return response
      .json({
        status: true,
        data: updatePicture,
        message: `Picture Has Updated`,
      })
      .status(200);
  } catch (error) {
    return response
      .json({
        status: false,
        message: `There is Error. ${error}`,
      })
      .status(400);
  }
};
